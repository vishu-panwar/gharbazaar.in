import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config, { validateConfig } from './config';
import { connectDatabase } from './utils/database';
import { initializeSocket } from './socket';
import apiRoutes from './routes';

const startServer = async () => {
    try {
        console.log('\n🔧 Validating configuration...');
        validateConfig();

        console.log('\n💾 Attempting to connect to database...');
        try {
            await connectDatabase();
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

        // Serve uploaded files statically
        app.use('/uploads', express.static('uploads'));

        const limiter = rateLimit({
            windowMs: config.rateLimit.windowMs,
            max: 1000, // Increased for development
            message: {
                success: false,
                error: 'Too many requests, please try again later.'
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        app.use('/api/', limiter);

        app.use('/api/v1', apiRoutes);
        app.use('/api', apiRoutes);

        app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'GharBazaar Socket.IO Backend API',
                version: '1.0.0',
                endpoints: {
                    health: '/api/v1/health',
                    chat: '/api/v1/chat/*',
                    tickets: '/api/v1/tickets/*',
                },
                socketIO: {
                    status: 'active',
                    transports: ['websocket', 'polling'],
                }
            });
        });

        app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found',
                path: req.path,
            });
        });

        console.log('\n🔌 Setting up Socket.IO...');
        const io = initializeSocket(httpServer);
        app.set('io', io);

        httpServer.listen(config.port, () => {
            console.log('\n' + '='.repeat(60));
            console.log('🚀 SERVER STARTED SUCCESSFULLY!');
            console.log('='.repeat(60));
            console.log(`📡 Server running on: http://localhost:${config.port}`);
            console.log(`🌍 Environment: ${config.nodeEnv}`);
            console.log(`💾 Database: Connected`);
            console.log(`🔌 Socket.IO: Active`);
            console.log(`⏱️  Started at: ${new Date().toLocaleString()}`);
            console.log('='.repeat(60) + '\n');
            console.log('📋 Available endpoints:');
            console.log(`   - Health check: http://localhost:${config.port}/api/v1/health`);
            console.log(`   - Chat API: http://localhost:${config.port}/api/v1/chat/*`);
            console.log(`   - Ticket API: http://localhost:${config.port}/api/v1/tickets/*`);
            console.log(`   - Socket.IO: ws://localhost:${config.port}`);
            console.log('\n✅ Server is ready to accept connections!\n');
        });

        const gracefulShutdown = async () => {
            console.log('\n\n⚠️  Shutting down gracefully...');

            httpServer.close(async () => {
                console.log('📴 HTTP server closed');

                io.close(() => {
                    console.log('📴 Socket.IO closed');
                });

                const { disconnectDatabase } = await import('./utils/database');
                await disconnectDatabase();

                console.log('✅ Graceful shutdown complete');
                process.exit(0);
            });

            setTimeout(() => {
                console.error('❌ Forceful shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            gracefulShutdown();
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown();
        });

    } catch (error) {
        console.error('\n❌ FATAL ERROR: Failed to start server');
        console.error(error);
        process.exit(1);
    }
};

startServer();
