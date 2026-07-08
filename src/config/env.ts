import "dotenv/config";

const requireEnv = (value: string | undefined, name: string): string => {
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: requireEnv(process.env.DATABASE_URL, "DATABASE_URL"),
  jwtSecret: requireEnv(process.env.JWT_SECRET, "JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  frontendUrl: process.env.FRONTEND_URL ?? "*",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
};
