// Chat utility functions for starting conversations
import { backendApi } from './backendApi';

interface StartChatOptions {
    otherUserId: string;
    type: 'buyer-seller' | 'buyer-employee' | 'seller-employee';
    propertyId?: string;
}

/**
 * Start or get existing conversation with another user
 */
export async function startChat(options: StartChatOptions) {
    try {
        const response = await backendApi.chat.createConversation(options);

        if (response.success) {
            return {
                success: true,
                conversationId: response.data.conversation.id,
                conversation: response.data.conversation,
            };
        }

        return { success: false, error: response.error };
    } catch (error) {
        console.error('Error starting chat:', error);
        return { success: false, error: 'Failed to start chat' };
    }
}

/**
 * Start chat with property seller
 */
export async function chatWithSeller(sellerId: string, propertyId: string) {
    return startChat({
        otherUserId: sellerId,
        type: 'buyer-seller',
        propertyId,
    });
}

/**
 * Start chat with employee/support
 */
export async function chatWithSupport(employeeId: string) {
    return startChat({
        otherUserId: employeeId,
        type: 'buyer-employee',
    });
}

/**
 * Start chat from employee to buyer
 */
export async function chatWithBuyer(buyerId: string) {
    return startChat({
        otherUserId: buyerId,
        type: 'buyer-employee',
    });
}

/**
 * Start chat from employee to seller
 */
export async function chatWithSellerAsEmployee(sellerId: string) {
    return startChat({
        otherUserId: sellerId,
        type: 'seller-employee',
    });
}
