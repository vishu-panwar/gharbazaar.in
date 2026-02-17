# 🔒 URGENT: Secret Rotation Guide

## ⚠️ Security Alert
Multiple secrets were exposed in the website summary documentation. Immediate rotation required before production deployment.

## Exposed Credentials
- ❌ JWT_SECRET: `yourSecretKey123`
- ❌ Database Password: `npg_2fgZGk1WKXRS`
- ❌ SMTP Password: `Vishu@242004`
- ❌ Google OAuth Client Secret: `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`
- ❌ Razorpay Key Secret: `F0b1bBcEcfbwXFKGK2hhwPdj`
- ❌ Razorpay Webhook Secret: Needs to be configured

---

## 🔄 Rotation Steps (Execute in Order)

### 1. JWT Secret (Immediate - Code Change Only)

#### New Secret Generated:
```bash
JWT_SECRET=5369aa48e9c01cbdde46065f8e70116b327adf914e4946cd57d6d9678154f113409bab1a0ff10eab3bef9cd2bcf78d1797378d9406c8c42ccd4cfc59e82f5493
```

#### Actions:
**Backend** - Update `backend/.env`:
```env
JWT_SECRET=5369aa48e9c01cbdde46065f8e70116b327adf914e4946cd57d6d9678154f113409bab1a0ff10eab3bef9cd2bcf78d1797378d9406c8c42ccd4cfc59e82f5493
```

**Impact**: All existing user sessions will be invalidated. Users must re-login.

**Restart Required**: Yes - restart backend server after update.

---

### 2. PostgreSQL Database Password (External System)

#### Steps:
1. **Login to Koyeb Console**: https://app.koyeb.com
2. **Navigate to**: Services → gharbazaar database → Settings
3. **Reset Password**: Generate new password (save securely)
4. **Copy New Connection String**

#### Update Environment:
**Backend** - Update `backend/.env`:
```env
DATABASE_URL=postgresql://koyeb-adm:NEW_PASSWORD_HERE@ep-late-bird-agroufku.eu-central-1.pg.koyeb.app:5432/gharbazaar?sslmode=require
```

**Impact**: Database connections will fail until both backend and Prisma are restarted with new credentials.

**Restart Required**: Yes - restart backend server.

---

### 3. SMTP Email Password (External System)

#### Steps:
1. **Login to Zoho Mail Admin**: https://mailadmin.zoho.com
2. **Navigate to**: User Details → padigpvp03@zoho.com → Change Password
3. **Generate Strong Password**: Use password manager (min 16 chars)
4. **Enable 2FA** (Recommended)

#### Update Environment:
**Backend** - Update `backend/.env`:
```env
SMTP_PASSWORD=NEW_ZOHO_PASSWORD_HERE
```

**Impact**: Email sending will fail until new password is configured.

**Restart Required**: Yes - restart backend server.

---

### 4. Google OAuth 2.0 Credentials (External System)

#### Steps:
1. **Login to Google Cloud Console**: https://console.cloud.google.com
2. **Navigate to**: APIs & Services → Credentials
3. **Find OAuth 2.0 Client**: "gharbazaar.in Web Client" (or similar)
4. **Delete Old Client** (optional for security)
5. **Create New OAuth Client**:
   - Application type: Web application
   - Name: GharBazaar Production
   - Authorized JavaScript origins: `https://gharbazaar.in`, `http://localhost:3000` (dev)
   - Authorized redirect URIs: `https://gharbazaar.in/api/auth/google/callback`, `http://localhost:3000/api/auth/google/callback` (dev)
6. **Copy New Credentials**: Client ID + Client Secret

#### Update Environment:
**Backend** - Update `backend/.env`:
```env
GOOGLE_CLIENT_ID=NEW_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=NEW_CLIENT_SECRET_HERE
```

**Frontend** - Update `frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=NEW_CLIENT_ID_HERE.apps.googleusercontent.com
```

**Impact**: Google Login will fail with old credentials. Users using Google OAuth must re-authenticate.

**Restart Required**: Yes - restart both backend and frontend servers.

---

### 5. Razorpay API Keys (External System)

#### Steps:
1. **Login to Razorpay Dashboard**: https://dashboard.razorpay.com
2. **Navigate to**: Settings → API Keys
3. **Regenerate Keys**:
   - Click "Regenerate Test Key" (for test mode)
   - Click "Regenerate Live Key" (for production mode)
4. **Download Keys**: Save Key ID + Key Secret securely
5. **Setup Webhook Secret**:
   - Navigate to: Settings → Webhooks
   - Create webhook: `https://gharbazaar.in/api/v1/payments/webhook`
   - Active Events: `payment.captured`, `payment.failed`, `refund.created`, `refund.speed_changed`
   - Copy **Webhook Secret** (auto-generated)

#### Update Environment:
**Backend** - Update `backend/.env`:
```env
# Test Mode (Development)
RAZORPAY_KEY_ID=rzp_test_NEW_KEY_ID_HERE
RAZORPAY_KEY_SECRET=NEW_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=NEW_WEBHOOK_SECRET_HERE

# Live Mode (Production)
RAZORPAY_KEY_ID=rzp_live_NEW_KEY_ID_HERE
RAZORPAY_KEY_SECRET=NEW_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=NEW_WEBHOOK_SECRET_HERE
```

**Frontend** - Update `frontend/.env.local`:
```env
# Test Mode
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_NEW_KEY_ID_HERE

# Live Mode
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_NEW_KEY_ID_HERE
```

**Impact**: Payment processing will fail with old keys. Webhooks will be rejected without proper secret.

**Restart Required**: Yes - restart both backend and frontend servers.

---

## 📋 Post-Rotation Checklist

### Verification Steps:
- [ ] Backend starts without database connection errors
- [ ] JWT authentication works (login/register)
- [ ] Google OAuth login works
- [ ] Email sending works (test with contact form)
- [ ] Razorpay payment flow works (test mode)
- [ ] Webhook signature verification works (test with Razorpay simulator)

### Testing Commands:
```bash
# Test Backend Health
curl http://localhost:5000/api/v1/health

# Test JWT Authentication
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test Email Service (check backend logs)
curl -X POST http://localhost:5000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

---

## 🔐 Security Best Practices Going Forward

### 1. Environment Variable Management
- ✅ **Never commit** `.env` files to version control
- ✅ Use `.env.example` templates with placeholder values
- ✅ Store production secrets in secure vault (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault)
- ✅ Rotate secrets every 90 days

### 2. Access Control
- ✅ Limit team members with access to production secrets (max 2-3 people)
- ✅ Use separate credentials for development, staging, production
- ✅ Enable 2FA on all cloud provider accounts (Koyeb, Google Cloud, Razorpay)

### 3. Monitoring
- ✅ Setup alerts for failed authentication attempts (Sentry, LogRocket)
- ✅ Monitor for unauthorized API access patterns
- ✅ Log all secret rotation events

### 4. Documentation
- ✅ Never include actual secrets in documentation
- ✅ Use placeholders: `JWT_SECRET=<your-secret-here>`
- ✅ Remove this rotation guide after secrets are changed

---

## ⏱️ Estimated Time: 2-3 Hours

| Task | Time | Complexity |
|------|------|------------|
| JWT Secret Rotation | 5 min | Easy |
| Database Password Rotation | 15 min | Medium |
| SMTP Password Rotation | 10 min | Easy |
| Google OAuth Regeneration | 30 min | Medium |
| Razorpay Key Regeneration | 45 min | Medium |
| Testing & Verification | 30 min | Easy |

---

## 🚨 Critical Notes

1. **Coordinate Deployment**: All services must be updated simultaneously to avoid downtime
2. **User Impact**: Expect all users to be logged out after JWT rotation
3. **Communication**: Notify users of brief maintenance window if rotating during business hours
4. **Backup**: Take database snapshot before applying changes (Koyeb auto-snapshots daily)
5. **Rollback Plan**: Keep old credentials accessible for 24 hours in case of emergency rollback

---

## ✅ Completion Sign-off

After rotation, update this checklist:

- [ ] All secrets rotated
- [ ] Environment files updated (backend + frontend)
- [ ] Services restarted successfully
- [ ] All verification tests passed
- [ ] Old credentials invalidated/deleted
- [ ] Team members notified of new credentials
- [ ] This guide deleted/moved to secure location

**Rotated By**: _________________  
**Date**: _________________  
**Verified By**: _________________  
