const crypto = require('crypto');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const params = new URLSearchParams(event.body || '');
  const signedRequest = params.get('signed_request');
  if (!signedRequest) return { statusCode: 400, body: 'Missing signed_request' };
  const [encodedSig, encodedPayload] = signedRequest.split('.');
  const data = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  const APP_SECRET = '20b20216360f441a6de686bb4f1e817a';
  const expectedSig = crypto.createHmac('sha256', APP_SECRET).update(encodedPayload).digest();
  const actualSig = Buffer.from(encodedSig, 'base64url');
  if (actualSig.length !== expectedSig.length || !crypto.timingSafeEqual(actualSig, expectedSig.slice(0, actualSig.length))) return { statusCode: 403, body: 'Invalid signature' };
  const userId = data.user_id;
  const code = crypto.randomBytes(16).toString('hex');
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: `https://kypriatechnologies.org/deletion-status?id=${userId}&code=${code}`, confirmation_code: code }) };
};
