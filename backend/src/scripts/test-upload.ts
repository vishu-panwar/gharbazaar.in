
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5001/api/v1';

const log = (msg: string) => {
    console.log(msg);
    fs.appendFileSync('upload_test.log', msg + '\n');
};

const testUpload = async () => {
    try {
        fs.writeFileSync('upload_test.log', '');
        log('🔄 Authenticating...');

        // 1. Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'buyer@demo.com', password: 'password123' })
        });

        const loginData: any = await loginRes.json();

        if (!loginRes.ok) {
            log(`❌ Login failed: ${JSON.stringify(loginData)}`);
            return;
        }

        const token = loginData.data.token;
        log('✅ Logged in');

        // 2. Create dummy image
        const dummyImagePath = path.join(__dirname, 'test-image.png');
        const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        fs.writeFileSync(dummyImagePath, pngBuffer);

        // 3. Upload
        log('📤 Uploading image...');
        const fileBlob = new Blob([pngBuffer], { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', fileBlob, 'test-image.png');

        const uploadRes = await fetch(`${API_URL}/properties/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const uploadData = await uploadRes.json();
        log(`Status: ${uploadRes.status}`);
        log(`Response: ${JSON.stringify(uploadData)}`);

        // Cleanup
        if (fs.existsSync(dummyImagePath)) fs.unlinkSync(dummyImagePath);

    } catch (error: any) {
        log(`❌ Test failed: ${error.message} \n ${error.stack}`);
    }
};

testUpload();
