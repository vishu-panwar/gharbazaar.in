import { Request, Response, NextFunction } from 'express';
import UserPlan from '../models/userPlan.model';
import Plan from '../models/plan.model';
import { isMongoDBAvailable } from '../utils/memoryStore';

/**
 * Plan Guard Middleware
 * Validates user has active plan with required permissions
 * DOES NOT modify existing auth flow - works alongside it
 */

interface PlanGuardOptions {
    planType: 'buyer' | 'seller';
    feature?: string;
    incrementUsage?: string;
}

/**
 * Middleware to require active plan
 * Attaches plan info to request without breaking existing logic
 */
export const requireActivePlan = (options: PlanGuardOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            
            if (!user || !user.userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // Skip plan check if MongoDB not available (demo/memory mode)
            if (!isMongoDBAvailable()) {
                console.log(`⚠️  Plan check skipped (memory mode) for ${user.email}`);
                (req as any).userPlan = {
                    demo: true,
                    unlimited: true
                };
                return next();
            }

            // Find active plan
            const userPlan = await UserPlan.findOne({
                userId: user.userId,
                status: 'active',
                expiryDate: { $gt: new Date() }
            }).populate('planId');

            if (!userPlan || !userPlan.planId) {
                return res.status(403).json({
                    success: false,
                    error: `Active ${options.planType} plan required`,
                    code: 'PLAN_REQUIRED',
                    redirectTo: '/dashboard/pricing'
                });
            }

            const plan = userPlan.planId as any;

            // Verify plan type matches
            if (plan.type !== options.planType) {
                return res.status(403).json({
                    success: false,
                    error: `This action requires a ${options.planType} plan`,
                    code: 'WRONG_PLAN_TYPE'
                });
            }

            // Check specific feature if requested
            if (options.feature) {
                const featureValue = plan.features[options.feature];
                if (featureValue === false || featureValue === 0 || featureValue === undefined) {
                    return res.status(403).json({
                        success: false,
                        error: `Your plan does not include ${options.feature}`,
                        code: 'FEATURE_NOT_INCLUDED',
                        upgrade: true
                    });
                }

                // Check usage limits
                if (typeof featureValue === 'number') {
                    const usageKey = (options.incrementUsage || options.feature.replace('Limit', 'Used')) as string;
                    const currentUsage = (userPlan.usageStats as any)[usageKey] || 0;
                    
                    if (currentUsage >= featureValue) {
                        return res.status(403).json({
                            success: false,
                            error: `You have reached your ${options.feature} limit`,
                            code: 'LIMIT_REACHED',
                            currentUsage,
                            limit: featureValue,
                            upgrade: true
                        });
                    }
                }
            }

            // Attach plan info to request for controllers to use
            (req as any).userPlan = {
                id: userPlan._id,
                planId: plan._id,
                planName: plan.name,
                planType: plan.type,
                features: plan.features,
                usageStats: userPlan.usageStats,
                expiryDate: userPlan.expiryDate
            };

            next();

        } catch (error) {
            console.error('❌ Plan guard error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to verify plan status'
            });
        }
    };
};

/**
 * Middleware to increment usage counter after successful action
 * Call this AFTER the main controller succeeds
 */
export const incrementPlanUsage = (usageField: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPlan = (req as any).userPlan;
            const user = (req as any).user;

            // Skip if demo mode or no plan attached
            if (!userPlan || userPlan.demo || !user || !isMongoDBAvailable()) {
                return next();
            }

            // Increment usage
            await UserPlan.findByIdAndUpdate(userPlan.id, {
                $inc: { [`usageStats.${usageField}`]: 1 }
            });

            console.log(`📊 Incremented ${usageField} for user ${user.email}`);
            next();

        } catch (error) {
            console.error('❌ Error incrementing usage:', error);
            // Don't fail the request if usage tracking fails
            next();
        }
    };
};

/**
 * Optional: Check plan without enforcing (for soft limits/warnings)
 */
export const checkPlanOptional = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        
        if (!user || !isMongoDBAvailable()) {
            (req as any).userPlan = null;
            return next();
        }

        const userPlan = await UserPlan.findOne({
            userId: user.userId,
            status: 'active',
            expiryDate: { $gt: new Date() }
        }).populate('planId');

        (req as any).userPlan = userPlan || null;
        next();

    } catch (error) {
        console.error('❌ Optional plan check error:', error);
        (req as any).userPlan = null;
        next();
    }
};
