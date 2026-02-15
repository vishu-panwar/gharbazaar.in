import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config, { validateConfig } from './config';
import { prisma } from './utils/prisma';
// import { initializeSocket } from './socket';
import apiRoutes from './routes';
import { auditMiddleware } from './middleware/audit.middleware';

const startServer = async () => {
    try {
        console.log('\n🔧 Validating configuration...');
        validateConfig();

        console.log('\n💾 Attempting to connect to database...');
        try {
            await prisma.$connect();
        } catch (error) {
            console.warn('⚠️  Continuing without database - Socket.IO will work but data won\'t persist');
        }

        const app = express();
        const httpServer = createServer(app);

        app.use(helmet());
        app.use(cors({
            origin: config.allowedOrigins,
            credentials: true,
        }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Minimal setup for debug
        app.get('/', (req, res) => {
            res.json({ success: true, message: 'Debug Server Running' });
        });

        // Routes and Middleware
        app.use('/api/v1', auditMiddleware);
        app.use('/api/v1', apiRoutes);

        // Socket disabled for debugging
        // const io = initializeSocket(httpServer);
        // app.set('io', io);

        httpServer.listen(config.port, () => {
            console.log(`Debug Server running on port ${config.port}`);
        });

    } catch (error) {
        console.error('Fatal Error:', error);
    }
};

startServer();
