const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const zeusPriceId       = process.env.STRIPE_PRICE_ZEUS;
const aphroditePriceId  = process.env.STRIPE_PRICE_APHRODITE;
const lifespherePriceId = process.env.STRIPE_PRICE_LIFESPHERE;

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 60 seconds

exports.handler = async () => {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) {
    return { statusCode: 200, body: JSON.stringify(cache) };
  }

  try {
    const [zeus, aphrodite, lifesphere] = await Promise.all([
      countActive(zeusPriceId),
      countActive(aphroditePriceId),
      countActive(lifespherePriceId),
    ]);

    const result = {
      ok: true,
      counts: {
        zeus,
        aphrodite,
        lifesphere,
        total: zeus + aphrodite + lifesphere,
      },
      cached_at: new Date().toISOString(),
    };

    cache = result;
    cacheTime = now;

    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};

async function countActive(priceId) {
  if (!priceId) return 0;
  const subs = await stripe.subscriptions.list({
    price: priceId,
    status: "active",
    limit: 100,
  });
  return subs.data.length;
}
