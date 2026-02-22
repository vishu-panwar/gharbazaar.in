import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { uploadFile } from '../utils/fileStorage';
import { sanitizeMessage } from '../utils/sanitization';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

type OfflineServiceProvider = {
    id: string;
    userId: string;
    category: string;
    specialization: string;
    rating: number;
    reviews: number;
    completedProjects: number;
    hourlyRate: number;
    location: string;
    verified: boolean;
    available: boolean;
    description: string;
    skills: string[];
    experience: number;
    portfolio: string[];
    profileImage: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        email: string;
        phone: string;
    };
};

const FALLBACK_DATA_DIR = path.join(__dirname, '../../data');
const FALLBACK_PROVIDERS_FILE = path.join(FALLBACK_DATA_DIR, 'serviceProviders.fallback.json');

function isDatabaseUnavailable(error: unknown): boolean {
    const message = String((error as any)?.message || '').toLowerCase();
    const code = String((error as any)?.code || '').toUpperCase();
    const name = String((error as any)?.name || '').toLowerCase();
    return (
        name.includes('prismaclientinitializationerror') ||
        code === 'P1001' ||
        message.includes('error querying the database') ||
        message.includes("can't reach database server") ||
        message.includes('exceeded the active time quota')
    );
}

function ensureFallbackStore() {
    if (!fs.existsSync(FALLBACK_DATA_DIR)) {
        fs.mkdirSync(FALLBACK_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FALLBACK_PROVIDERS_FILE)) {
        fs.writeFileSync(FALLBACK_PROVIDERS_FILE, '[]', 'utf8');
    }
}

function readFallbackProviders(): OfflineServiceProvider[] {
    try {
        ensureFallbackStore();
        const raw = fs.readFileSync(FALLBACK_PROVIDERS_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeFallbackProviders(providers: OfflineServiceProvider[]) {
    ensureFallbackStore();
    fs.writeFileSync(FALLBACK_PROVIDERS_FILE, JSON.stringify(providers, null, 2), 'utf8');
}

// Get all service providers with optional filters
export const getAllProviders = async (req: Request, res: Response) => {
    try {
        const { category, verified, available, location, sortBy = 'rating', limit } = req.query;
        const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 0));

        // Build filter where object
        const where: any = { verified: true };
        if (category && category !== 'all') where.category = category as string;
        if (verified !== undefined) where.verified = verified === 'true';
        if (available !== undefined) where.available = available === 'true';
        if (location) {
            where.location = {
                contains: location as string,
                mode: 'insensitive'
            };
        }

        // Build orderBy object
        const orderBy: any = {};
        if (sortBy === 'rating') orderBy.rating = 'desc';
        else if (sortBy === 'reviews') orderBy.reviews = 'desc';
        else if (sortBy === 'projects') orderBy.completedProjects = 'desc';
        else if (sortBy === 'rate') orderBy.hourlyRate = 'asc';
        else orderBy.createdAt = 'desc';

        const providers = await prisma.serviceProvider.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy,
            ...(parsedLimit ? { take: parsedLimit } : {})
        });

        res.json({
            success: true,
            providers,
            count: providers.length
        });
    } catch (error: any) {
        console.error('getAllProviders error:', error);

        if (isDatabaseUnavailable(error)) {
            const { category, verified, available, location, limit } = req.query;
            const allFallback = readFallbackProviders();
            const filtered = allFallback.filter((provider) => {
                if (category && category !== 'all' && provider.category !== String(category)) return false;
                if (verified !== undefined && provider.verified !== (verified === 'true')) return false;
                if (available !== undefined && provider.available !== (available === 'true')) return false;
                if (location && !provider.location.toLowerCase().includes(String(location).toLowerCase())) return false;
                return true;
            });
            const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 0));
            const limited = parsedLimit ? filtered.slice(0, parsedLimit) : filtered;

            return res.json({
                success: true,
                providers: limited,
                count: limited.length,
                source: 'offline-fallback'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch service providers'
        });
    }
};

// Get single provider by ID
export const getProviderById = async (req: Request, res: Response) => {
    try {
        const provider = await prisma.serviceProvider.findFirst({
            where: { id: req.params.id, verified: true },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider not found'
            });
        }

        res.json({ success: true, data: provider });
    } catch (error: any) {
        console.error('getProviderById error:', error);

        if (isDatabaseUnavailable(error)) {
            const providers = readFallbackProviders();
            const provider = providers.find((p) => p.id === req.params.id);
            if (!provider) {
                return res.status(404).json({
                    success: false,
                    error: 'Service provider not found'
                });
            }
            return res.json({ success: true, data: provider, source: 'offline-fallback' });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to get service provider'
        });
    }
};

// Create new service provider profile
export const createProvider = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // This is the uid from Firebase/Auth

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Check if user exists and get their internal ID
        const user = await prisma.user.findUnique({
            where: { uid: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const isKycApproved = user.kycStatus === 'approved' && user.isVerified;

        const profession = String(req.body.profession || req.body.specialization || req.body.category || '').trim();
        const address = String(req.body.address || req.body.location || '').trim();
        const fullName = String(req.body.name || '').trim();
        const experience = req.body.experience ? parseInt(String(req.body.experience), 10) : 0;

        if (!profession || !address) {
            return res.status(400).json({
                success: false,
                error: 'profession and address are required'
            });
        }

        const categoryFromProfession = profession.toLowerCase().replace(/\s+/g, '-');

        const skills =
            Array.isArray(req.body.skills)
                ? req.body.skills.map((s: any) => String(s).trim()).filter(Boolean)
                : typeof req.body.skills === 'string'
                    ? req.body.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : [profession];

        const portfolio =
            Array.isArray(req.body.portfolio)
                ? req.body.portfolio.map((p: any) => String(p).trim()).filter(Boolean)
                : [];

        let profileImageUrl: string | null = req.body.profileImage ? String(req.body.profileImage) : null;
        const imageFile = (req as any).file as Express.Multer.File | undefined;

        if (imageFile) {
            const uploaded = await uploadFile(
                imageFile.buffer,
                imageFile.originalname,
                imageFile.mimetype
            );
            profileImageUrl = uploaded.url;
        }

        const providerData = {
            category: categoryFromProfession,
            specialization: profession,
            rating: req.body.rating ? parseFloat(String(req.body.rating)) : 0,
            reviews: req.body.reviews ? parseInt(String(req.body.reviews), 10) : 0,
            completedProjects: req.body.completedProjects ? parseInt(String(req.body.completedProjects), 10) : 0,
            hourlyRate: req.body.hourlyRate ? parseFloat(String(req.body.hourlyRate)) : 500,
            location: address,
            verified: isKycApproved,
            available: typeof req.body.available === 'boolean'
                ? req.body.available
                : req.body.availability !== undefined
                    ? String(req.body.availability) === 'true'
                    : true,
            description: String(req.body.description || `${profession} service provider available at ${address}`).trim(),
            skills,
            experience,
            portfolio,
            profileImage: profileImageUrl,
        };

        const existingProvider = await prisma.serviceProvider.findUnique({
            where: { userId: user.id }
        });

        const provider = existingProvider
            ? await prisma.serviceProvider.update({
                where: { userId: user.id },
                data: providerData
            })
            : await prisma.serviceProvider.create({
                data: {
                    userId: user.id,
                    ...providerData
                }
            });

        // Update user profile and role for marketplace visibility
        await prisma.user.update({
            where: { uid: userId },
            data: {
                onboardingCompleted: isKycApproved,
                ...(fullName ? { name: fullName } : {}),
                ...(address ? { address } : {}),
            }
        });

        res.status(existingProvider ? 200 : 201).json({
            success: true,
            data: provider,
            message: isKycApproved
                ? (existingProvider ? 'Service profile updated successfully' : 'Service profile created successfully')
                : 'Service profile saved. It will be visible after employee KYC approval.'
        });
    } catch (error: any) {
        console.error('createProvider error:', error);

        if (isDatabaseUnavailable(error)) {
            const authUid = String((req as any).user?.userId || '');
            const authEmail = String((req as any).user?.email || '');
            const profession = String(req.body.profession || req.body.specialization || req.body.category || '').trim();
            const address = String(req.body.address || req.body.location || '').trim();
            const fullName = String(req.body.name || 'Service Provider').trim();
            const experience = req.body.experience ? parseInt(String(req.body.experience), 10) : 0;

            if (!authUid || !profession || !address) {
                return res.status(503).json({
                    success: false,
                    error: 'Database unavailable and insufficient data for offline save.',
                    details: String(error?.message || ''),
                });
            }

            let profileImageUrl: string | null = req.body.profileImage ? String(req.body.profileImage) : null;
            const imageFile = (req as any).file as Express.Multer.File | undefined;
            if (imageFile && !profileImageUrl) {
                try {
                    const uploaded = await uploadFile(
                        imageFile.buffer,
                        imageFile.originalname,
                        imageFile.mimetype
                    );
                    profileImageUrl = uploaded.url;
                } catch (uploadErr) {
                    console.warn('offline fallback image upload failed:', uploadErr);
                }
            }

            const allFallback = readFallbackProviders();
            const now = new Date().toISOString();
            const existingIdx = allFallback.findIndex((p) => p.userId === authUid);
            const id = existingIdx >= 0
                ? allFallback[existingIdx].id
                : `offline_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

            const offlineProvider: OfflineServiceProvider = {
                id,
                userId: authUid,
                category: profession.toLowerCase().replace(/\s+/g, '-'),
                specialization: profession,
                rating: 0,
                reviews: 0,
                completedProjects: 0,
                hourlyRate: req.body.hourlyRate ? parseFloat(String(req.body.hourlyRate)) : 500,
                location: address,
                verified: false,
                available: true,
                description: String(req.body.description || `${profession} service provider available at ${address}`).trim(),
                skills: [profession],
                experience,
                portfolio: [],
                profileImage: profileImageUrl,
                createdAt: existingIdx >= 0 ? allFallback[existingIdx].createdAt : now,
                updatedAt: now,
                user: {
                    name: fullName,
                    email: authEmail,
                    phone: String(req.body.contactNumber || req.body.phone || ''),
                },
            };

            if (existingIdx >= 0) {
                allFallback[existingIdx] = offlineProvider;
            } else {
                allFallback.unshift(offlineProvider);
            }

            writeFallbackProviders(allFallback);

            return res.status(existingIdx >= 0 ? 200 : 201).json({
                success: true,
                data: offlineProvider,
                source: 'offline-fallback',
                message: 'Service saved in offline fallback store while database is unavailable.',
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create service provider',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update provider profile
export const updateProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        // Find provider and verify ownership
        const provider = await prisma.serviceProvider.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider not found'
            });
        }

        // Check if user owns this provider profile
        if (provider.user.uid !== userId && (req as any).user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this profile'
            });
        }

        // Clean up data for update
        const updateData = { ...req.body };
        delete updateData.userId; // Don't allow updating internal userId
        
        if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
        if (updateData.reviews) updateData.reviews = parseInt(updateData.reviews);
        if (updateData.completedProjects) updateData.completedProjects = parseInt(updateData.completedProjects);
        if (updateData.hourlyRate) updateData.hourlyRate = parseFloat(updateData.hourlyRate);
        if (updateData.experience) updateData.experience = parseInt(updateData.experience);

        const updatedProvider = await prisma.serviceProvider.update({
            where: { id },
            data: updateData
        });

        res.json({
            success: true,
            data: updatedProvider
        });
    } catch (error: any) {
        console.error('updateProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update service provider'
        });
    }
};

// Delete provider profile
export const deleteProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        // Find provider and verify ownership
        const provider = await prisma.serviceProvider.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider not found'
            });
        }

        // Check if user owns this provider profile
        if (provider.user.uid !== userId && (req as any).user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this profile'
            });
        }

        await prisma.serviceProvider.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Service provider deleted successfully'
        });
    } catch (error: any) {
        console.error('deleteProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete service provider'
        });
    }
};

// Search providers with advanced filtering
export const searchProviders = async (req: Request, res: Response) => {
    try {
        const { 
            search, 
            category, 
            minRating, 
            maxRate, 
            verified, 
            available,
            skills 
        } = req.query;

        const where: any = { verified: true };

        // Text search in specialization, description, and skills
        if (search) {
            where.OR = [
                { specialization: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
                { skills: { hasSome: [search as string] } }
            ];
        }

        if (category && category !== 'all') where.category = category as string;
        if (verified !== undefined) where.verified = verified === 'true';
        if (available !== undefined) where.available = available === 'true';
        if (minRating) where.rating = { gte: Number(minRating) };
        if (maxRate) where.hourlyRate = { lte: Number(maxRate) };
        if (skills) {
            const skillsArray = (skills as string).split(',');
            where.skills = { hasSome: skillsArray };
        }

        const providers = await prisma.serviceProvider.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { rating: 'desc' },
                { reviews: 'desc' }
            ]
        });

        res.json({
            success: true,
            providers,
            count: providers.length
        });
    } catch (error: any) {
        console.error('searchProviders error:', error);

        if (isDatabaseUnavailable(error)) {
            const { search, category, available, skills } = req.query;
            let providers = readFallbackProviders();

            if (search) {
                const q = String(search).toLowerCase();
                providers = providers.filter((p) =>
                    p.specialization.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.skills.some((s) => s.toLowerCase().includes(q))
                );
            }
            if (category && category !== 'all') {
                providers = providers.filter((p) => p.category === String(category));
            }
            if (available !== undefined) {
                providers = providers.filter((p) => p.available === (available === 'true'));
            }
            if (skills) {
                const skillsSet = String(skills).split(',').map((s) => s.trim().toLowerCase());
                providers = providers.filter((p) => p.skills.some((s) => skillsSet.includes(s.toLowerCase())));
            }

            return res.json({
                success: true,
                providers,
                count: providers.length,
                source: 'offline-fallback'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to search service providers'
        });
    }
};

// Get providers by category
export const getProvidersByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const providers = await prisma.serviceProvider.findMany({
            where: { category, verified: true },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { rating: 'desc' },
                { reviews: 'desc' }
            ]
        });

        res.json({
            success: true,
            category,
            providers,
            count: providers.length
        });
    } catch (error: any) {
        console.error('getProvidersByCategory error:', error);

        if (isDatabaseUnavailable(error)) {
            const { category } = req.params;
            const providers = readFallbackProviders().filter((p) => p.category === category);
            return res.json({
                success: true,
                category,
                providers,
                count: providers.length,
                source: 'offline-fallback'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch providers by category'
        });
    }
};

// Get provider stats (for dashboard)
export const getProviderStats = async (req: Request, res: Response) => {
    try {
        const totalProviders = await prisma.serviceProvider.count();
        const verifiedProviders = await prisma.serviceProvider.count({ where: { verified: true } });
        const availableProviders = await prisma.serviceProvider.count({ where: { available: true } });

        // Average rating
        const ratingAgg = await prisma.serviceProvider.aggregate({
            _avg: {
                rating: true
            }
        });
        const avgRating = ratingAgg._avg.rating || 0;

        // Providers by category
        const categoryStats = await prisma.serviceProvider.groupBy({
            by: ['category'],
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    category: 'desc'
                }
            }
        });

        res.json({
            success: true,
            stats: {
                total: totalProviders,
                verified: verifiedProviders,
                available: availableProviders,
                avgRating: Math.round(avgRating * 10) / 10,
                byCategory: categoryStats.map(s => ({ _id: s.category, count: s._count._all }))
            }
        });
    } catch (error: any) {
        console.error('getProviderStats error:', error);

        if (isDatabaseUnavailable(error)) {
            const providers = readFallbackProviders();
            const verifiedProviders = providers.filter((p) => p.verified).length;
            const availableProviders = providers.filter((p) => p.available).length;
            const avgRating = providers.length
                ? providers.reduce((sum, p) => sum + (p.rating || 0), 0) / providers.length
                : 0;

            const byCategoryMap = new Map<string, number>();
            for (const p of providers) {
                byCategoryMap.set(p.category, (byCategoryMap.get(p.category) || 0) + 1);
            }

            return res.json({
                success: true,
                stats: {
                    total: providers.length,
                    verified: verifiedProviders,
                    available: availableProviders,
                    avgRating: Math.round(avgRating * 10) / 10,
                    byCategory: Array.from(byCategoryMap.entries()).map(([key, count]) => ({ _id: key, count }))
                },
                source: 'offline-fallback'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch provider stats'
        });
    }
};
// Get current user's provider profile
export const getMyProviderProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const provider = await prisma.serviceProvider.findFirst({
            where: {
                user: {
                    uid: userId
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        onboardingCompleted: true
                    }
                }
            }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider profile not found'
            });
        }

        res.json({
            success: true,
            data: provider
        });
    } catch (error: any) {
        console.error('getMyProviderProfile error:', error);

        if (isDatabaseUnavailable(error)) {
            const uid = String((req as any).user?.userId || '');
            const provider = readFallbackProviders().find((p) => p.userId === uid);
            if (!provider) {
                return res.status(404).json({
                    success: false,
                    error: 'Service provider profile not found'
                });
            }

            return res.json({
                success: true,
                data: provider,
                source: 'offline-fallback'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch your profile'
        });
    }
};

// Book a service provider
export const bookProvider = async (req: Request, res: Response) => {
    try {
        const { id: providerId } = req.params;
        const buyerId = (req as any).user?.userId; // Firebase uid
        const { formData, message } = req.body;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Get internal IDs
        const buyer = await prisma.user.findUnique({ where: { uid: buyerId } });
        const provider = await prisma.serviceProvider.findUnique({ 
            where: { id: providerId },
            include: {
                user: {
                    select: {
                        id: true,
                        uid: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!buyer || !provider) {
            return res.status(404).json({
                success: false,
                error: 'Buyer or Provider not found'
            });
        }

        if (!provider.verified) {
            return res.status(400).json({
                success: false,
                error: 'Service partner is not verified yet'
            });
        }

        if (!provider.available) {
            return res.status(400).json({
                success: false,
                error: 'Service partner is currently unavailable'
            });
        }

        const participantIds = [buyer.id, provider.userId];
        const existingConversations = await prisma.conversation.findMany({
            where: {
                conversationType: 'service-buyer',
                propertyId: null,
                participants: {
                    some: {
                        userId: { in: participantIds }
                    }
                }
            },
            include: {
                participants: {
                    select: { userId: true }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 20
        });

        const matchedConversation = existingConversations.find((conv: any) => {
            const ids = new Set((conv.participants || []).map((p: any) => p.userId));
            return ids.size === 2 && ids.has(buyer.id) && ids.has(provider.userId);
        });
        let conversationId = matchedConversation?.id || '';

        if (!conversationId) {
            const createdConversation = await prisma.conversation.create({
                data: {
                    conversationType: 'service-buyer',
                    propertyTitle: provider.specialization || provider.category || 'Service Partner',
                    lastMessageAt: new Date(),
                    participants: {
                        create: [
                            { user: { connect: { id: buyer.id } } },
                            { user: { connect: { id: provider.userId } } }
                        ]
                    }
                }
            });
            conversationId = createdConversation.id;
        }

        const buyerMessage = sanitizeMessage(String(message || '').trim());
        const preferredDate = formData?.preferredDate ? `Preferred Date: ${formData.preferredDate}` : '';
        const serviceIntro = `Service request for ${provider.specialization || provider.category}`;
        const combinedMessage = [serviceIntro, buyerMessage, preferredDate].filter(Boolean).join('\n');

        if (combinedMessage) {
            await prisma.message.create({
                data: {
                    conversationId,
                    senderId: buyer.id,
                    content: combinedMessage,
                    messageType: 'text',
                    isRead: false
                }
            });

            await prisma.conversation.update({
                where: { id: conversationId },
                data: {
                    lastMessage: combinedMessage.substring(0, 100),
                    lastMessageAt: new Date()
                }
            });
        }

        // Create PartnerCase (Task)
        const partnerCase = await prisma.partnerCase.create({
            data: {
                partnerId: provider.userId,
                buyerId: buyer.id,
                type: 'service',
                title: `Service Offer: ${provider.specialization || provider.category}`,
                description: buyerMessage || `Service request from ${buyer.name}`,
                status: 'pending',
                metadata: {
                    ...(formData || {}),
                    conversationId,
                }
            }
        });

        // Create Notification for Provider
        const providerNotification = await prisma.notification.create({
            data: {
                userId: provider.userId,
                type: 'service_offer',
                title: 'New Service Offer',
                message: `You have a new service offer from ${buyer.name}.`,
                priority: 'high',
                link: `/service-partners/cases`,
                metadata: JSON.stringify({ caseId: partnerCase.id, conversationId })
            }
        });

        const buyerNotification = await prisma.notification.create({
            data: {
                userId: buyer.id,
                type: 'service_offer_created',
                title: 'Service Offer Sent',
                message: `Your offer has been sent to ${provider.user.name || 'the service partner'}.`,
                priority: 'medium',
                link: `/dashboard/services/provider/${provider.id}`,
                metadata: JSON.stringify({ caseId: partnerCase.id, conversationId })
            }
        });

        // Trigger real-time notification if socket is available
        const io = req.app.get('io');
        if (io) {
            const providerIdentity = provider.user.uid || provider.user.id;
            const buyerIdentity = buyer.uid || buyer.id;

            io.to(`notifications:${providerIdentity}`).emit('new_notification', providerNotification);
            io.to(`notifications:${buyerIdentity}`).emit('new_notification', buyerNotification);
            io.to(conversationId).emit('conversation_updated', { conversationId });
        }

        res.status(201).json({
            success: true,
            message: 'Service booked successfully',
            data: {
                ...partnerCase,
                conversationId
            }
        });
    } catch (error: any) {
        console.error('bookProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to book service provider'
        });
    }
};
