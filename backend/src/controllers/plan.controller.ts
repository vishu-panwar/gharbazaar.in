import { Request, Response } from 'express';
import Plan from '../models/plan.model';
import UserPlan from '../models/userPlan.model';

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
    const userId = (req as any).user?.id;

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

    res.status(200).json({
      success: true,
      data: {
        plan,
        userPlan: {
          startDate: userPlan.startDate,
          endDate: userPlan.expiryDate,
          isValid: userPlan.isValid(),
          usage: {
            viewsUsed: userPlan.usageStats.viewsUsed || 0,
            contactsUsed: userPlan.usageStats.consultationsUsed || 0,
            listingsUsed: userPlan.usageStats.listingsUsed || 0,
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
