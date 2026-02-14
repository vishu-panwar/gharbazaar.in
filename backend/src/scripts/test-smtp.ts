import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const testSMTP = async () => {
    console.log('🧪 Starting SMTP Test...');
    
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    console.log(`📡 SMTP Config:`);
    console.log(`   Host: ${host}`);
    console.log(`   Port: ${port}`);
    console.log(`   User: ${user}`);
    console.log(`   Pass: ${pass === 'replace_with_app_password' ? '⚠️  Placeholder detected' : '✅ Password set'}`);

    if (pass === 'replace_with_app_password') {
        console.error('\n❌ ERROR: You are still using the placeholder password. Please update SMTP_PASS in your .env file.');
        process.exit(1);
    }

    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            auth: {
                user,
                pass,
            },
        });

        console.log('\n⏳ Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('\n📧 Attempting to send test email...');
        const info = await transporter.sendMail({
            from: `"GharBazaar Test" <${user}>`,
            to: user, // Send to self
            subject: 'GharBazaar SMTP Connection Test',
            text: 'If you are reading this, your SMTP configuration is working correctly!',
            html: '<b>If you are reading this, your SMTP configuration is working correctly!</b>',
        });

        console.log(`✅ Test email sent! Message ID: ${info.messageId}`);
        console.log('\n🎉 SMTP is fully functional!');
    } catch (error: any) {
        console.error('\n❌ SMTP Test Failed:');
        console.error(`   ${error.message}`);
        if (error.code === 'EAUTH') {
            console.log('\n💡 TIP: Check if you are using an App Password instead of your regular account password.');
        }
    }
};

testSMTP();
