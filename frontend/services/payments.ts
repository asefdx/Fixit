import { request } from "@/lib/api";

type PaymentProvider = "stripe" | "sslcommerz";

type PaymentIntentPayload = {
  bookingId: string;
  provider?: PaymentProvider;
};

type PaymentIntentResponse = {
  payment: {
    id: string;
    bookingId: string;
    customerId: string;
    transactionId?: string | null;
    stripePaymentIntentId?: string | null;
    amount: string | number;
    currency: string;
    provider: string;
    status: string;
    metadata?: Record<string, unknown>;
  };
  provider: PaymentProvider;
  clientSecret?: string | null;
  redirectUrl?: string | null;
};

export const paymentsService = {
  async createIntent(payload: PaymentIntentPayload) {
    const response = await request<PaymentIntentResponse>("/payments/create", {
      method: "POST",
      body: payload,
    });

    return response.data;
  },

  async confirm(paymentIntentId: string) {
    const response = await request<PaymentIntentResponse>("/payments/confirm", {
      method: "POST",
      body: { paymentIntentId },
    });

    return response.data;
  },

  async history() {
    const response = await request<PaymentIntentResponse[]>("/payments", {
      method: "GET",
    });

    return response.data;
  },
};
