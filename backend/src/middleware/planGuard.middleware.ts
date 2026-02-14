import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { Decimal } from '@prisma/client/runtime/library';
import { isDatabaseAvailable } from '../utils/memoryStore';

// For internal transition, we can alias or just use the new better name
const isMongoDBAvailable = isDatabaseAvailable;

/**
 * Plan Guard Middleware
 * Validates user has active plan with required permissions
 */

interface PlanGuardOptions {
    planType: 'buyer' | 'seller';
    feature?: 'viewLimit' | 'listingLimit' | 'consultationLimit' | 'featuredLimit';
    incrementUsage?: string;
}

/**
 * Middleware to require active plan
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

            // Skip plan check if Database not available (demo/memory mode)
            const dbAvailable = await isDatabaseAvailable();
            if (!dbAvailable) {
                console.log(`⚠️  Plan check skipped (memory mode) for ${user.email}`);
                (req as any).userPlan = {
                    demo: true,
                    unlimited: true
                };
                return next();
            }

            // Find active plan via Subscription
            const subscription = await prisma.subscription.findFirst({
                where: {
                    userId: user.id || user.userId, 
                    status: 'active',
                    endDate: { gt: new Date() }
                },
                include: { plan: true }
            });

            if (!subscription || !subscription.plan) {
                return res.status(403).json({
                    success: false,
                    error: `Active ${options.planType} plan required`,
                    code: 'PLAN_REQUIRED',
                    redirectTo: '/dashboard/pricing'
                });
            }

            const plan = subscription.plan;

            // Verify plan type matches
            if (plan.type !== options.planType && plan.type !== 'combined') {
                return res.status(403).json({
                    success: false,
                    error: `This action requires a ${options.planType} plan`,
                    code: 'WRONG_PLAN_TYPE'
                });
            }

            // Check specific feature if requested
            if (options.feature) {
                const featureValue = (plan as any)[options.feature];
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
                    const currentUsage = ((subscription.usageStats as any) || {}) [usageKey] || 0;
                    
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
                id: subscription.id,
                planId: plan.id,
                planName: plan.name,
                planType: plan.type,
                viewLimit: plan.viewLimit,
                consultationLimit: plan.consultationLimit,
                listingLimit: plan.listingLimit,
                featuredLimit: plan.featuredLimit,
                usageStats: subscription.usageStats || {},
                expiryDate: subscription.endDate
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

            // Increment usage
            const currentStats = (userPlan.usageStats as any) || {};
            const updatedStats = {
                ...currentStats,
                [usageField]: (currentStats[usageField] || 0) + 1
            };

            await prisma.subscription.update({
                where: { id: userPlan.id },
                data: {
                    usageStats: updatedStats
                }
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
        
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: user.id || user.userId,
                status: 'active',
                endDate: { gt: new Date() }
            },
            include: { plan: true }
        });

        (req as any).userPlan = subscription || null;
        next();

    } catch (error) {
        console.error('❌ Optional plan check error:', error);
        (req as any).userPlan = null;
        next();
    }
};
