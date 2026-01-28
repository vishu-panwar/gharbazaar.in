# GharBazaar - Razorpay Configuration Script
# Run this script to set up your Razorpay environment variables

Write-Host "🚀 Setting up Razorpay Configuration for GharBazaar..." -ForegroundColor Cyan
Write-Host ""

# Backend directory
$backendDir = "c:\Users\Dixie\Downloads\gharbazaar.in-main\gharbazaar.in-main\backend"
$frontendDir = "c:\Users\Dixie\Downloads\gharbazaar.in-main\gharbazaar.in-main\frontend"

# Check if backend .env exists
$backendEnv = Join-Path $backendDir ".env"
if (Test-Path $backendEnv) {
    Write-Host "⚠️  Backend .env file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to update Razorpay credentials? (y/n)"
    if ($overwrite -ne 'y') {
        Write-Host "Skipping backend configuration..." -ForegroundColor Yellow
        $updateBackend = $false
    } else {
        $updateBackend = $true
    }
} else {
    Write-Host "📝 Creating backend .env file..." -ForegroundColor Green
    Copy-Item (Join-Path $backendDir ".env.example") $backendEnv
    $updateBackend = $true
}

if ($updateBackend) {
    # Read existing content
    $content = Get-Content $backendEnv -Raw
    
    # Update Razorpay credentials
    $content = $content -replace 'RAZORPAY_KEY_ID=.*', 'RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa'
    $content = $content -replace 'RAZORPAY_KEY_SECRET=.*', 'RAZORPAY_KEY_SECRET=dnmHL5uGnRa7bHmXlHzWQIko'
    
    # Write back
    Set-Content -Path $backendEnv -Value $content -NoNewline
    
    Write-Host "✅ Backend Razorpay credentials configured!" -ForegroundColor Green
}

Write-Host ""

# Check if frontend .env.local exists
$frontendEnv = Join-Path $frontendDir ".env.local"
if (Test-Path $frontendEnv) {
    Write-Host "⚠️  Frontend .env.local file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to update Razorpay credentials? (y/n)"
    if ($overwrite -ne 'y') {
        Write-Host "Skipping frontend configuration..." -ForegroundColor Yellow
        $updateFrontend = $false
    } else {
        $updateFrontend = $true
    }
} else {
    Write-Host "📝 Creating frontend .env.local file..." -ForegroundColor Green
    # Create new file with Razorpay config
    $frontendContent = @"
# Razorpay Test Mode Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Firebase Configuration (Add your Firebase credentials)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
"@
    Set-Content -Path $frontendEnv -Value $frontendContent
    $updateFrontend = $true
}

if ($updateFrontend -and (Test-Path $frontendEnv)) {
    # Read existing content
    $content = Get-Content $frontendEnv -Raw
    
    # Update or add Razorpay key
    if ($content -match 'NEXT_PUBLIC_RAZORPAY_KEY_ID') {
        $content = $content -replace 'NEXT_PUBLIC_RAZORPAY_KEY_ID=.*', 'NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa'
    } else {
        $content = "NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa`n" + $content
    }
    
    # Write back
    Set-Content -Path $frontendEnv -Value $content -NoNewline
    
    Write-Host "✅ Frontend Razorpay credentials configured!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Razorpay Configuration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your Razorpay Test Credentials:" -ForegroundColor Cyan
Write-Host "   Key ID: rzp_test_S0xWdnDI3PnCGa" -ForegroundColor White
Write-Host "   Key Secret: dnmHL5uGnRa7bHmXlHzWQIko" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. Get Webhook Secret from Razorpay Dashboard" -ForegroundColor White
Write-Host "      - Go to: https://dashboard.razorpay.com/app/webhooks" -ForegroundColor Gray
Write-Host "      - Create webhook or copy existing secret" -ForegroundColor Gray
Write-Host "      - Update RAZORPAY_WEBHOOK_SECRET in backend .env" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Verify your plan IDs exist in Razorpay Dashboard" -ForegroundColor White
Write-Host "      - Go to: https://dashboard.razorpay.com/app/subscriptions/plans" -ForegroundColor Gray
Write-Host "      - Check if plans match the IDs in .env file" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Restart your servers:" -ForegroundColor White
Write-Host "      - Stop current frontend (Ctrl+C in terminal)" -ForegroundColor Gray
Write-Host "      - cd frontend && npm run dev" -ForegroundColor Gray
Write-Host "      - cd backend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Test the payment flow:" -ForegroundColor White
Write-Host "      - Go to: http://localhost:3000/dashboard/seller-pricing" -ForegroundColor Gray
Write-Host "      - Select a plan and test with Razorpay test card" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed setup guide, check:" -ForegroundColor Cyan
Write-Host "   razorpay_integration_guide.md in artifacts folder" -ForegroundColor White
Write-Host ""
