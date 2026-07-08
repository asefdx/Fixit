import Stripe from "stripe";

import { AppError } from "../errors/AppError";
import { env } from "./env";

let stripeClient: Stripe | null = null;

export const getStripeClient = (): Stripe => {
  if (!env.stripeSecretKey) {
    throw new AppError(500, "Stripe is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey);
  }

  return stripeClient;
};
