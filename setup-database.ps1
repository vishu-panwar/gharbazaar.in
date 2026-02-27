# GharBazaar - Database Setup Script
# Ensures PostgreSQL is running via Docker

Write-Host "`n🐳 GharBazaar - PostgreSQL Setup`n" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker is not running. Starting Docker Desktop..." -ForegroundColor Red
        Write-Host "   Please wait 30-60 seconds for Docker to start..." -ForegroundColor Yellow
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        Write-Host "`n⏳ Waiting for Docker to start (checking every 5 seconds)..." -ForegroundColor Yellow
        
        $maxAttempts = 24  # 2 minutes max
        $attempt = 0
        while ($attempt -lt $maxAttempts) {
            Start-Sleep -Seconds 5
            $attempt++
            docker ps > $null 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Docker is now running!" -ForegroundColor Green
                break
            }
            Write-Host "   Still waiting... ($attempt/$maxAttempts)" -ForegroundColor Gray
        }
        
        if ($attempt -eq $maxAttempts) {
            Write-Host "`n❌ Docker failed to start within 2 minutes." -ForegroundColor Red
            Write-Host "   Please start Docker Desktop manually and run this script again." -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "✅ Docker is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if PostgreSQL container exists
Write-Host "`nChecking PostgreSQL container..." -ForegroundColor Yellow
$containerExists = docker ps -a --filter "name=gharbazaar-postgres" --format "{{.Names}}"

if ($containerExists -eq "gharbazaar-postgres") {
    Write-Host "✅ Container exists, checking status..." -ForegroundColor Green
    $containerRunning = docker ps --filter "name=gharbazaar-postgres" --format "{{.Names}}"
    
    if ($containerRunning -eq "gharbazaar-postgres") {
        Write-Host "✅ PostgreSQL is already running!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Container exists but not running. Starting..." -ForegroundColor Yellow
        docker start gharbazaar-postgres
        Start-Sleep -Seconds 5
        Write-Host "✅ PostgreSQL container started!" -ForegroundColor Green
    }
} else {
    Write-Host "📦 Creating PostgreSQL container..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL container created and started!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create PostgreSQL container" -ForegroundColor Red
        exit 1
    }
}

# Wait for PostgreSQL to be ready
Write-Host "`n⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0
while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++
    $health = docker exec gharbazaar-postgres pg_isready -U postgres 2>&1
    if ($health -match "accepting connections") {
        Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
        break
    }
    Write-Host "   Waiting for database... ($attempt/$maxAttempts)" -ForegroundColor Gray
}

if ($attempt -eq $maxAttempts) {
    Write-Host "⚠️  Database might not be ready yet. Proceeding anyway..." -ForegroundColor Yellow
}

# Check if Prisma migrations need to be run
Write-Host "`n🔄 Checking database migrations..." -ForegroundColor Yellow
Push-Location backend

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate > $null 2>&1

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate deploy 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database migrations complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Running migrate dev (development mode)..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
}

Pop-Location

Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
Write-Host "`n📊 Database Information:" -ForegroundColor Cyan
Write-Host "   Host: localhost:5432" -ForegroundColor White
Write-Host "   Database: gharbazaar" -ForegroundColor White
Write-Host "   User: postgres" -ForegroundColor White
Write-Host "   Password: postgres" -ForegroundColor White

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host "   2. Start frontend: cd frontend && npm run dev" -ForegroundColor White

Write-Host "`n💡 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs:     docker logs gharbazaar-postgres" -ForegroundColor White
Write-Host "   Stop DB:       docker-compose down" -ForegroundColor White
Write-Host "   Reset DB:      docker-compose down -v && .\setup-database.ps1" -ForegroundColor White
Write-Host "   Prisma Studio: cd backend && npx prisma studio" -ForegroundColor White
Write-Host ""
