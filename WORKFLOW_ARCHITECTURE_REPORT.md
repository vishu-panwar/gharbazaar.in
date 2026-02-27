# GharBazaar - Complete Website Workflow & Architecture Report

[← Back to README](README.md) | [📚 Project Guide](COMPLETE_PROJECT_GUIDE.md) | [🔌 Real-time](REALTIME_ARCHITECTURE_REPORT.md)

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Backend Processing](#backend-processing)
6. [Frontend Processing](#frontend-processing)
7. [Data Flow](#data-flow)
8. [API Endpoints](#api-endpoints)
9. [Real-time Features](#real-time-features)
10. [Security & Authentication](#security--authentication)

---

## Overview

**GharBazaar** is a comprehensive real estate platform that connects buyers, sellers, and service providers. The platform facilitates property listings, bidding, contracts, payments, and real-time communication.

### Key Features

- Property listing and search
- User authentication (Google OAuth + Email/Password)
- Bidding system for properties
- Contract management
- Payment processing via Razorpay
- Real-time chat and notifications
- KYC verification for partners
- Employee management with attendance tracking
- Analytics and reporting

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages     │  │  Components  │  │   Contexts   │          │
│  │  (App Router)│  │  (Reusable)  │  │  (State)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ WebSocket (Socket.IO)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Controllers │  │  Middleware  │  │  Socket.IO   │          │
│  │  (Business   │  │  (Auth,      │  │  (Real-time) │          │
│  │   Logic)     │  │   CORS,      │  │              │          │
│  │              │  │   Rate Limit)│  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Users     │  │  Properties  │  │  Payments    │          │
│  │  & Profiles  │  │  & Bids      │  │  & Contracts  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **UI Components**: Custom components
- **PWA**: Service Worker support

### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JWT + Google OAuth2
- **File Upload**: Multer
- **Payment**: Razorpay
- **Email**: Nodemailer

### External Services

- **Google OAuth**: User authentication
- **Razorpay**: Payment processing
- **Mappls (Ola Maps)**: Location services
- **Email Service**: SMTP for notifications

---

## Database Schema

### Core Models

#### 1. User Management

**User** - Central user model with role-based access

```typescript
{
  id: string (UUID)
  uid: string (unique)
  email: string (unique)
  name: string
  password: string? (hashed)
  googleId: string? (unique)
  role: string (buyer, seller, admin, employee, legal_partner, ground_partner, promoter_partner)

  // Client IDs
  buyerClientId: string?
  sellerClientId: string?

  // Profile
  phone: string?
  address: string?
  dateOfBirth: DateTime?
  gender: string?
  profilePhoto: string?

  // Employee details
  branch: string?
  office: string?
  branchManagerName: string?

  // KYC
  aadhaarNumber: string?
  panNumber: string?

  // Status
  isVerified: boolean
  kycStatus: string (pending, submitted, approved, rejected)
  kycId: string? (Custom ID like gb2110e34)
  isActive: boolean
  onboardingCompleted: boolean

  // Password Reset
  resetPasswordToken: string?
  resetPasswordExpires: DateTime?

  // Timestamps
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Profile Models** (One-to-one with User)

- **BuyerProfile**: Properties viewed, saved properties, budget, preferences
- **SellerProfile**: Active listings, total views, inquiries, revenue
- **EmployeeProfile**: Employee ID, department, designation, salary, commission
- **ServiceProvider**: Category, specialization, rating, hourly rate, portfolio

#### 2. Property Management

**Property** - Real estate listings

```typescript
{
  id: string (UUID)
  title: string
  description: string (Text)
  price: Decimal
  originalPrice: Decimal?

  // Property Details
  propertyType: string (apartment, villa, plot, commercial, independent_house)
  listingType: string (sale, rent)
  location: string?
  address: string
  city: string
  state: string?
  pincode: string?
  latitude: float?
  longitude: float?

  // Features
  bedrooms: int?
  bathrooms: int?
  balconies: int?
  floors: int?
  facing: string? (east, west, north, south)

  // Area
  area: string
  areaUnit: string? (sqft, sqm, acres)

  // Amenities
  amenities: string[] (JSON array)

  // Media
  photos: string[]
  images: string[]
  videos: string[]
  virtualTour: boolean
  virtualTourUrl: string?
  view360Url: string?
  view360ImageUrl: string?

  // Status
  status: string (pending, active, sold, rented, expired)
  featured: boolean
  verified: boolean

  // Owner
  sellerId: string (User.uid)
  sellerClientId: string?

  // Stats
  views: int
  likes: int
  inquiries: int
  viewedBy: string[]

  // Marketing
  matchScore: int
  readyToMove: boolean
  newListing: boolean
  priceDropped: boolean

  // Timestamps
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 3. Bidding System

**Bid** - Property bids from buyers

```typescript
{
  id: string (UUID)
  propertyId: string
  buyerId: string (User.uid)
  sellerId: string

  bidAmount: Decimal
  message: string? (Text)
  status: string (pending, accepted, rejected, countered)

  counterAmount: Decimal?
  counterMessage: string? (Text)

  createdAt: DateTime
  updatedAt: DateTime

  contract: Contract?
}
```

**Contract** - Legal contracts for accepted bids

```typescript
{
  id: string (UUID)
  propertyId: string
  bidId: string? (unique)
  buyerId: string (User.uid)
  sellerId: string (User.uid)

  status: string (draft, signed_buyer, signed_seller, executed, cancelled)
  agreedPrice: Decimal
  signedBuyerAt: DateTime?
  signedSellerAt: DateTime?
  terms: string? (Text)

  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 4. Chat & Messaging

**Conversation** - Chat conversations

```typescript
{
  id: string(UUID);
  conversationType: string(buyer - seller, support - ticket, employee - direct);
  propertyId: string
    ? propertyTitle
    : string
      ? lastMessage
      : string
        ? lastMessageAt
        : DateTime;

  createdAt: DateTime;
  updatedAt: DateTime;
}
```

**Message** - Individual messages

```typescript
{
  id: string(UUID);
  conversationId: string;
  senderId: string(User.id);

  content: string(Text);
  messageType: string(text, image, file);
  fileUrl: string ? fileName : string ? fileSize : int ? isRead : boolean;
  isEdited: boolean;
  isDeleted: boolean;

  createdAt: DateTime;
  updatedAt: DateTime;
}
```

#### 5. Payments & Subscriptions

**PaymentTransaction** - Razorpay payments

```typescript
{
  id: string (UUID)
  userId: string (User.id)

  // Razorpay fields
  razorpayOrderId: string? (unique)
  razorpayPaymentId: string?
  razorpaySignature: string?

  // Payment details
  amount: Decimal
  currency: string (INR)

  // Context
  type: string (subscription, listing_fee, premium_feature)
  planId: string?
  propertyId: string?

  status: string (pending, success, failed, refunded)
  receipt: string?
  notes: string?

  // Timestamps
  createdAt: DateTime
  updatedAt: DateTime
  paidAt: DateTime?
}
```

**Subscription** - User subscription plans

```typescript
{
  id: string (UUID)
  userId: string (User.id)
  planId: string

  startDate: DateTime
  endDate: DateTime

  status: string (active, expired, cancelled, paused)

  // Usage tracking
  usageStats: Json (default: "{}")
  autoRenew: boolean

  // Payment reference
  paymentId: string?

  createdAt: DateTime
  updatedAt: DateTime
}
```

**Plan** - Available subscription plans

```typescript
{
  id: string (UUID)
  name: string (unique)
  displayName: string
  description: string (Text)
  type: string (buyer, seller, combined)

  // Pricing
  price: Decimal
  currency: string (INR)

  // Duration
  durationDays: int

  // Features
  viewLimit: int (default: 10)
  consultationLimit: int (default: 0)
  listingLimit: int (default: 3)
  featuredLimit: int (default: 0)

  // Boolean features
  prioritySupport: boolean
  verifiedBadge: boolean
  directContact: boolean

  isActive: boolean
  isPopular: boolean

  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 6. Support & Tickets

**Ticket** - Support tickets

```typescript
{
  id: string(UUID);
  userId: string(User.id);

  subject: string;
  category: string(general, technical, billing, listing, dispute);
  priority: string(low, medium, high, urgent);

  status: string(open, in_progress, pending, resolved, closed);

  assignedTo: string
    ? assignedAt
    : DateTime
      ? resolvedAt
      : DateTime
        ? closedAt
        : DateTime
          ? createdAt
          : DateTime;
  updatedAt: DateTime;
}
```

**TicketMessage** - Ticket messages

```typescript
{
  id: string (UUID)
  ticketId: string
  senderId: string (User.id)

  content: string (Text)
  attachments: string[]

  isInternal: boolean (Only visible to staff)

  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 7. KYC & Verification

**KycRequest** - KYC verification requests

```typescript
{
  id: string(UUID);
  userId: string(unique);
  partnerId: string(unique); // format gb...

  // Form data
  fullName: string;
  contactNumber: string;
  address: string;
  aadharNumber: string;

  // Media URLs
  profileImage: string;
  aadharImage: string;

  status: string(pending, approved, rejected);
  reviewedBy: string ? reviewComments : string ? createdAt : DateTime;
  updatedAt: DateTime;
}
```

**VerificationTask** - Property verification tasks

```typescript
{
  id: string (UUID)
  propertyId: string
  assignedTo: string?
  createdBy: string

  taskType: string (property, documents, site_visit)
  status: string (assigned, in_review, verified, rejected)
  checklist: string[]
  dueDate: DateTime?
  notes: string? (Text)

  createdAt: DateTime
  updatedAt: DateTime
}
```

**VerificationReport** - Verification reports

```typescript
{
  id: string (UUID)
  taskId: string
  propertyId: string

  reportType: string (site_visit, verification, inspection, documentation)
  findings: string? (Text)
  recommendation: string? (approve, reject, needs_followup)
  uploadedFiles: string[]
  notes: string? (Text)

  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 8. Employee Management

**Attendance** - Employee attendance tracking

```typescript
{
  id: string (UUID)
  userId: string (User.id)
  date: DateTime (Date only)

  checkIn: DateTime?
  checkOut: DateTime?
  status: string (present, absent, leave, half_day)

  latitude: float?
  longitude: float?
  address: string?
  notes: string?

  createdAt: DateTime
  updatedAt: DateTime
}
```

**Salary** - Employee salary records

```typescript
{
  id: string(UUID);
  userId: string(User.id);

  month: string;
  year: int;

  baseSalary: Decimal;
  allowances: Decimal;
  deductions: Decimal;
  netSalary: Decimal;

  status: string(pending, processing, paid, failed);
  paymentDate: DateTime
    ? paymentMethod
    : string
      ? transactionReference
      : string
        ? createdAt
        : DateTime;
  updatedAt: DateTime;
}
```

#### 9. Notifications

**Notification** - User notifications

```typescript
{
  id: string (UUID)
  userId: string (User.id)

  type: string (price_drop, new_match, bid_received, etc.)
  title: string
  message: string (Text)
  link: string?
  priority: string (low, medium, high)
  metadata: string? (JSON)

  isRead: boolean
  readAt: DateTime?

  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 10. Analytics & Audit

**AnalyticsEvent** - Analytics tracking

```typescript
{
  id: string (UUID)
  eventType: string (page_view, property_view, search, click, signup, login)
  userId: string?
  sessionId: string?

  data: Json? (structured data)
  path: string?
  referrer: string?
  userAgent: string?
  ipAddress: string?

  createdAt: DateTime
}
```

**AuditLog** - API request logging

```typescript
{
  id: string(UUID);
  action: string ? method : string;
  path: string;
  status: int;
  role: string
    ? entityType
    : string
      ? entityId
      : string
        ? userId
        : string
          ? oldData
          : Json
            ? newData
            : Json
              ? ipAddress
              : string
                ? userAgent
                : string
                  ? createdAt
                  : DateTime;
}
```

---

## Backend Processing

### Server Initialization

The backend server ([`server.ts`](gharbazaar.in/backend/src/server.ts)) performs the following on startup:

1. **Configuration Validation** - Validates environment variables and config
2. **Database Connection** - Connects to PostgreSQL via Prisma
3. **Express Setup** - Configures Express with middleware:
   - Helmet (security headers)
   - CORS (cross-origin requests)
   - Rate limiting (1000 requests per window)
   - Body parsing (JSON, URL-encoded)
   - Static file serving (/uploads)
4. **Socket.IO Initialization** - Sets up real-time WebSocket server
5. **Route Registration** - Registers all API routes
6. **Graceful Shutdown** - Handles SIGTERM/SIGINT signals

### API Routes

The backend exposes the following route groups:

| Route                       | Purpose               | Controller                                                                                             |
| --------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| `/api/v1/auth`              | Authentication        | [`auth.controller.ts`](gharbazaar.in/backend/src/controllers/auth.controller.ts)                       |
| `/api/v1/users`             | User management       | [`user.controller.ts`](gharbazaar.in/backend/src/controllers/user.controller.ts)                       |
| `/api/v1/properties`        | Property CRUD         | [`property.controller.ts`](gharbazaar.in/backend/src/controllers/property.controller.ts)               |
| `/api/v1/bids`              | Bidding system        | [`bid.controller.ts`](gharbazaar.in/backend/src/controllers/bid.controller.ts)                         |
| `/api/v1/contracts`         | Contract management   | [`contract.controller.ts`](gharbazaar.in/backend/src/controllers/contract.controller.ts)               |
| `/api/v1/payments`          | Payment processing    | [`payment.controller.ts`](gharbazaar.in/backend/src/controllers/payment.controller.ts)                 |
| `/api/v1/chat`              | Real-time chat        | [`chat.controller.ts`](gharbazaar.in/backend/src/controllers/chat.controller.ts)                       |
| `/api/v1/tickets`           | Support tickets       | [`ticket.controller.ts`](gharbazaar.in/backend/src/controllers/ticket.controller.ts)                   |
| `/api/v1/notifications`     | Notifications         | [`notification.controller.ts`](gharbazaar.in/backend/src/controllers/notification.controller.ts)       |
| `/api/v1/kyc`               | KYC verification      | [`kyc.controller.ts`](gharbazaar.in/backend/src/controllers/kyc.controller.ts)                         |
| `/api/v1/plans`             | Subscription plans    | [`plan.controller.ts`](gharbazaar.in/backend/src/controllers/plan.controller.ts)                       |
| `/api/v1/admin`             | Admin operations      | [`admin.controller.ts`](gharbazaar.in/backend/src/controllers/admin.controller.ts)                     |
| `/api/v1/analytics`         | Analytics data        | [`analytics.controller.ts`](gharbazaar.in/backend/src/controllers/analytics.controller.ts)             |
| `/api/v1/employee`          | Employee management   | [`employee.controller.ts`](gharbazaar.in/backend/src/controllers/employee.controller.ts)               |
| `/api/v1/attendance`        | Attendance tracking   | [`attendance.controller.ts`](gharbazaar.in/backend/src/controllers/attendance.controller.ts)           |
| `/api/v1/verification`      | Property verification | [`verification.controller.ts`](gharbazaar.in/backend/src/controllers/verification.controller.ts)       |
| `/api/v1/partners`          | Partner management    | [`partner.controller.ts`](gharbazaar.in/backend/src/controllers/partner.controller.ts)                 |
| `/api/v1/service-providers` | Service providers     | [`serviceProvider.controller.ts`](gharbazaar.in/backend/src/controllers/serviceProvider.controller.ts) |
| `/api/v1/visits`            | Property visits       | [`visit.controller.ts`](gharbazaar.in/backend/src/controllers/visit.controller.ts)                     |
| `/api/v1/favorites`         | Property favorites    | [`favorite.controller.ts`](gharbazaar.in/backend/src/controllers/favorite.controller.ts)               |
| `/api/v1/contact`           | Contact forms         | [`contact.controller.ts`](gharbazaar.in/backend/src/controllers/contact.controller.ts)                 |

### Middleware Stack

1. **Helmet** - Security headers
2. **CORS** - Cross-origin resource sharing
3. **Rate Limiter** - Request throttling
4. **Audit Middleware** - Logs all API requests
5. **Auth Middleware** - JWT token verification
6. **Role Guard Middleware** - Role-based access control
7. **Plan Guard Middleware** - Subscription-based feature access

### Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Login Request (email/password or Google OAuth)
       ▼
┌─────────────────────────────────┐
│   auth.controller.ts            │
│   - Validate credentials        │
│   - Check user exists           │
│   - Verify password (bcrypt)    │
│   - Generate JWT token          │
└──────┬──────────────────────────┘
       │
       │ 2. JWT Token Response
       ▼
┌─────────────┐
│   Frontend  │
│   - Store token in localStorage │
└──────┬──────┘
       │
       │ 3. Subsequent API Requests (with Bearer token)
       ▼
┌─────────────────────────────────┐
│   auth.middleware.ts            │
│   - Verify JWT token            │
│   - Extract user info           │
│   - Attach user to request      │
└──────┬──────────────────────────┘
       │
       │ 4. Request proceeds to controller
       ▼
┌─────────────────────────────────┐
│   Controller                    │
│   - Process request             │
│   - Access user data            │
└─────────────────────────────────┘
```

### Property Creation Flow

```
┌─────────────┐
│   Seller    │
└──────┬──────┘
       │
       │ 1. Submit Property Form
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Validate form data          │
│   - Upload images               │
└──────┬──────────────────────────┘
       │
       │ 2. POST /api/v1/properties
       ▼
┌─────────────────────────────────┐
│   property.controller.ts         │
│   - Create property in DB       │
│   - Set status to 'pending'     │
│   - Link to seller              │
└──────┬──────────────────────────┘
       │
       │ 3. Property Created
       ▼
┌─────────────────────────────────┐
│   Database (PostgreSQL)         │
│   - Store property record       │
│   - Index for search            │
└─────────────────────────────────┘
```

### Bidding Flow

```
┌─────────────┐
│   Buyer     │
└──────┬──────┘
       │
       │ 1. View Property Details
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Display property info       │
│   - Show bid form               │
└──────┬──────────────────────────┘
       │
       │ 2. Submit Bid
       ▼
┌─────────────────────────────────┐
│   bid.controller.ts             │
│   - Create bid record           │
│   - Notify seller               │
└──────┬──────────────────────────┘
       │
       │ 3. Bid Created
       ▼
┌─────────────────────────────────┐
│   Database                     │
│   - Store bid                  │
│   - Update property stats       │
└──────┬──────────────────────────┘
       │
       │ 4. Seller Reviews Bid
       ▼
┌─────────────────────────────────┐
│   Seller Dashboard             │
│   - Accept/Reject/Counter       │
└──────┬──────────────────────────┘
       │
       │ 5. If Accepted → Create Contract
       ▼
┌─────────────────────────────────┐
│   contract.controller.ts        │
│   - Create contract record      │
│   - Link to bid                 │
└─────────────────────────────────┘
```

### Payment Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Initiate Payment (subscription/listing fee)
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Call Razorpay checkout      │
└──────┬──────────────────────────┘
       │
       │ 2. POST /api/v1/payments/create
       ▼
┌─────────────────────────────────┐
│   payment.controller.ts         │
│   - Create payment record       │
│   - Generate Razorpay order ID  │
└──────┬──────────────────────────┘
       │
       │ 3. Razorpay Order ID
       ▼
┌─────────────────────────────────┐
│   Razorpay Checkout             │
│   - User completes payment      │
└──────┬──────────────────────────┘
       │
       │ 4. Payment Success Callback
       ▼
┌─────────────────────────────────┐
│   POST /api/v1/payments/verify  │
│   - Verify Razorpay signature   │
│   - Update payment status       │
│   - Activate subscription       │
└─────────────────────────────────┘
```

---

## Frontend Processing

### Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── (public)/          # Public pages
│   ├── api/               # API routes (if any)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── home/             # Home page components
│   ├── kyc/              # KYC components
│   └── ...
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   ├── PaymentContext.tsx # Payment state
│   ├── ModalContext.tsx  # Modal state
│   └── SocketContext.tsx # Socket.IO state
├── lib/                  # Utilities
│   ├── api.ts            # API client
│   ├── backendApi.ts     # Backend API client
│   └── config/           # Configuration
└── types/                # TypeScript types
```

### Key Components

#### Authentication Context ([`AuthContext.tsx`](gharbazaar.in/frontend/src/contexts/AuthContext.tsx))

- Manages user authentication state
- Handles login/logout
- Stores JWT token in localStorage
- Provides user data to child components

#### Payment Context ([`PaymentContext.tsx`](gharbazaar.in/frontend/src/contexts/PaymentContext.tsx))

- Manages payment state
- Handles Razorpay integration
- Tracks subscription status
- Provides plan features access

#### Socket Context ([`SocketContext.tsx`](gharbazaar.in/frontend/src/contexts/SocketContext.tsx))

- Manages Socket.IO connection
- Handles real-time events
- Provides socket instance to components

### API Client

The frontend uses two API clients:

1. **[`api.ts`](gharbazaar.in/frontend/src/lib/api.ts)** - Legacy API client
   - `authApi` - Authentication endpoints
   - `userApi` - User management
   - `propertyApi` - Property operations
   - `bidApi` - Bidding operations
   - `favoriteApi` - Favorites
   - `chatApi` - Chat operations
   - `notificationApi` - Notifications

2. **[`backendApi.ts`](gharbazaar.in/frontend/src/lib/backendApi.ts)** - New backend API client
   - `auth` - Authentication (with Google OAuth)
   - `user` - User profile management
   - `properties` - Property CRUD operations
   - `kyc` - KYC verification
   - Enhanced error handling

### Page Routes

| Route                   | Purpose             | Key Features                            |
| ----------------------- | ------------------- | --------------------------------------- |
| `/`                     | Home page           | Featured listings, search, hero section |
| `/listings`             | Property listings   | Search, filters, property cards         |
| `/listings/[id]`        | Property details    | Full property info, bidding, contact    |
| `/dashboard`            | User dashboard      | Overview, stats, quick actions          |
| `/dashboard/properties` | My properties       | Manage listings, view stats             |
| `/dashboard/bids`       | My bids             | View sent/received bids                 |
| `/dashboard/contracts`  | My contracts        | View and sign contracts                 |
| `/dashboard/kyc`        | KYC verification    | Submit KYC documents                    |
| `/dashboard/tickets`    | Support tickets     | Create and manage tickets               |
| `/employee/kyc`         | Employee KYC review | Review KYC requests                     |
| `/services`             | Service providers   | Browse service providers                |

---

## Data Flow

### User Registration Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Fill Registration Form
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Validate form               │
│   - Call backendApi.auth.register│
└──────┬──────────────────────────┘
       │
       │ 2. POST /api/v1/auth/signup
       ▼
┌─────────────────────────────────┐
│   auth.controller.ts            │
│   - Check if user exists        │
│   - Hash password (bcrypt)      │
│   - Generate custom IDs         │
│   - Create user in DB           │
│   - Generate JWT token          │
└──────┬──────────────────────────┘
       │
       │ 3. User Created + JWT Token
       ▼
┌─────────────────────────────────┐
│   Database (PostgreSQL)         │
│   - User record                 │
│   - BuyerProfile/SellerProfile  │
└─────────────────────────────────┘
       │
       │ 4. Token stored in localStorage
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Update AuthContext          │
│   - Redirect to dashboard       │
└─────────────────────────────────┘
```

### Property Search Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Enter Search Criteria
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Build query params          │
│   - Call propertyApi.list()     │
└──────┬──────────────────────────┘
       │
       │ 2. GET /api/v1/properties?city=...&type=...
       ▼
┌─────────────────────────────────┐
│   property.controller.ts        │
│   - Build Prisma query          │
│   - Apply filters               │
│   - Execute search              │
└──────┬──────────────────────────┘
       │
       │ 3. Query Results
       ▼
┌─────────────────────────────────┐
│   Database (PostgreSQL)         │
│   - Execute SELECT query        │
│   - Use indexes for performance │
└──────┬──────────────────────────┘
       │
       │ 4. Property Array
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Display property cards      │
│   - Update state                │
└─────────────────────────────────┘
```

### Real-time Chat Flow

```
┌─────────────┐
│   User A    │
└──────┬──────┘
       │
       │ 1. Send Message
       ▼
┌─────────────────────────────────┐
│   Frontend                     │
│   - Emit 'send_message' event   │
│   - Via Socket.IO               │
└──────┬──────────────────────────┘
       │
       │ 2. WebSocket Message
       ▼
┌─────────────────────────────────┐
│   Socket.IO Server              │
│   - Receive event               │
│   - Save to database            │
│   - Emit to room                │
└──────┬──────────────────────────┘
       │
       │ 3. Message Saved
       ▼
┌─────────────────────────────────┐
│   Database (PostgreSQL)         │
│   - Message record              │
│   - Update conversation         │
└──────┬──────────────────────────┘
       │
       │ 4. Broadcast to Room
       ▼
┌─────────────────────────────────┐
│   User B (Receiver)             │
│   - Receive 'new_message' event │
│   - Update UI                   │
└─────────────────────────────────┘
```

---

## API Endpoints

### Authentication

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/v1/auth/signup`          | Register new user         |
| POST   | `/api/v1/auth/login`           | Login with email/password |
| POST   | `/api/v1/auth/google`          | Google OAuth login        |
| POST   | `/api/v1/auth/forgot-password` | Request password reset    |
| POST   | `/api/v1/auth/reset-password`  | Reset password with token |
| POST   | `/api/v1/auth/logout`          | Logout user               |

### Users

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/v1/users/profile` | Get user profile    |
| PUT    | `/api/v1/users/profile` | Update user profile |
| GET    | `/api/v1/users/stats`   | Get user statistics |
| POST   | `/api/v1/users/avatar`  | Upload avatar       |

### Properties

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/v1/properties`          | Search properties     |
| GET    | `/api/v1/properties/:id`      | Get property by ID    |
| POST   | `/api/v1/properties`          | Create property       |
| PUT    | `/api/v1/properties/:id`      | Update property       |
| DELETE | `/api/v1/properties/:id`      | Delete property       |
| GET    | `/api/v1/properties/user/me`  | Get my properties     |
| POST   | `/api/v1/properties/:id/view` | Track property view   |
| POST   | `/api/v1/properties/upload`   | Upload property image |

### Bids

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/v1/bids`              | Place bid                 |
| GET    | `/api/v1/bids/property/:id` | Get bids for property     |
| GET    | `/api/v1/bids/my`           | Get my bids               |
| GET    | `/api/v1/bids/received`     | Get bids on my properties |
| PUT    | `/api/v1/bids/:id/accept`   | Accept bid                |
| PUT    | `/api/v1/bids/:id/reject`   | Reject bid                |
| PUT    | `/api/v1/bids/:id/withdraw` | Withdraw bid              |

### Payments

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | `/api/v1/payments/create`  | Create payment order |
| POST   | `/api/v1/payments/verify`  | Verify payment       |
| GET    | `/api/v1/payments`         | List payments        |
| POST   | `/api/v1/payments/webhook` | Razorpay webhook     |

### Chat

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/v1/chat/conversations` | Get conversations   |
| GET    | `/api/v1/chat/:id/messages`  | Get messages        |
| POST   | `/api/v1/chat/:id/messages`  | Send message        |
| POST   | `/api/v1/chat/conversations` | Create conversation |
| PUT    | `/api/v1/chat/:id/read`      | Mark as read        |

### KYC

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| POST   | `/api/v1/kyc/submit`     | Submit KYC request |
| GET    | `/api/v1/kyc/requests`   | Get KYC requests   |
| POST   | `/api/v1/kyc/:id/review` | Review KYC request |
| GET    | `/api/v1/kyc/status`     | Get my KYC status  |

### Plans

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/v1/plans`     | Get all plans          |
| GET    | `/api/v1/user/plan` | Get user's active plan |

---

## Real-time Features

### Socket.IO Implementation

The backend uses Socket.IO for real-time communication:

**Server Setup** ([`socket/index.ts`](gharbazaar.in/backend/src/socket/index.ts))

```typescript
- CORS configuration
- Authentication middleware
- Connection handling
- Event handlers (currently commented out)
```

**Available Handlers** (commented out but available):

- `chat.handler.ts` - Real-time messaging
- `ticket.handler.ts` - Support ticket updates
- `presence.handler.ts` - User presence tracking
- `agent.handler.ts` - Agent notifications
- `notification.handler.ts` - Push notifications

**Presence Tracking**

- Online/offline status
- Last seen timestamp
- Socket ID mapping

---

## Security & Authentication

### Authentication Methods

1. **Email/Password**
   - Password hashing with bcrypt
   - JWT token generation
   - Token expiration handling

2. **Google OAuth2**
   - OAuth2 client integration
   - Token verification
   - Automatic user creation

### JWT Token Structure

```typescript
{
  userId: string (User.uid)
  email: string
  name: string
  role: string
  iat: number (issued at)
  exp: number (expiration)
}
```

### Middleware Security

1. **Auth Middleware** - Verifies JWT tokens
2. **Role Guard** - Enforces role-based access
3. **Plan Guard** - Enforces subscription limits
4. **Rate Limiter** - Prevents abuse
5. **Audit Middleware** - Logs all requests

### CORS Configuration

```
Allowed Origins:
- http://localhost:3000 (development)
- Production URLs (configured in env)
```

---

## File Storage

### Upload Handling

**Supported File Types**:

- Images (JPEG, PNG, WebP)
- Documents (PDF)
- Videos (MP4)

**Storage Locations**:

- `/uploads` directory (local)
- Cloud storage (configurable)

**Upload Endpoints**:

- `/api/v1/properties/upload` - Property images
- `/api/v1/users/avatar` - User avatars

---

## Error Handling

### Backend Error Handling

1. **Try-Catch Blocks** - All controller methods wrapped
2. **Error Logging** - Structured error logging
3. **User-Friendly Messages** - Generic errors for users
4. **Development Details** - Detailed errors in dev mode

### Frontend Error Handling

1. **API Error Handling** - Centralized in `backendApi.ts`
2. **Toast Notifications** - User feedback
3. **Error Boundaries** - React error boundaries
4. **Logging** - Frontend error logging to backend

---

## Performance Optimizations

### Database Indexes

All major tables have indexes on:

- Foreign keys
- Frequently queried fields
- Status fields
- Date fields

### Caching

- In-memory caching for frequently accessed data
- Socket.IO room-based broadcasting

### Rate Limiting

- 1000 requests per window
- Configurable timeout

---

## Deployment

### Environment Variables

**Backend** (`.env`):

```
DATABASE_URL=postgresql://...
PORT=5001
NODE_ENV=production
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
ADMIN_EMAILS=admin@example.com
```

**Frontend** (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

### Production Deployment

**Backend**:

- Node.js server
- PostgreSQL database
- Socket.IO for real-time

**Frontend**:

- Next.js static export or server
- Vercel/Netlify compatible

---

## Summary

### What is Stored in Database

1. **Users & Profiles** - User accounts, profiles, KYC data
2. **Properties** - Real estate listings with media
3. **Bids & Contracts** - Bidding history and legal contracts
4. **Payments & Subscriptions** - Transaction records and plans
5. **Chat & Messages** - Real-time communication
6. **Notifications** - User notifications
7. **Tickets** - Support tickets
8. **Attendance & Salaries** - Employee management
9. **Analytics** - Usage tracking
10. **Audit Logs** - API request logging

### What Backend Does

1. **API Server** - RESTful API endpoints
2. **Authentication** - JWT and OAuth2
3. **Business Logic** - Property, bid, contract processing
4. **Real-time** - Socket.IO server
5. **File Upload** - Image/document handling
6. **Payment Processing** - Razorpay integration
7. **Email Service** - SMTP notifications
8. **Data Validation** - Input validation and sanitization

### What Frontend Does

1. **User Interface** - React components and pages
2. **State Management** - Context API for global state
3. **API Client** - HTTP requests to backend
4. **Real-time Client** - Socket.IO client
5. **Routing** - Next.js App Router
6. **Form Handling** - Form validation and submission
7. **Payment UI** - Razorpay checkout integration

---

## Conclusion

GharBazaar is a full-stack real estate platform with:

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Express.js with Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **Real-time**: Socket.IO for live features
- **Payments**: Razorpay integration
- **Authentication**: JWT + Google OAuth2

The platform handles the complete property lifecycle from listing to contract signing, with robust user management, payment processing, and real-time communication features.
