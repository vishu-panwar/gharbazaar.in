const GENERIC_CLIENT_ROLES = new Set(['', 'buyer', 'seller', 'client', 'user']);

const SERVICE_PARTNER_ROLES = new Set([
  'service_partner',
  'service_partners',
  'service_provider',
]);

const LEGAL_PARTNER_ROLES = new Set([
  'legal_partner',
  'legal_partners',
]);

const EMPLOYEE_ROLES = new Set(['employee']);
const GROUND_PARTNER_ROLES = new Set(['ground_partner', 'ground-partner']);
const PROMOTER_PARTNER_ROLES = new Set([
  'promoter_partner',
  'promo_partner',
  'partner',
  'promotional_partner',
  'promotional-partner',
]);
const ADMIN_ROLES = new Set(['admin']);

export function normalizeRole(value?: string | null): string {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[-\s]+/g, '_');
}

export function resolveEffectiveRole(role?: string | null, requestedRole?: string | null): string {
  const normalizedRole = normalizeRole(role);
  const normalizedRequestedRole = normalizeRole(requestedRole);

  if (normalizedRequestedRole && GENERIC_CLIENT_ROLES.has(normalizedRole)) {
    return normalizedRequestedRole;
  }

  return normalizedRole || normalizedRequestedRole;
}

export function isLegalPartnerRole(role?: string | null): boolean {
  return LEGAL_PARTNER_ROLES.has(normalizeRole(role));
}

export function isServicePartnerRole(role?: string | null): boolean {
  return SERVICE_PARTNER_ROLES.has(normalizeRole(role));
}

export function isServiceOrLegalPartnerRole(role?: string | null): boolean {
  return isServicePartnerRole(role) || isLegalPartnerRole(role);
}

export function isEmployeeRole(role?: string | null): boolean {
  return EMPLOYEE_ROLES.has(normalizeRole(role));
}

export function isGroundPartnerRole(role?: string | null): boolean {
  return GROUND_PARTNER_ROLES.has(normalizeRole(role));
}

export function isPromoterPartnerRole(role?: string | null): boolean {
  return PROMOTER_PARTNER_ROLES.has(normalizeRole(role));
}

export function isAdminRole(role?: string | null): boolean {
  return ADMIN_ROLES.has(normalizeRole(role));
}
