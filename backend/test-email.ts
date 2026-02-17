import { sendEmail } from './src/utils/email.service';

async function testEmail() {
    console.log('🧪 Testing Email Service...');
    console.log('📧 Sending test email to: bunnyboss.129@gmail.com');

    try {
        await sendEmail({
            email: 'bunnyboss.129@gmail.com',
            subject: 'GharBazaar Email Service Test',
            message: 'This is a test email from GharBazaar to verify email functionality.',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0;">✅ Email Test Successful!</h1>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
                        <h2 style="color: #1f2937; margin-top: 0;">Hello from GharBazaar! 👋</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                            This is a test email to verify that our email service is working correctly.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
                            <h3 style="color: #10b981; margin-top: 0;">✨ Service Details</h3>
                            <ul style="color: #4b5563; line-height: 1.8;">
                                <li>SMTP Provider: Zoho Mail</li>
                                <li>From: gharbazaarofficial@zohomail.in</li>
                                <li>Test Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
                                <li>Environment: Development</li>
                            </ul>
                        </div>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                            If you received this email, it means:
                        </p>
                        <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                            <li>✅ SMTP configuration is correct</li>
                            <li>✅ Email credentials are valid</li>
                            <li>✅ Email service is ready for production</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #1f2937; border-radius: 10px;">
                        <a href="http://localhost:3000/dashboard/settings" 
                           style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Open Settings
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
                        © ${new Date().getFullYear()} GharBazaar. All rights reserved.<br>
                        Premium Local Real Estate Marketplace
                    </p>
                </div>
            `
        });

        console.log('✅ SUCCESS! Email sent successfully!');
        console.log('📬 Check inbox: bunnyboss.129@gmail.com');
        console.log('💡 Also check spam/junk folder if not in inbox');

    } catch (error: any) {
        console.error('❌ FAILED! Error sending email:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testEmail();
