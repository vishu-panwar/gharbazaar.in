# 🏗️ GharBazaar Real-Time Architecture Report

**Generated:** February 1, 2026  
**Backend URL:** https://strict-matty-gharbazaar1-60d0c804.koyeb.app  
**Branch:** features/checking

---

## 📊 Executive Summary

Your GharBazaar platform implements a **hybrid real-time architecture** using Socket.IO for live updates and MongoDB for persistence. The system supports multiple user portals (Admin, Employee, Client) with role-based real-time communications and database-backed operations.

### ✅ Current Implementation Status

| Component | Status | Real-Time Support | Database Integration |
|-----------|--------|-------------------|---------------------|
| **Socket.IO Server** | ✅ Active | Yes | MongoDB (Primary) + Memory Fallback |
| **Admin Portal** | ✅ Implemented | Yes | MongoDB |
| **Employee Portal** | ✅ Implemented | Yes | MongoDB |
| **Client Portal** | ✅ Implemented | Yes | MongoDB |
| **Chat System** | ✅ Active | Yes | MongoDB + Memory Store |
| **Ticket System** | ✅ Active | Yes | MongoDB + Memory Store |
| **Notifications** | ✅ Active | Yes | MongoDB |
| **Presence Tracking** | ✅ Active | Yes | MongoDB + Memory |
| **Property Updates** | ⚠️ Partial | Limited | MongoDB |

---

## 🔌 Real-Time Event Architecture

### Socket.IO Connection Flow

```
Client → Socket.IO Connection → JWT Authentication → Role-Based Room Assignment → Event Handlers
```

**Authentication:** JWT-based socket middleware (`authenticateSocket`)  
**Transport:** WebSocket (primary) + HTTP Long Polling (fallback)  
**Ping/Timeout:** 60s timeout, 25s ping interval

### Active Socket Event Handlers

#### 1. **Chat System** (`chat.handler.ts`)
Real-time messaging between buyers, sellers, and support agents.

**Events:**
- `join_conversation` - User joins a chat room
- `leave_conversation` - User leaves a chat room  
- `send_message` - Send text/image/file message
- `typing` - Typing indicator
- `mark_read` - Mark messages as read

**Real-Time Broadcasts:**
- `new_message` → Conversation participants
- `user_typing` → Conversation participants
- `message_read` → Message sender

**Features:**
- ✅ Rate limiting (prevents spam)
- ✅ Message sanitization
- ✅ Spam detection
- ✅ File attachments support
- ✅ Read receipts
- ✅ Memory fallback mode

#### 2. **Ticket System** (`ticket.handler.ts`)
Support ticket management for employee-customer interactions.

**Events:**
- `join_employee_room` - Employees join monitoring room
- `join_ticket` - Join specific ticket room
- `leave_ticket` - Leave ticket room
- `ticket_message` - Send ticket message
- `assign_ticket` - Assign ticket to employee
- `close_ticket` - Close support ticket

**Real-Time Broadcasts:**
- `ticket:message` → Ticket participants
- `ticket:new-message` → All employees (notification)
- `ticket:assigned` → Ticket participants
- `ticket:status-changed` → Employees room
- `ticket:closed` → Ticket participants

**Authorization:**
- ✅ Employee-only rooms
- ✅ Participant verification
- ✅ Role-based access control

#### 3. **Presence System** (`presence.handler.ts`)
User online/offline status tracking.

**Events:**
- `presence:update-status` - Update user status (online/away/offline)
- `presence:get-status` - Query status of multiple users
- `presence:heartbeat` - Keep-alive signal

**Real-Time Broadcasts:**
- `presence:user-online` → All connected clients
- `presence:user-offline` → All connected clients
- `presence:status-changed` → All connected clients

**Features:**
- ✅ Automatic online detection on connect
- ✅ Automatic offline on disconnect
- ✅ Last seen timestamp
- ✅ Bulk status queries

#### 4. **Notification System** (`notification.handler.ts`)
Personal and role-based notifications.

**Room Structure:**
- `notifications:{userId}` - Personal notification room
- `role:{roleName}` - Role-based announcement rooms

**Real-Time Broadcasts:**
- `new_notification` → Specific user
- `new_announcement` → Role-based rooms

**Integration Points:**
- Admin announcements → `io.emit('new_announcement')`
- System notifications → User-specific rooms

#### 5. **Agent/Admin System** (`agent.handler.ts`)
Employee/admin specific functionality.

**Events:**
- Agent activity tracking
- Admin dashboard updates
- Employee task assignments

---

## 🗄️ Database Architecture

### Primary Database: MongoDB

**Connection:** Mongoose ODM  
**Pool Size:** 10 connections  
**Timeout:** 5s server selection, 45s socket timeout  
**Auto-Index:** Enabled

### Data Models (18 Collections)

#### Core User Models
1. **User** - Main user authentication and profiles
2. **EmployeeProfile** - Employee-specific data (ID, department, designation)
3. **BuyerProfile** - Buyer preferences and activity
4. **SellerProfile** - Seller stats and listings

#### Communication Models
5. **Conversation** - Chat conversations (buyer-seller, support)
6. **ConversationParticipant** - Many-to-many conversation membership
7. **Message** - Chat messages with file support
8. **Ticket** - Support ticket records
9. **TicketMessage** - Support ticket messages
10. **Notification** - User notifications

#### Property Models
11. **Property** - Real estate listings
12. **Bid** - Property bids/offers
13. **Favorite** - User saved properties

#### Employee Management
14. **Attendance** - Employee attendance tracking
15. **Salary** - Salary records
16. **Presence** - Real-time user status

#### Subscription Models
17. **Plan** - Subscription plan definitions
18. **UserPlan** - User subscription records

### Hybrid Storage Strategy

**Memory Store Fallback:**  
When MongoDB is unavailable, the system uses in-memory storage:
- `memoryConversations` (Map)
- `memoryMessages` (Map)
- `memoryTickets` (Map)
- `memoryPresence` (Map)

**Use Cases:**
- Development without MongoDB
- Temporary database outages
- Testing Socket.IO functionality

---

## 👥 Portal Integrations

### 1. Admin Portal

**Real-Time Capabilities:**
- ✅ Broadcast announcements to all users or roles
- ✅ Force logout users (`admin:force_logout`)
- ✅ Monitor employee activity
- ✅ View real-time ticket queue
- ✅ Property approval notifications

**Database Operations:**
- Employee CRUD (create, list, remove)
- Salary management
- Property moderation (approve/reject)
- User management
- Analytics dashboard queries

**API Endpoints:**
- `POST /api/v1/admin/employees` - Add employee
- `GET /api/v1/admin/employees` - List employees
- `DELETE /api/v1/admin/employees/:id` - Remove employee
- `POST /api/v1/admin/announcements` - Broadcast announcement
- `GET /api/v1/admin/analytics` - Dashboard stats
- `POST /api/v1/admin/users/:id/force-logout` - Force user logout

**Real-Time Events Sent:**
```typescript
io.emit('new_announcement', { title, message, target, priority })
io.emit('admin:force_logout', { userId })
```

### 2. Employee Portal

**Real-Time Capabilities:**
- ✅ Join employee monitoring room
- ✅ Real-time ticket notifications
- ✅ Live chat with customers
- ✅ Property approval queue updates
- ✅ Assignment notifications

**Database Operations:**
- Property moderation (approve/reject/pause)
- Ticket management
- Customer conversation handling
- Attendance tracking

**API Endpoints:**
- `GET /api/v1/employee/properties/pending` - Pending approvals
- `PUT /api/v1/employee/properties/:id/approve` - Approve property
- `PUT /api/v1/employee/properties/:id/reject` - Reject property
- `GET /api/v1/employee/tickets` - Employee tickets
- `POST /api/v1/employee/tickets/:id/assign` - Self-assign ticket
- `GET /api/v1/employee/conversations` - Customer chats

**Real-Time Events Received:**
```typescript
socket.on('join_employee_room')
socket.on('ticket:new-message')
socket.on('ticket:status-changed')
```

### 3. Client Portal (Buyer/Seller)

**Real-Time Capabilities:**
- ✅ Live chat with sellers/buyers
- ✅ Property view count updates
- ✅ Bid notifications
- ✅ Support ticket updates
- ✅ Personal notifications
- ✅ Online status indicators

**Database Operations:**
- Property listing (sellers)
- Property search and favorites (buyers)
- Bid creation and management
- Support ticket creation
- Profile management

**API Endpoints:**
- `GET /api/v1/properties/search` - Search properties
- `POST /api/v1/properties` - Create property listing
- `POST /api/v1/chat/conversations` - Start conversation
- `GET /api/v1/chat/conversations` - List conversations
- `POST /api/v1/tickets` - Create support ticket
- `GET /api/v1/notifications` - Get notifications

**Real-Time Events Received:**
```typescript
socket.on('new_message')
socket.on('ticket:message')
socket.on('new_notification')
socket.on('presence:user-online')
socket.on('property:view_update')
```

---

## 🔄 Data Flow Examples

### Example 1: Customer Support Flow

```
1. Client creates ticket → REST API → MongoDB
2. Backend emits → io.to('employees').emit('ticket:new', ticketData)
3. Employee receives notification → joins ticket room
4. Employee sends message → socket.emit('ticket_message', data)
5. Backend saves to DB → broadcasts to ticket room
6. Client receives real-time update → UI updates
```

### Example 2: Property Listing Flow

```
1. Seller creates property → REST API → MongoDB (status: 'pending')
2. Employee portal polls/receives notification
3. Employee approves property → REST API → MongoDB (status: 'active')
4. Backend emits → io.emit('property:view_update', propertyData)
5. All clients receive update → property appears in listings
```

### Example 3: Chat Message Flow

```
1. User types message → 'typing' event → Socket.IO
2. Other participants see typing indicator
3. User sends message → socket.emit('send_message', data)
4. Backend sanitizes, rate-limits, saves to MongoDB
5. Backend emits → io.to(conversationId).emit('new_message', message)
6. Participants receive real-time message → UI updates
7. Read receipts tracked via 'mark_read' event
```

---

## 🔒 Security & Reliability

### Security Measures Implemented

✅ **Authentication:**
- JWT-based socket authentication
- Role-based access control (RBAC)
- Participant verification for rooms

✅ **Rate Limiting:**
- Express rate limiter (1000 req/window)
- Socket-level rate limiting for messages
- Spam detection in messages

✅ **Data Sanitization:**
- Message content sanitization
- XSS prevention
- Input validation

✅ **CORS Configuration:**
- Whitelist-based origin control
- Credentials support

### Reliability Features

✅ **Database Resilience:**
- Automatic reconnection handling
- Memory fallback mode
- Connection pool management

✅ **Socket Reliability:**
- Graceful shutdown handling
- Automatic reconnection support
- Ping/pong health checks

✅ **Error Handling:**
- Comprehensive error logging
- User-friendly error messages
- Socket error events

---

## ⚠️ Current Gaps & Limitations

### 1. Property Real-Time Updates
**Issue:** Property view counts use Socket.IO but property listings aren't live-updated across clients.

**Impact:** When a property is created/updated, other users don't see changes without refresh.

**Recommendation:**
```typescript
// In property.controller.ts after create/update
io.emit('property:new', propertyData)
io.emit('property:updated', propertyData)
io.emit('property:deleted', propertyId)
```

### 2. Bid System Real-Time
**Issue:** Bid system exists in database but lacks real-time notifications.

**Impact:** Sellers don't receive instant bid alerts; buyers can't see competing bids.

**Recommendation:** Add bid socket handler:
```typescript
socket.on('place_bid', async (data) => {
  // Save bid to DB
  io.to(propertyOwnerId).emit('new_bid', bidData)
  io.to(propertyId).emit('bid:update', { totalBids, highestBid })
})
```

### 3. Analytics Real-Time Dashboard
**Issue:** Admin/employee dashboards don't have live metrics.

**Impact:** Stats require manual refresh; no real-time monitoring.

**Recommendation:** Periodic broadcast or dashboard subscription:
```typescript
setInterval(() => {
  io.to('role:admin').emit('dashboard:stats', stats)
}, 30000) // Every 30s
```

### 4. File Upload Progress
**Issue:** File uploads in chat don't show progress.

**Impact:** Users don't know if large files are uploading.

**Recommendation:** Add upload progress events via Socket.IO or use separate upload endpoint with streaming.

### 5. Transaction Safety
**Issue:** Some critical operations lack transaction support.

**Impact:** Potential data inconsistency on failures (e.g., property approval + counter increment).

**Recommendation:** Use MongoDB transactions:
```typescript
const session = await mongoose.startSession()
session.startTransaction()
try {
  // Multiple operations
  await session.commitTransaction()
} catch (error) {
  await session.abortTransaction()
}
```

### 6. Search Real-Time Sync
**Issue:** Search results are static after initial fetch.

**Impact:** New properties don't appear in search without manual refresh.

**Recommendation:** Either periodic polling or listen to property events:
```typescript
socket.on('property:new', (property) => {
  // Update local search results if filters match
})
```

### 7. Message Delivery Confirmation
**Issue:** No acknowledgment that messages reached the server.

**Impact:** Users unsure if message was sent during network issues.

**Recommendation:** Use Socket.IO acknowledgments:
```typescript
socket.emit('send_message', data, (response) => {
  if (response.success) {
    // Show delivered checkmark
  }
})
```

---

## 📈 Recommendations for Improvement

### High Priority

1. **Add Property Broadcasting**
   - Emit property creation, updates, deletions globally
   - Enable live property grid updates
   - Improve user experience significantly

2. **Implement Bid Real-Time System**
   - Real-time bid notifications
   - Live bid updates on property pages
   - Competitive bidding experience

3. **Add Message Acknowledgments**
   - Delivery confirmation
   - Read receipts enhancement
   - Offline message queuing

4. **Database Transaction Support**
   - Wrap critical multi-step operations
   - Ensure data consistency
   - Prevent orphaned records

### Medium Priority

5. **Enhanced Analytics Dashboard**
   - Live metrics streaming
   - Real-time user count
   - Active conversation monitoring
   - Property view trends

6. **File Upload Progress**
   - Chunked upload with progress
   - Large file handling
   - Upload cancellation

7. **Search Real-Time Sync**
   - Subscribe to property updates
   - Auto-update search results
   - Filter-based subscriptions

8. **Offline Support**
   - Message queue when offline
   - Auto-retry on reconnect
   - Offline indicator UI

### Low Priority

9. **Load Testing**
   - Simulate 1000+ concurrent connections
   - Identify bottlenecks
   - Optimize socket rooms

10. **Monitoring & Logging**
    - Add application monitoring (e.g., Sentry)
    - Socket.IO metrics dashboard
    - Database query performance tracking

11. **API Documentation**
    - Complete Swagger documentation
    - Socket event documentation
    - Integration examples

---

## 🚀 Scaling Considerations

### Current Limitations

**Single-Server Architecture:**
- All Socket.IO connections to one server instance
- No horizontal scaling support yet

**Memory Store:**
- Fallback mode not production-ready
- Data loss on server restart

### Scaling Path

#### Phase 1: Redis Adapter (Recommended Next Step)
```typescript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: 'redis://localhost:6379' })
const subClient = pubClient.duplicate()

await Promise.all([pubClient.connect(), subClient.connect()])

io.adapter(createAdapter(pubClient, subClient))
```

**Benefits:**
- Multiple server instances
- Shared socket rooms across servers
- Horizontal scaling enabled

#### Phase 2: Message Queue
- Add RabbitMQ or Redis Pub/Sub
- Decouple event processing
- Background job processing

#### Phase 3: Database Optimization
- Read replicas for queries
- Sharding for large collections
- Query optimization and indexing

#### Phase 4: CDN & Caching
- Cache property listings
- CDN for static assets
- Redis cache layer

---

## 📊 Performance Metrics

### Current Configuration

| Metric | Value |
|--------|-------|
| MongoDB Pool Size | 10 connections |
| Socket Ping Timeout | 60,000ms (60s) |
| Socket Ping Interval | 25,000ms (25s) |
| Rate Limit Window | 15 minutes |
| Rate Limit Max Requests | 1000 |
| Socket Transports | WebSocket + Polling |

### Recommended Monitoring

**Track These Metrics:**
- Active socket connections (current: tracked in code)
- Message throughput (messages/second)
- Database query latency
- Socket event latency
- Memory usage
- CPU usage
- Error rates

**Tools to Consider:**
- Socket.IO Admin UI
- MongoDB Atlas monitoring
- Application Performance Monitoring (APM)
- Custom metrics dashboard

---

## 🎯 Conclusion

### Strengths

✅ **Solid Foundation:** Well-structured Socket.IO implementation with proper authentication  
✅ **Role-Based Architecture:** Clear separation of admin, employee, and client portals  
✅ **Dual Storage:** MongoDB + memory fallback provides flexibility  
✅ **Security:** JWT auth, rate limiting, sanitization implemented  
✅ **Core Features:** Chat, tickets, presence all working with real-time updates  

### Areas for Enhancement

⚠️ **Property Broadcasting:** Add real-time property updates across clients  
⚠️ **Bid System:** Implement real-time bidding notifications  
⚠️ **Acknowledgments:** Add message delivery confirmation  
⚠️ **Transactions:** Use database transactions for critical operations  
⚠️ **Scaling:** Plan for Redis adapter when user base grows  

### Overall Assessment

**Grade: B+ (Very Good)**

Your real-time architecture is production-capable with proper authentication, role-based access, and comprehensive socket handlers. The system successfully provides real-time chat, tickets, presence, and notifications. With the addition of property broadcasting, bid notifications, and message acknowledgments, this will be an A-grade real-time platform.

---

**Next Steps:**
1. Review this report with your team
2. Prioritize the high-priority recommendations
3. Implement property broadcasting first (highest user impact)
4. Add monitoring and metrics tracking
5. Plan for Redis adapter when scaling beyond single server

**Report End**
