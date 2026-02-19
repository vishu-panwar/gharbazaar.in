const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:5000/api/v1';

function randomId() {
  return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

function getToken(payload) {
  return payload?.data?.token || payload?.token || payload?.access_token || null;
}

async function parseResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

function ensureSuccess(response, payload, context) {
  if (!response.ok || payload?.success === false) {
    const detail = JSON.stringify(payload);
    throw new Error(`${context} failed (HTTP ${response.status}): ${detail}`);
  }
}

async function requestJson(path, method, body, token) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await parseResponse(response);
  ensureSuccess(response, payload, `${method} ${path}`);
  return payload;
}

async function requestMultipart(path, formData, token) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  const payload = await parseResponse(response);
  ensureSuccess(response, payload, `POST ${path}`);
  return payload;
}

async function requestGet(path, token) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const payload = await parseResponse(response);
  ensureSuccess(response, payload, `GET ${path}`);
  return payload;
}

async function main() {
  const runId = randomId();
  const partnerEmail = `smoke.partner.${runId}@example.com`;
  const employeeEmail = `smoke.employee.${runId}@example.com`;
  const password = 'SmokeTest@123';

  const tinyPngBytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO3fS6kAAAAASUVORK5CYII=',
    'base64'
  );

  console.log(`\n[1/8] Register service partner: ${partnerEmail}`);
  const partnerSignup = await requestJson(
    '/auth/signup',
    'POST',
    {
      email: partnerEmail,
      password,
      displayName: 'Smoke Service Partner',
      role: 'service_partner',
    }
  );
  const partnerToken = getToken(partnerSignup);
  if (!partnerToken) throw new Error('Missing partner token after signup');

  console.log(`[2/8] Submit KYC with images`);
  const kycForm = new FormData();
  kycForm.append('fullName', 'Smoke Service Partner');
  kycForm.append('contactNumber', '9999999999');
  kycForm.append('address', 'Smoke Test Street, Kolkata');
  kycForm.append('aadharNumber', `99998888${String(runId).slice(-4)}`);
  kycForm.append('profileImage', new Blob([tinyPngBytes], { type: 'image/png' }), 'profile.png');
  kycForm.append('aadharImage', new Blob([tinyPngBytes], { type: 'image/png' }), 'aadhar.png');
  await requestMultipart('/kyc/submit', kycForm, partnerToken);

  console.log(`[3/8] Verify KYC status is pending`);
  const pendingStatus = await requestGet('/kyc/status', partnerToken);
  const pendingData = pendingStatus?.data || {};
  if (!(pendingData?.status === 'pending' && pendingData?.request?.id)) {
    throw new Error(`Expected pending KYC with request id, got: ${JSON.stringify(pendingData)}`);
  }

  console.log(`[4/8] Register employee reviewer: ${employeeEmail}`);
  const employeeSignup = await requestJson(
    '/auth/signup',
    'POST',
    {
      email: employeeEmail,
      password,
      displayName: 'Smoke Employee',
      role: 'employee',
    }
  );
  const employeeToken = getToken(employeeSignup);
  if (!employeeToken) throw new Error('Missing employee token after signup');

  console.log('[5/8] Employee fetches KYC requests and finds the partner request');
  const requests = await requestGet('/kyc/requests', employeeToken);
  const requestList = Array.isArray(requests?.data) ? requests.data : [];
  const partnerRequest = requestList.find((r) => r?.user?.email === partnerEmail);
  if (!partnerRequest?.id) {
    throw new Error(`Partner KYC request not found by employee for ${partnerEmail}`);
  }

  console.log('[6/8] Employee approves KYC request');
  await requestJson(
    `/kyc/review/${partnerRequest.id}`,
    'POST',
    {
      status: 'approved',
      reviewComments: 'Approved by smoke test',
    },
    employeeToken
  );

  console.log('[7/8] Partner creates service after approval');
  const createdProvider = await requestJson(
    '/service-providers',
    'POST',
    {
      category: 'lawyer',
      specialization: 'Property Documentation',
      location: 'Kolkata, West Bengal',
      description: 'Smoke test verified service profile',
      hourlyRate: 1200,
      experience: 5,
      skills: ['deed', 'registry', 'title-check'],
      completedProjects: 3,
      reviews: 0,
      rating: 0,
      available: true,
    },
    partnerToken
  );
  const providerId = createdProvider?.data?.id;
  if (!providerId) {
    throw new Error(`Provider creation returned no id: ${JSON.stringify(createdProvider)}`);
  }

  console.log('[8/8] Public providers list includes this approved service');
  const providersList = await requestGet('/service-providers');
  const providers = Array.isArray(providersList?.providers) ? providersList.providers : [];
  const found = providers.find((p) => p?.id === providerId || p?.user?.email === partnerEmail);
  if (!found) {
    throw new Error(`New provider not found in public list. providerId=${providerId}`);
  }

  console.log('\nPASS: End-to-end flow works');
  console.log(JSON.stringify({
    partnerEmail,
    employeeEmail,
    kycRequestId: partnerRequest.id,
    providerId,
    publicListingVerified: true,
  }, null, 2));
}

main().catch((error) => {
  console.error('\nFAIL:', error.message || error);
  process.exit(1);
});
