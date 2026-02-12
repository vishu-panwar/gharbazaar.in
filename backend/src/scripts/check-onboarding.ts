
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['legal_partner', 'service_partner', 'service-partners']
                }
            },
            select: {
                id: true,
                uid: true,
                email: true,
                onboardingCompleted: true,
                role: true
            }
        });
        console.log(JSON.stringify(users, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
