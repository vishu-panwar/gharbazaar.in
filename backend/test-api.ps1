# GharBazaar API Test Script
# Tests all critical endpoints to verify Prisma migration

$baseUrl = "http://localhost:5001/api/v1"
$results = @()

Write-Host "`n🧪 Testing GharBazaar API Endpoints`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    $results += [PSCustomObject]@{
        Endpoint = "/health"
        Status = "✅ PASS"
        Response = $response.message
    }
    Write-Host "   ✅ Health check passed" -ForegroundColor Green
} catch {
    $results += [PSCustomObject]@{
        Endpoint = "/health"
        Status = "❌ FAIL"
        Response = $_.Exception.Message
    }
    Write-Host "   ❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get Properties (Public)
Write-Host "`n2. Testing Properties Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/properties" -Method GET
    $count = if ($response.data) { $response.data.Count } else { 0 }
    $results += [PSCustomObject]@{
        Endpoint = "/properties"
        Status = "✅ PASS"
        Response = "Retrieved $count properties"
    }
    Write-Host "   ✅ Properties retrieved: $count items" -ForegroundColor Green
} catch {
    $results += [PSCustomObject]@{
        Endpoint = "/properties"
        Status = "❌ FAIL"
        Response = $_.Exception.Message
    }
    Write-Host "   ❌ Properties failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Plans
Write-Host "`n3. Testing Plans Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/plans" -Method GET
    $count = if ($response.data) { $response.data.Count } else { 0 }
    $results += [PSCustomObject]@{
        Endpoint = "/plans"
        Status = "✅ PASS"
        Response = "Retrieved $count plans"
    }
    Write-Host "   ✅ Plans retrieved: $count items" -ForegroundColor Green
} catch {
    $results += [PSCustomObject]@{
        Endpoint = "/plans"
        Status = "❌ FAIL"
        Response = $_.Exception.Message
    }
    Write-Host "   ❌ Plans failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Auth - Register (should fail without proper data, but endpoint should respond)
Write-Host "`n4. Testing Auth Register Endpoint..." -ForegroundColor Yellow
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json"
    $results += [PSCustomObject]@{
        Endpoint = "/auth/register"
        Status = "⚠️ UNEXPECTED"
        Response = "Registered without data"
    }
    Write-Host "   ⚠️ Registered without validation" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        $results += [PSCustomObject]@{
            Endpoint = "/auth/register"
            Status = "✅ PASS"
            Response = "Returns 400 for missing data (as expected)"
        }
        Write-Host "   ✅ Validation working (returns 400)" -ForegroundColor Green
    } else {
        $results += [PSCustomObject]@{
            Endpoint = "/auth/register"
            Status = "❌ FAIL"
            Response = $_.Exception.Message
        }
        Write-Host "   ❌ Auth register failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Contact Form
Write-Host "`n5. Testing Contact Form Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Test User"
        email = "test@example.com"
        phone = "1234567890"
        message = "API Test Message"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/contact" -Method POST -Body $body -ContentType "application/json"
    $results += [PSCustomObject]@{
        Endpoint = "/contact"
        Status = "✅ PASS"
        Response = "Contact form submitted successfully"
    }
    Write-Host "   ✅ Contact form works" -ForegroundColor Green
} catch {
    $results += [PSCustomObject]@{
        Endpoint = "/contact"
        Status = "❌ FAIL"
        Response = $_.Exception.Message
    }
    Write-Host "   ❌ Contact form failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Tickets (should require auth)
Write-Host "`n6. Testing Tickets Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tickets" -Method GET
    $results += [PSCustomObject]@{
        Endpoint = "/tickets"
        Status = "⚠️ UNEXPECTED"
        Response = "Accessed without auth"
    }
    Write-Host "   ⚠️ Tickets accessed without auth" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        $results += [PSCustomObject]@{
            Endpoint = "/tickets"
            Status = "✅ PASS"
            Response = "Returns 401 (auth required, as expected)"
        }
        Write-Host "   ✅ Auth protection working (returns 401)" -ForegroundColor Green
    } else {
        $results += [PSCustomObject]@{
            Endpoint = "/tickets"
            Status = "❌ FAIL"
            Response = $_.Exception.Message
        }
        Write-Host "   ❌ Tickets failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 7: Chat (should require auth)
Write-Host "`n7. Testing Chat Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/chat/conversations" -Method GET
    $results += [PSCustomObject]@{
        Endpoint = "/chat/conversations"
        Status = "⚠️ UNEXPECTED"
        Response = "Accessed without auth"
    }
    Write-Host "   ⚠️ Chat accessed without auth" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        $results += [PSCustomObject]@{
            Endpoint = "/chat/conversations"
            Status = "✅ PASS"
            Response = "Returns 401 (auth required, as expected)"
        }
        Write-Host "   ✅ Auth protection working (returns 401)" -ForegroundColor Green
    } else {
        $results += [PSCustomObject]@{
            Endpoint = "/chat/conversations"
            Status = "❌ FAIL"
            Response = $_.Exception.Message
        }
        Write-Host "   ❌ Chat failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Status -like "*PASS*" }).Count
$failed = ($results | Where-Object { $_.Status -like "*FAIL*" }).Count
$warning = ($results | Where-Object { $_.Status -like "*UNEXPECTED*" }).Count
$total = $results.Count

Write-Host "`n✅ PASSED: $passed" -ForegroundColor Green
Write-Host "❌ FAILED: $failed" -ForegroundColor Red
Write-Host "⚠️  WARNING: $warning" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "   TOTAL: $total tests" -ForegroundColor Cyan

Write-Host "`n📋 Detailed Results:`n"
$results | Format-Table -AutoSize

if ($failed -eq 0) {
    Write-Host "`n🎉 All critical tests passed! Phase 1 is complete.`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please investigate.`n" -ForegroundColor Yellow
}
