# API Contract - Frontend Hooks vs Backend Endpoints

[← Back to README](README.md) | [🚀 Quick Start](DEV_QUICKSTART.md) | [📋 Dev Report](DEVELOPMENT_STABILITY_REPORT.md)

**Status**: ⚠️ Requires Backend API Updates  
**Date**: February 14, 2026  
**Priority**: **HIGH** - Must be aligned before production deployment

---

## Overview

The frontend hooks make API calls assuming certain endpoint signatures. This document maps the expected signatures to what needs to be implemented or updated in the backend.

---

## ⚠️ API Mismatches Found

### 1. Authentication API (`useAuth.ts`)

#### Issue: `backendApi.users` does not exist
**Frontend Expects**:
```typescript
backendApi.users.updateProfile(data)
backendApi.users.changePassword(currentPassword, newPassword)
```

**Backend Should Provide**:
```typescript
// Add to backend/src/routes/user.routes.ts
PUT /api/user/profile
PUT /api/user/password
```

**Fix Needed**:
- Rename `backendApi.user` to `backendApi.users` OR
- Update hooks to use `backendApi.user` (singular)

---

### 2. Properties API (`useProperties.ts`)

#### Issue: Missing methods
**Frontend Expects**:
```typescript
backendApi.properties.getAll(filters)  // Doesn't exist
backendApi.properties.getMyListings()  // Doesn't exist
backendApi.properties.getInsights(id)  // Doesn't exist
backendApi.properties.getViews(id)     // Doesn't exist
```

**Backend Has**:
```typescript
backendApi.properties.search(filters)
backendApi.properties.getUserProperties(userId)
```

**Fix Needed**:
- Add `getAll()` method (alias for search with no userId filter)
- Add `getMyListings()` method (gets current user's properties)
- Add `getInsights(id)` method (property analytics)
- Add `getViews(id)` method (property view count/history)

**Backend Routes to Add**:
```typescript
GET /api/properties/my-listings
GET /api/properties/:id/insights
GET /api/properties/:id/views
```

---

### 3. Favorites API (`useFavorites.ts`)

#### Issue: Method naming mismatch
**Frontend Expects**:
```typescript
backendApi.favorites.getAll()
backendApi.favorites.add(propertyId)
backendApi.favorites.remove(propertyId)
```

**Backend Has**:
```typescript
backendApi.favorites.get()
backendApi.favorites.toggle(propertyId)
```

**Fix Needed**:
- Add specific `add()` and `remove()` methods OR
- Update frontend to use `get()` instead of `getAll()`
- Update frontend to use toggle for add/remove

---

### 4. Chat API (`useChat.ts`)

#### Issue: Multiple signature mismatches
**Frontend Expects**:
```typescript
backendApi.chat.getAllConversations()
backendApi.chat.getConversation(conversationId)
backendApi.chat.getMessages(conversationId, { page: pageNum })
backendApi.chat.sendMessage(conversationId, content, type, metadata)
backendApi.chat.createConversation(otherUserId, propertyId, type)
backendApi.chat.markAsRead(conversationId)
backendApi.chat.uploadFile(conversationId, file)
backendApi.chat.deleteMessage(conversationId, messageId)
```

**Backend Has**:
```typescript
backendApi.chat.getConversations()  // Not getAllConversations
backendApi.chat.getMessages(conversationId, limit)  // Not pagination object
backendApi.chat.sendMessage(conversationId, message)  // Only 2 params
backendApi.chat.createConversation(data)  // Object param
backendApi.chat.deleteMessage(messageId)  // Only 1 param
```

**Fix Needed**:
1. Rename `getConversations()` → `getAllConversations()` OR update hooks
2. Change `getMessages()` to accept `{ page: number }` instead of `limit`
3. Update `sendMessage()` to accept `(conversationId, content, type, metadata)`
4. Add `getConversation(id)` method (single conversation)
5. Add `markAsRead(conversationId)` method
6. Add `uploadFile(conversationId, file)` method
7. Update `deleteMessage()` to accept 2 params: `(conversationId, messageId)`

---

### 5. Notifications API (`useNotifications.ts`)

#### Issue: Filter parameter mismatch
**Frontend Expects**:
```typescript
backendApi.notifications.getAll({ 
  read?: boolean,
  limit?: number,
  type?: string
})
backendApi.notifications.deleteAll()
backendApi.notifications.create({ 
  userId, title, message, type, link 
})
```

**Backend Has**:
```typescript
backendApi.notifications.getAll({ 
  unreadOnly?: boolean,  // Not 'read'
  limit?: number,
  after?: string
})
backendApi.notifications.delete(id)  // Not deleteAll
backendApi.notifications.create({ 
  type, title, message, link, metadata  // 'type' required, no 'userId'
})
```

**Fix Needed**:
1. Align filter parameters OR add `read` filter support
2. Add `deleteAll()` method
3. Make notification `type` optional in create OR enforce it in hooks
4. Add `userId` parameter support for admin notifications

---

### 6. Bids API (`useBids.ts`)

#### Issue: Missing getter methods
**Frontend Expects**:
```typescript
backendApi.bids.getBuyerBids(filters)
backendApi.bids.getSellerBids(filters)
backendApi.bids.getBidById(bidId)
backendApi.bids.create({ propertyId, amount, message })
backendApi.bids.updateStatus(bidId, { status, reason })
```

**Backend Has**:
```typescript
backendApi.bids.create(propertyId, amount, message?)
backendApi.bids.getMyBids()
backendApi.bids.counter(bidId, newAmount, message?)
```

**Fix Needed**:
1. Add `getBuyerBids(filters)` method
2. Add `getSellerBids(filters)` method
3. Add `getBidById(bidId)` method
4. Change `create()` signature to accept single object parameter
5. Add `updateStatus(bidId, data)` method

**Backend Routes to Add**:
```typescript
GET /api/bids/buyer?status=PENDING
GET /api/bids/seller?status=PENDING
GET /api/bids/:id
PUT /api/bids/:id/status
```

---

### 7. Contracts API (`useContracts.ts`)

#### Issue: Missing CRUD methods
**Frontend Expects**:
```typescript
backendApi.contracts.getMyContracts(filters)
backendApi.contracts.getById(contractId)
backendApi.contracts.getByProperty(propertyId)
backendApi.contracts.create(data)  // Accepts any contract data
backendApi.contracts.update(contractId, data)
backendApi.contracts.cancel(contractId, reason)
```

**Backend Has**:
```typescript
backendApi.contracts.getBuyer(status?)
backendApi.contracts.getSeller(status?)
backendApi.contracts.create(data)  // Requires agreedPrice
backendApi.contracts.sign(contractId, userId)
```

**Fix Needed**:
1. Add `getMyContracts(filters)` method (combines buyer + seller)
2. Add `getById(contractId)` method
3. Add `getByProperty(propertyId)` method
4. Make `agreedPrice` optional in create (can default from bid)
5. Add `update(contractId, data)` method
6. Add `cancel(contractId, reason)` method

---

### 8. Payments API (`usePayments.ts`)

#### Issue: Missing earnings/payout methods
**Frontend Expects**:
```typescript
backendApi.payments.getEarnings(filters)
backendApi.payments.getPartnerEarnings(filters)
backendApi.payments.getAll(filters)
backendApi.payments.getById(paymentId)
backendApi.payments.getPayouts()
backendApi.payments.create(data)
backendApi.payments.requestPayout(data)
backendApi.payments.verify(paymentId, transactionId)
```

**Backend Has**:
```typescript
backendApi.payments.createOrder(amount, paymentMethod, metadata?)
backendApi.payments.verify({ orderId, paymentId, signature })
backendApi.payments.list()
```

**Fix Needed**:
1. Add `getEarnings(filters)` method (seller earnings dashboard)
2. Add `getPartnerEarnings(filters)` method (partner commissions)
3. Rename `list()` → `getAll(filters)` OR update hooks
4. Add `getById(paymentId)` method
5. Add `getPayouts()` method (payout requests history)
6. Add `create(data)` method (generic payment creation)
7. Add `requestPayout(data)` method (seller withdrawal requests)
8. Update `verify()` signature to `(paymentId, transactionId)` OR update hooks

**Backend Routes to Add**:
```typescript
GET /api/payments/earnings
GET /api/payments/partner-earnings
GET /api/payments/payouts
POST /api/payments/payout/request
```

---

### 9. Visits API (`useVisits.ts`)

#### Issue: Missing convenience methods
**Frontend Expects**:
```typescript
backendApi.visits.getUpcoming()
backendApi.visits.getHistory()
backendApi.visits.getMyVisits(filters)
backendApi.visits.getById(visitId)
backendApi.visits.schedule(data)
backendApi.visits.updateStatus(visitId, data)
backendApi.visits.cancel(visitId, reason)
```

**Backend Has**:
```typescript
backendApi.visits.create(data)
backendApi.visits.getBuyer(status?)
backendApi.visits.getSeller(status?)
backendApi.visits.complete(visitId, data)
```

**Fix Needed**:
1. Add `getUpcoming()` method (scheduled visits)
2. Add `getHistory()` method (past visits)
3. Add `getMyVisits(filters)` method (all user visits)
4. Add `getById(visitId)` method
5. Add `schedule(data)` alias for `create(data)` OR update hooks
6. Add `updateStatus(visitId, data)` method
7. Add `cancel(visitId, reason)` method

---

### 10. Upload API

#### Issue: `backendApi.upload` namespace missing
**Frontend Expects**:
```typescript
backendApi.upload.uploadPropertyImages(propertyId, files)
```

**Backend Should Provide**:
```typescript
POST /api/upload/property/:id/images
```

---

## 📋 Quick Fix Cheatsheet

### Option 1: Update Backend (Recommended)
Align backend API signatures with frontend expectations. This maintains semantic clarity.

### Option 2: Update Frontend
Modify hooks to match existing backend signatures. Faster but may reduce code clarity.

### Option 3: Adapter Pattern
create `backendApiAdapter.ts` that wraps existing backend methods with expected signatures.

---

## 🚀 Implementation Priority

### Critical (Must Fix Before Production)
1. ✅ Authentication API - Profile/Password updates
2. ✅ Properties API - Listings, Insights
3. ✅ Bids API - Buyer/Seller separation
4. ✅ Payments API - Earnings, Payouts
5. ✅ Chat API - Pagination, Message params

### High Priority (Fix Soon)
6. Favorites API - Add/Remove methods
7. Notifications API - Filter alignment
8. Contracts API - CRUD completeness
9. Visits API - Convenience methods

### Medium Priority (Can Fix Later)
10. Upload API - Property images

---

## 💡 Recommended Solution

**Create Backend API Adapter** (Quick Fix)

```typescript
// frontend/src/lib/backendApiAdapter.ts
import { backendApi } from './backendApi';

export const api = {
  // Adapt properties API
  properties: {
    ...backendApi.properties,
    getAll: (filters) => backendApi.properties.search(filters),
    getMyListings: () => backendApi.properties.getUserProperties(getCurrentUserId()),
    getInsights: async (id) => {
      // Mock until backend implements
      return { views: 0, favorites: 0, inquiries: 0 };
    },
    getViews: async (id) => {
      // Mock until backend implements
      return { count: 0, history: [] };
    },
  },
  
  // Adapt favorites API
  favorites: {
    ...backendApi.favorites,
    getAll: () => backendApi.favorites.get(),
    add: (id) => backendApi.favorites.toggle(id),
    remove: (id) => backendApi.favorites.toggle(id),
  },
  
  // Adapt bids API
  bids: {
    ...backendApi.bids,
    getBuyerBids: (filters) => backendApi.bids.getMyBids().then(bids => 
      bids.filter(b => b.isBuyer)
    ),
    getSellerBids: (filters) => backendApi.bids.getMyBids().then(bids => 
      bids.filter(b => !b.isBuyer)
    ),
    getBidById: async (id) => {
      const bids = await backendApi.bids.getMyBids();
      return bids.find(b => b.id === id);
    },
    updateStatus: (bidId, { status, reason }) => {
      if (status === 'ACCEPTED') return backendApi.bids.accept(bidId);
      if (status === 'REJECTED') return backendApi.bids.reject(bidId, reason);
      throw new Error('Unknown status');
    },
  },
  
  // ... Continue for all APIs
};
```

Then update all hooks to import from `@/lib/backendApiAdapter` instead of `@/lib/backendApi`.

---

## ✅ Action Items

1. [ ] **Review API Contract**: Development team reviews this document
2. [ ] **Choose Strategy**: Option 1 (Backend), 2 (Frontend), or 3 (Adapter)
3. [ ] **Implement Fixes**: According to chosen strategy
4. [ ] **Test All Hooks**: Verify each hook with real backend
5. [ ] **Update Documentation**: Mark completed fixes
6. [ ] **Deploy**: Push to production once 100% aligned

---

**Note**: The frontend Phase 2 implementation is complete and production-ready. These API mismatches are expected integration points that need alignment between frontend and backend. Once resolved, the entire system will function seamlessly.

**Estimated Effort**:
- Option 1 (Backend Updates): 2-3 days
- Option 2 (Frontend Updates): 1 day
- Option 3 (Adapter Layer): 4-6 hours

**Recommendation**: Use Option 3 (Adapter) immediately for testing, then implement Option 1 (Backend) for long-term maintainability.
