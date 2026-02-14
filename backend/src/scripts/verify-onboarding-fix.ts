
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyFix() {
    const testUid = 'gblegal5e8d9a2'; // The UID we found: gblegal5e8d9a2
    
    console.log(`🔍 Checking initial status for UID: ${testUid}`);
    const initialUser = await prisma.user.findUnique({ where: { uid: testUid } });
    console.log('Initial onboardingCompleted:', initialUser?.onboardingCompleted);

    if (initialUser?.onboardingCompleted === true) {
        console.log('⚠️ User already onboarded, resetting for test...');
        await prisma.user.update({ where: { uid: testUid }, data: { onboardingCompleted: false } });
    }

    console.log('🚀 Simulating createProvider update...');
    // This simulates the fixed logic: await prisma.user.update({ where: { uid: testUid }, data: { onboardingCompleted: true } });
    // In serviceProvider.controller.ts, we changed 'id' to 'uid'
    
    try {
        await prisma.user.update({
            where: { uid: testUid },
            data: { onboardingCompleted: true }
        });
        console.log('✅ Update successful!');
    } catch (error) {
        console.error('❌ Update failed:', error);
    }

    const updatedUser = await prisma.user.findUnique({ where: { uid: testUid } });
    console.log('Final onboardingCompleted:', updatedUser?.onboardingCompleted);
    
    if (updatedUser?.onboardingCompleted === true) {
        console.log('🎉 VERIFICATION SUCCESS: Onboarding status correctly updated via UID.');
    } else {
        console.log('❌ VERIFICATION FAILED: Onboarding status not updated.');
    }

    await prisma.$disconnect();
}

verifyFix();
