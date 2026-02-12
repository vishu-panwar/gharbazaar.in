import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

/**
 * Get all available plans
 * @route GET /api/v1/plans
 * @access Public
 */
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans',
      error: error.message,
    });
  }
};

/**
 * Get current user's active plan
 * @route GET /api/v1/user/plan
 * @access Private (requires authentication)
 */
export const getUserPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Find active subscription using user ID (uid in User model matches userId here)
    // We need to find the user first to get their ID if userId is the UID
    const user = await prisma.user.findUnique({ where: { uid: userId } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id, // Use internal UUID
        status: 'active',
        endDate: { gt: new Date() }
      },
      include: {
        plan: true
      }
    });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active plan found',
      });
    }

    // Map stats safely
    const stats: any = subscription.usageStats || {};

    res.status(200).json({
      success: true,
      data: {
        plan: subscription.plan,
        userPlan: {
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          isValid: true,
          usage: {
            viewsUsed: stats.viewsUsed || 0,
            contactsUsed: stats.consultationsUsed || 0,
            listingsUsed: stats.listingsUsed || 0,
          },
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching user plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user plan',
      error: error.message,
    });
  }
};

/**
 * Purchase/Subscribe to a plan
 * @route POST /api/v1/user/plan/purchase
 * @access Private
 */
export const purchasePlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { planId, paymentId } = req.body;

    if (!userId || !planId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Get internal user ID
    const user = await prisma.user.findUnique({ where: { uid: userId } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // --- Mock Payment Verification ---
    console.log(`🏦 Verifying payment ${paymentId} for plan ${plan.name}`);
    const isPaymentValid = paymentId.startsWith('pay_') || paymentId === 'demo-payment';

    if (!isPaymentValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment verification',
      });
    }

    // Calculate expiry date
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    // Deactivate existing active subscriptions
    await prisma.subscription.updateMany({
      where: { userId: user.id, status: 'active' },
      data: { status: 'expired' }
    });

    // Create new Subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'active',
        paymentId: paymentId !== 'demo-payment' ? paymentId : undefined, // Assuming paymentId links to Transaction ID if exists
        startDate,
        endDate: expiryDate,
        usageStats: {
            viewsUsed: 0,
            consultationsUsed: 0,
            listingsUsed: 0,
        }
      },
      include: {
        plan: true
      }
    });

    // Update User model limits (keeping some denormalized data if schema supports it, strictly speaking strict relationships are better but this aligns with logic)
    // Note: Plan limits are in the Plan model, User model fields like viewLimit are overrides or caches
    // Prisma User model DOES NOT have viewLimit, etc. in the current schema.
    // Limits should be derived from the active subscription.
    /*
    await prisma.user.update({
        where: { id: user.id },
        data: {
            // viewLimit: plan.viewLimit,
            // consultationLimit: plan.consultationLimit,
            // listingLimit: plan.listingLimit
        }
    });
    */

    // Send Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'system',
        title: 'Subscription Activated',
        message: `Your ${plan.name} plan is now active until ${expiryDate.toLocaleDateString()}`,
        priority: 'high'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        userPlan: subscription,
        plan
      },
      message: 'Plan purchased successfully',
    });
  } catch (error: any) {
    console.error('Error purchasing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase plan',
      error: error.message,
    });
  }
};
