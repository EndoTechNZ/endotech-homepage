const applicationToEmail = 'steveshepherdnz@gmail.com';
const applicationFromEmail =
  process.env.NZ_ACCOUNT_APPLICATION_FROM_EMAIL || process.env.NZ_ORDER_FROM_EMAIL || process.env.PUBLIC_CONTACT_EMAIL;
const resendApiKey = process.env.RESEND_API_KEY;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const safe = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const sendEmail = async ({ subject, html, text }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: applicationFromEmail,
      to: [applicationToEmail],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Email delivery failed: ${payload}`);
  }

  return response.json();
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  if (!resendApiKey) return json(500, { error: 'RESEND_API_KEY is not configured for NZ account applications.' });
  if (!applicationFromEmail) {
    return json(500, {
      error: 'NZ_ACCOUNT_APPLICATION_FROM_EMAIL, NZ_ORDER_FROM_EMAIL, or PUBLIC_CONTACT_EMAIL is required for NZ account applications.',
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON payload.' });
  }

  const required = ['contact_name', 'role', 'email', 'phone', 'organisation', 'application_type', 'region', 'address', 'account_reason'];
  for (const field of required) {
    if (!String(payload[field] || '').trim()) return json(400, { error: `${field} is required.` });
  }

  const products = Array.isArray(payload.product_interest) ? payload.product_interest : [];
  const subject = `EndoTech NZ account application - ${payload.organisation}`;
  const text = [
    'A new EndoTech NZ account application has been submitted.',
    '',
    `Contact name: ${payload.contact_name}`,
    `Role / position: ${payload.role}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    '',
    `Organisation: ${payload.organisation}`,
    `Application type: ${payload.application_type}`,
    `Country / region: ${payload.region}`,
    `Website/profile: ${payload.website || '-'}`,
    `Address: ${payload.address}`,
    '',
    'Product families of interest:',
    ...(products.length ? products.map((product) => `- ${product}`) : ['- Not specified']),
    '',
    'Reason for account request:',
    payload.account_reason,
    '',
    'Expected ordering or support needs:',
    payload.expected_needs || '-',
    '',
    'Confirmations:',
    `Professional organisation: ${payload.professional_confirmation || '-'}`,
    `Further documentation understood: ${payload.documentation_review || '-'}`,
    `No login created automatically: ${payload.no_login_confirmation || '-'}`,
  ].join('\n');

  const html = `
    <p>A new <strong>EndoTech NZ</strong> account application has been submitted.</p>
    <p><strong>Contact name:</strong> ${safe(payload.contact_name)}<br />
    <strong>Role / position:</strong> ${safe(payload.role)}<br />
    <strong>Email:</strong> ${safe(payload.email)}<br />
    <strong>Phone:</strong> ${safe(payload.phone)}</p>
    <p><strong>Organisation:</strong> ${safe(payload.organisation)}<br />
    <strong>Application type:</strong> ${safe(payload.application_type)}<br />
    <strong>Country / region:</strong> ${safe(payload.region)}<br />
    <strong>Website/profile:</strong> ${safe(payload.website || '-')}<br />
    <strong>Address:</strong><br />${safe(payload.address).replace(/\n/g, '<br />')}</p>
    <p><strong>Product families of interest:</strong></p>
    <ul>${(products.length ? products : ['Not specified']).map((product) => `<li>${safe(product)}</li>`).join('')}</ul>
    <p><strong>Reason for account request:</strong><br />${safe(payload.account_reason).replace(/\n/g, '<br />')}</p>
    <p><strong>Expected ordering or support needs:</strong><br />${safe(payload.expected_needs || '-').replace(/\n/g, '<br />')}</p>
    <p><strong>Confirmations:</strong><br />
    Professional organisation: ${safe(payload.professional_confirmation || '-')}<br />
    Further documentation understood: ${safe(payload.documentation_review || '-')}<br />
    No login created automatically: ${safe(payload.no_login_confirmation || '-')}</p>
  `;

  try {
    await sendEmail({ subject, html, text });
    return json(200, { ok: true });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'The NZ account application email failed to send.' });
  }
};
