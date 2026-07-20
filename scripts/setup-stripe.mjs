import Stripe from "stripe";

const APP_METADATA = { app: "betclear" };

const WEBHOOK_URL =
  process.env.STRIPE_WEBHOOK_URL ?? "https://www.betclear.app/api/webhooks/stripe";

const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
];

const PLANS = [
  {
    key: "STRIPE_PRICE_TEST",
    productName: "Test Product",
    description: "Temporary low-cost plan for payment flow testing.",
    unitAmount: 99,
    interval: "month",
    plan: "test",
  },
  {
    key: "STRIPE_PRICE_MONTHLY",
    productName: "BetClear Monthly",
    description: "Monthly iPhone gambling site blocking.",
    unitAmount: 399,
    interval: "month",
    plan: "monthly",
  },
  {
    key: "STRIPE_PRICE_ANNUAL",
    productName: "BetClear Annual",
    description: "Annual iPhone gambling site blocking.",
    unitAmount: 2999,
    interval: "year",
    plan: "annual",
  },
];

async function findExistingPrice(stripe, plan) {
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
    expand: ["data.product"],
  });

  return prices.data.find((price) => {
    const product = price.product;
    if (typeof product === "string") return false;
    if ("deleted" in product && product.deleted) return false;
    return (
      product.metadata?.app === APP_METADATA.app &&
      price.metadata?.plan === plan &&
      price.active
    );
  });
}

async function findExistingWebhook(stripe) {
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  return endpoints.data.find(
    (endpoint) => endpoint.url === WEBHOOK_URL && endpoint.status !== "disabled",
  );
}

async function ensureWebhook(stripe) {
  let endpoint = await findExistingWebhook(stripe);

  if (!endpoint) {
    endpoint = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: WEBHOOK_EVENTS,
      description: "BetClear subscription paywall",
      metadata: APP_METADATA,
    });
    console.log(`Created webhook endpoint: ${endpoint.id}`);
  } else {
    endpoint = await stripe.webhookEndpoints.update(endpoint.id, {
      enabled_events: WEBHOOK_EVENTS,
      disabled: false,
      description: "BetClear subscription paywall",
      metadata: APP_METADATA,
    });
    console.log(`Reusing webhook endpoint: ${endpoint.id}`);
  }

  return endpoint.secret;
}

async function main() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("Set STRIPE_SECRET_KEY before running this script.");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey);
  const mode = secretKey.startsWith("sk_live") ? "live" : "test";

  console.log(`Mode: ${mode}`);
  console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

  const envLines = [];

  for (const plan of PLANS) {
    let price = await findExistingPrice(stripe, plan.plan);

    if (!price) {
      const product = await stripe.products.create({
        name: plan.productName,
        description: plan.description,
        metadata: {
          ...APP_METADATA,
          plan: plan.plan,
        },
      });

      price = await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: plan.unitAmount,
        recurring: { interval: plan.interval },
        metadata: {
          ...APP_METADATA,
          plan: plan.plan,
        },
      });

      console.log(`Created ${plan.plan} price: ${price.id}`);
    } else {
      console.log(`Reusing ${plan.plan} price: ${price.id}`);
    }

    envLines.push(`${plan.key}=${price.id}`);
  }

  const webhookSecret = await ensureWebhook(stripe);
  envLines.push(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);

  console.log("\nAdd these to .env:\n");
  console.log(envLines.join("\n"));
  console.log("\nLocal dev forwarding:");
  console.log("stripe listen --forward-to localhost:3000/api/webhooks/stripe");
  console.log("Use the CLI signing secret locally instead of the dashboard one.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
