import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSslCommerzRedirectData,
  resolvePaymentProvider,
} from "./payment.service";

test("resolvePaymentProvider prefers an explicit provider", () => {
  assert.equal(resolvePaymentProvider("sslcommerz"), "sslcommerz");
  assert.equal(resolvePaymentProvider("stripe"), "stripe");
});

test("buildSslCommerzRedirectData produces a gateway payload", () => {
  const result = buildSslCommerzRedirectData({
    bookingId: "booking_123",
    customerId: "customer_123",
    transactionId: "txn_123",
    amount: "150",
    bookingNumber: "BK-1001",
  });

  assert.equal(result.provider, "sslcommerz");
  assert.equal(result.transactionId, "txn_123");
  assert.match(result.redirectUrl, /sslcommerz/i);
});
