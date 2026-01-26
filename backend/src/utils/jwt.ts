
import jwt from 'jsonwebtoken';
import config from '../config';
export interface TokenPayload {
    userId: string;          // Unique user identifier
    email: string;           // User's email
    role?: string;           // User role (buyer, seller, employee, etc.)
}
export interface DecodedToken extends TokenPayload {
    iat: number;   // Issued at (timestamp)
    exp: number;   // Expires at (timestamp)
}
export const generateToken = (payload: TokenPayload): string => {
    try {
        const token = jwt.sign(
            payload,
            config.jwtSecret,
            {
                expiresIn: config.jwtExpiresIn,     // e.g., '7d' for 7 days
                issuer: 'gharbazaar-backend',        // Who issued this token
                audience: 'gharbazaar-frontend',     // Who should use this token
            } as jwt.SignOptions
        );

        return token;
    } catch (error) {
        console.error('❌ Error generating JWT token:', error);
        throw new Error('Failed to generate authentication token');
    }
};
export const verifyToken = (token: string): DecodedToken => {
    try {
        const decoded = jwt.verify(
            token,
            config.jwtSecret,
            {
                issuer: 'gharbazaar-backend',
                audience: 'gharbazaar-frontend',
            }
        ) as DecodedToken;

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired. Please login again.');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token. Please login again.');
        } else {
            throw new Error('Token verification failed.');
        }
    }
};
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const decoded = jwt.decode(token) as DecodedToken;
        return decoded;
    } catch (error) {
        console.error('❌ Error decoding token:', error);
        return null;
    }
};
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeToken(token);
        if (!decoded) return true;
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};
export const refreshToken = (oldToken: string): string => {
    try {
        const decoded = verifyToken(oldToken);
        const newToken = generateToken({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });

        return newToken;
    } catch (error) {
        throw new Error('Cannot refresh invalid token');
    }
};

