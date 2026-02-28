import { Request, Response } from 'express';
import { prisma } from '../utils/database';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveUserByUidOrId = async (identifier?: string | null) => {
  const value = (identifier || '').trim();
  if (!value) return null;

  const byUid = await prisma.user.findUnique({ where: { uid: value } });
  if (byUid) return byUid;

  if (!UUID_REGEX.test(value)) return null;
  return prisma.user.findUnique({ where: { id: value } });
};

const DEFAULT_PLANS = [
  {
    name: 'buyer-basic',
    displayName: 'Basic Buyer Access',
    description: 'Access property details, direct contact, and inquiry workflow for one month.',
    type: 'buyer',
    price: 599,
    durationDays: 30,
    viewLimit: 500,
    consultationLimit: 25,
    listingLimit: 0,
    featuredLimit: 0,
    prioritySupport: false,
    verifiedBadge: false,
    directContact: true,
    isPopular: false,
  },
  {
    name: 'buyer-smart',
    displayName: 'Smart Buyer Plan',
    description: 'Extended buyer access with higher inquiry limits and priority support.',
    type: 'buyer',
    price: 2999,
    durationDays: 180,
    viewLimit: 3000,
    consultationLimit: 120,
    listingLimit: 0,
    featuredLimit: 0,
    prioritySupport: true,
    verifiedBadge: false,
    directContact: true,
    isPopular: true,
  },
  {
    name: 'buyer-pro',
    displayName: 'Pro Buyer Plan',
    description: 'One-year premium buyer access with maximum consultation limits.',
    type: 'buyer',
    price: 4999,
    durationDays: 365,
    viewLimit: 10000,
    consultationLimit: 500,
    listingLimit: 0,
    featuredLimit: 0,
    prioritySupport: true,
    verifiedBadge: true,
    directContact: true,
    isPopular: false,
  },
  {
    name: 'seller-basic',
    displayName: 'Basic Seller Plan',
    description: 'Publish one active listing with direct buyer inquiries.',
    type: 'seller',
    price: 999,
    durationDays: 30,
    viewLimit: 0,
    consultationLimit: 20,
    listingLimit: 1,
    featuredLimit: 0,
    prioritySupport: false,
    verifiedBadge: false,
    directContact: true,
    isPopular: false,
  },
  {
    name: 'seller-premium',
    displayName: 'Premium Seller Plan',
    description: 'Publish up to 24 listings for six months with premium support.',
    type: 'seller',
    price: 19999,
    durationDays: 180,
    viewLimit: 0,
    consultationLimit: 300,
    listingLimit: 24,
    featuredLimit: 8,
    prioritySupport: true,
    verifiedBadge: true,
    directContact: true,
    isPopular: true,
  },
  {
    name: 'seller-pro',
    displayName: 'Pro Seller Plan',
    description: 'Publish up to 60 listings for one year with priority exposure.',
    type: 'seller',
    price: 49999,
    durationDays: 365,
    viewLimit: 0,
    consultationLimit: 1000,
    listingLimit: 60,
    featuredLimit: 20,
    prioritySupport: true,
    verifiedBadge: true,
    directContact: true,
    isPopular: false,
  },
];

const ensureDefaultPlans = async () => {
  const existingCount = await prisma.plan.count({ where: { isActive: true } });
  if (existingCount > 0) return;

  await prisma.$transaction(
    DEFAULT_PLANS.map((plan) =>
      prisma.plan.upsert({
        where: { name: plan.name },
        update: {
          displayName: plan.displayName,
          description: plan.description,
          type: plan.type,
          price: plan.price,
          durationDays: plan.durationDays,
          viewLimit: plan.viewLimit,
          consultationLimit: plan.consultationLimit,
          listingLimit: plan.listingLimit,
          featuredLimit: plan.featuredLimit,
          prioritySupport: plan.prioritySupport,
          verifiedBadge: plan.verifiedBadge,
          directContact: plan.directContact,
          isActive: true,
          isPopular: plan.isPopular,
        },
        create: {
          ...plan,
          currency: 'INR',
          isActive: true,
        },
      })
    )
  );
};

/**
 * Get all available plans
 * @route GET /api/v1/plans
 * @access Public
 */
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    await ensureDefaultPlans();

    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }, { price: 'asc' }],
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

    const user = await resolveUserByUidOrId(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'active',
        endDate: { gt: new Date() },
      },
      include: {
        plan: true,
      },
      orderBy: { endDate: 'desc' },
    });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active plan found',
      });
    }

    const stats: Record<string, any> = (subscription.usageStats as Record<string, any> | null) || {};

    res.status(200).json({
      success: true,
      data: {
        plan: subscription.plan,
        userPlan: {
          id: subscription.id,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          isValid: true,
          usage: {
            viewsUsed: Number(stats.viewsUsed || 0),
            contactsUsed: Number(stats.consultationsUsed || 0),
            listingsUsed: Number(stats.listingsUsed || 0),
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

    const user = await resolveUserByUidOrId(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Mock/dev payment verification support.
    const isPaymentValid =
      String(paymentId).startsWith('pay_') ||
      String(paymentId).startsWith('pay.') ||
      String(paymentId).startsWith('txn_') ||
      paymentId === 'demo-payment';

    if (!isPaymentValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment verification',
      });
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    await prisma.subscription.updateMany({
      where: { userId: user.id, status: 'active' },
      data: { status: 'expired' },
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'active',
        startDate,
        endDate: expiryDate,
        usageStats: {
          viewsUsed: 0,
          consultationsUsed: 0,
          listingsUsed: 0,
        },
      },
      include: {
        plan: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'system',
        title: 'Subscription Activated',
        message: `Your ${plan.displayName} plan is active until ${expiryDate.toLocaleDateString()}`,
        priority: 'high',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        userPlan: subscription,
        plan,
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
