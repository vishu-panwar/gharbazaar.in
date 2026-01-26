
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyToken, TokenPayload } from '../utils/jwt';
export interface AuthenticatedSocket extends Socket {
    user: TokenPayload;  // User data from JWT token
}
export const authenticateSocket = (
    socket: Socket,
    next: (err?: ExtendedError) => void
) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            console.warn('⚠️  Socket connection rejected: No token provided');
            return next(new Error('Authentication required. Please provide a valid token.'));
        }
        const decoded = verifyToken(token);
        (socket as AuthenticatedSocket).user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        console.log(`✅ Socket authenticated: ${decoded.email} (${decoded.userId})`);
        next();

    } catch (error) {
        console.error('❌ Socket authentication failed:', error);
        const errorMessage = error instanceof Error
            ? error.message
            : 'Authentication failed. Please login again.';
        next(new Error(errorMessage));
    }
};
export const getSocketUser = (socket: Socket): TokenPayload => {
    return (socket as AuthenticatedSocket).user;
};

