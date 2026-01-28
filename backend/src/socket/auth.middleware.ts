
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
<<<<<<< HEAD

        // Allow connections without token in development for demo mode
        if (!token) {
            console.warn('⚠️  Socket connection without token - allowing for demo/development mode');

            // Create a demo user for the socket
            (socket as AuthenticatedSocket).user = {
                userId: 'demo-user-' + socket.id,
                email: 'demo@gharbazaar.in',
                role: 'buyer',
            };

            return next();
        }

        // Verify token if provided
=======
        if (!token) {
            console.warn('⚠️  Socket connection rejected: No token provided');
            return next(new Error('Authentication required. Please provide a valid token.'));
        }
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8
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
<<<<<<< HEAD

        // Still allow connection in development with demo user
        console.warn('⚠️  Invalid token - allowing connection with demo user for development');
        (socket as AuthenticatedSocket).user = {
            userId: 'demo-user-' + socket.id,
            email: 'demo@gharbazaar.in',
            role: 'buyer',
        };
        next();
=======
        const errorMessage = error instanceof Error
            ? error.message
            : 'Authentication failed. Please login again.';
        next(new Error(errorMessage));
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8
    }
};
export const getSocketUser = (socket: Socket): TokenPayload => {
    return (socket as AuthenticatedSocket).user;
};

