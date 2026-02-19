
// Test imports one by one
console.log('Testing imports...');

try {
    require('./config/index.ts');
    console.log('✅ config/index.ts loaded');
} catch (e: any) {
    console.error('❌ config/index.ts failed:', e.message);
}

try {
    require('./utils/database.ts');
    console.log('✅ utils/database.ts loaded');
} catch (e: any) {
    console.error('❌ utils/database.ts failed:', e.message);
}

try {
    require('./middleware/audit.middleware.ts');
    console.log('✅ middleware/audit.middleware.ts loaded');
} catch (e: any) {
    console.error('❌ middleware/audit.middleware.ts failed:', e.message);
}

// Routes often import controllers which import models
try {
    require('./routes/index.ts');
    console.log('✅ routes/index.ts loaded');
} catch (e: any) {
    console.error('❌ routes/index.ts failed:', e.message);
    if (e.stack) console.error(e.stack);
}
