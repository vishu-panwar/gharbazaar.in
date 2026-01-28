@echo off
echo ============================================
echo   Razorpay Setup for GharBazaar
echo ============================================
echo.

REM Backend setup
echo [1/2] Setting up Backend...
cd backend

if exist .env (
    echo Backend .env already exists
    echo Please manually update these lines in backend\.env:
    echo   RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa
    echo   RAZORPAY_KEY_SECRET=dnmHL5uGnRa7bHmXlHzWQIko
) else (
    echo Creating backend .env from example...
    copy .env.example .env
    echo.
    echo Created backend\.env
    echo Please manually update these lines:
    echo   RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa
    echo   RAZORPAY_KEY_SECRET=dnmHL5uGnRa7bHmXlHzWQIko
)

cd ..
echo.

REM Frontend setup  
echo [2/2] Setting up Frontend...
cd frontend

if exist .env.local (
    echo Frontend .env.local already exists
    echo Please manually add this line to frontend\.env.local:
    echo   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa
) else (
    echo Creating frontend .env.local...
    echo NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S0xWdnDI3PnCGa > .env.local
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1 >> .env.local
    echo.
    echo Created frontend\.env.local with Razorpay key
)

cd ..
echo.
echo ============================================
echo   Setup Instructions Created!
echo ============================================
echo.
echo Your Razorpay Test Credentials:
echo   Key ID: rzp_test_S0xWdnDI3PnCGa
echo   Key Secret: dnmHL5uGnRa7bHmXlHzWQIko
echo.
echo NEXT STEPS:
echo 1. Manually update the credentials in .env files
echo 2. Get webhook secret from Razorpay Dashboard
echo 3. Restart both backend and frontend servers
echo 4. Test at: http://localhost:3000/dashboard/seller-pricing
echo.
echo See RAZORPAY_SETUP.md for detailed instructions
echo.
pause
