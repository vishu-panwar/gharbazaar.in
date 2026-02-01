import { Request, Response } from 'express';
import Plan from '../models/plan.model';
import UserPlan from '../models/userPlan.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import mongoose from 'mongoose';

/**
 * Get all available plans
 * @route GET /api/v1/plans
 * @access Public
 */
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });

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

    // Find active plan using direct query instead of static method
    const userPlan = await UserPlan.findOne({
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    if (!userPlan) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active plan found',
      });
    }

    const plan = await Plan.findById(userPlan.planId);

    if (!plan) {
      // If plan is missing but UserPlan exists, we should probably handle it gracefully
      // For now, return a 404-like response or generic error
      console.error(`Active userPlan ${userPlan._id} refers to missing plan ${userPlan.planId}`);
      return res.status(404).json({
        success: false,
        message: 'Plan details not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        plan,
        userPlan: {
          startDate: userPlan.startDate,
          endDate: userPlan.expiryDate,
          isValid: userPlan.isValid ? userPlan.isValid() : (userPlan.status === 'active' && new Date(userPlan.expiryDate) > new Date()),
          usage: {
            viewsUsed: userPlan.usageStats?.viewsUsed || 0,
            contactsUsed: userPlan.usageStats?.consultationsUsed || 0,
            listingsUsed: userPlan.usageStats?.listingsUsed || 0,
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

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // --- Mock Payment Verification ---
    // In production, use Razorpay/Stripe SDK to verify paymentId
    console.log(`🏦 Verifying payment ${paymentId} for plan ${plan.name}`);
    const isPaymentValid = paymentId.startsWith('pay_') || paymentId === 'demo-payment';

    if (!isPaymentValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment verification',
      });
    }

    // Calculate expiry date (default 30 days if not specified)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Deactivate existing plans
    await UserPlan.updateMany({ userId, status: 'active' }, { status: 'expired' });

    // Create new UserPlan
    const userPlan = await UserPlan.create({
      userId,
      planId,
      status: 'active',
      paymentId,
      startDate: new Date(),
      expiryDate,
      usageStats: {
        viewsUsed: 0,
        consultationsUsed: 0,
        listingsUsed: 0,
      }
    });

    // Update User model with plan details for faster access
    await User.findOneAndUpdate({ uid: userId }, {
      planType: plan.name,
      listingLimit: plan.features.listingLimit || 3,
      viewLimit: plan.features.viewLimit || 10,
      consultationLimit: plan.features.consultationLimit || 0
    });

    // Send Notification
    await Notification.create({
      userId,
      type: 'system',
      title: 'Subscription Activated',
      message: `Your ${plan.name} plan is now active until ${expiryDate.toLocaleDateString()}`,
      priority: 'high'
    });

    res.status(200).json({
      success: true,
      data: {
        userPlan,
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
