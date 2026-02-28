/**
 * Prisma stub – PostgreSQL has been removed.
 * All Prisma calls are replaced by in-memory mocks so the server
 * continues to start without a real database.
 */

// ─────────────────────────────────────────────────────────────
// In-memory user store
// ─────────────────────────────────────────────────────────────
const DEMO_USERS: any[] = [
  {
    id: 1,
    uid: 'admin-001',
    email: 'admin@gharbazaar.in',
    name: 'Demo Admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    googleId: null,
    buyerClientId: 'gbclient-admin',
    sellerClientId: 'gbclient-admin-s',
    onboardingCompleted: true,
    serviceProviderProfile: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
  {
    id: 2,
    uid: 'emp-001',
    email: 'employee@gharbazaar.in',
    name: 'Demo Employee',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'employee',
    googleId: null,
    buyerClientId: 'gbclient-emp',
    sellerClientId: 'gbclient-emp-s',
    onboardingCompleted: true,
    serviceProviderProfile: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
  {
    id: 3,
    uid: 'sp-001',
    email: 'service@gharbazaar.in',
    name: 'Demo Service Partner',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'service_partner',
    googleId: null,
    buyerClientId: 'gbclient-sp',
    sellerClientId: 'gbclient-sp-s',
    onboardingCompleted: true,
    serviceProviderProfile: { id: 1 },
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
  {
    id: 4,
    uid: 'gp-001',
    email: 'ground@gharbazaar.in',
    name: 'Demo Ground Partner',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'ground_partner',
    googleId: null,
    buyerClientId: 'gbclient-gp',
    sellerClientId: 'gbclient-gp-s',
    onboardingCompleted: true,
    serviceProviderProfile: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
  {
    id: 5,
    uid: 'pp-001',
    email: 'promoter@gharbazaar.in',
    name: 'Demo Promoter Partner',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'promoter_partner',
    googleId: null,
    buyerClientId: 'gbclient-pp',
    sellerClientId: 'gbclient-pp-s',
    onboardingCompleted: true,
    serviceProviderProfile: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
  {
    id: 6,
    uid: 'lp-001',
    email: 'legal@gharbazaar.in',
    name: 'Demo Legal Partner',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'legal_partner',
    googleId: null,
    buyerClientId: 'gbclient-lp',
    sellerClientId: 'gbclient-lp-s',
    onboardingCompleted: true,
    serviceProviderProfile: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
  {
    id: 7,
    uid: 'buyer-001',
    email: 'user@gharbazaar.in',
    name: 'Demo User',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'buyer',
    googleId: null,
    buyerClientId: 'gbclient-buyer',
    sellerClientId: 'gbclient-buyer-s',
    onboardingCompleted: true,
    serviceProviderProfile: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  },
];

let nextId = DEMO_USERS.length + 1;

// ─────────────────────────────────────────────────────────────
// Mock Prisma client (only the methods used by auth.controller)
// ─────────────────────────────────────────────────────────────
const userModel = {
  findUnique: async ({ where, include }: any) => {
    let user = null;
    if (where.email) user = DEMO_USERS.find(u => u.email === where.email) || null;
    else if (where.uid) user = DEMO_USERS.find(u => u.uid === where.uid) || null;
    else if (where.id) user = DEMO_USERS.find(u => u.id === where.id) || null;
    if (!user) return null;
    return { ...user };
  },
  findFirst: async ({ where }: any = {}) => {
    if (!where) return DEMO_USERS[0] ? { ...DEMO_USERS[0] } : null;
    let user = DEMO_USERS.find(u => {
      if (where.resetPasswordToken && u.resetPasswordToken !== where.resetPasswordToken) return false;
      if (where.resetPasswordExpires?.gt && u.resetPasswordExpires && u.resetPasswordExpires < where.resetPasswordExpires.gt) return false;
      return true;
    }) || null;
    return user ? { ...user } : null;
  },
  findMany: async ({ where }: any = {}) => DEMO_USERS.map(u => ({ ...u })),
  create: async ({ data }: any) => {
    const newUser = { id: nextId++, serviceProviderProfile: null, ...data };
    DEMO_USERS.push(newUser);
    return { ...newUser };
  },
  update: async ({ where, data }: any) => {
    const idx = where.id != null
      ? DEMO_USERS.findIndex(u => u.id === where.id)
      : where.email
      ? DEMO_USERS.findIndex(u => u.email === where.email)
      : -1;
    if (idx < 0) throw new Error('User not found');
    Object.assign(DEMO_USERS[idx], data);
    return { ...DEMO_USERS[idx] };
  },
  upsert: async ({ where, update, create }: any) => {
    const idx = DEMO_USERS.findIndex(u => u.email === where.email);
    if (idx >= 0) {
      Object.assign(DEMO_USERS[idx], update);
      return { ...DEMO_USERS[idx] };
    }
    const newUser = { id: nextId++, serviceProviderProfile: null, ...create };
    DEMO_USERS.push(newUser);
    return { ...newUser };
  },
  delete: async ({ where }: any) => {
    const idx = DEMO_USERS.findIndex(u => u.id === where.id);
    if (idx >= 0) DEMO_USERS.splice(idx, 1);
  },
  count: async () => DEMO_USERS.length,
};

// Minimal mock for other models avoiding crashes
const noopModel = {
  findUnique: async () => null,
  findFirst: async () => null,
  findMany: async () => [],
  create: async ({ data }: any) => data,
  update: async ({ data }: any) => data,
  upsert: async ({ create }: any) => create,
  delete: async () => null,
  count: async () => 0,
};

export const prisma: any = {
  user: userModel,
  buyerProfile: noopModel,
  sellerProfile: noopModel,
  employeeProfile: noopModel,
  serviceProviderProfile: noopModel,
  property: noopModel,
  notification: noopModel,
  chatMessage: noopModel,
  chatRoom: noopModel,
  ticket: noopModel,
  payment: noopModel,
  plan: noopModel,
  $transaction: async (callback: any) => callback(prisma),
  $disconnect: async () => {},
  $connect: async () => {},
};

export default prisma;
