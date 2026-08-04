import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import express from "express";
import { z } from "zod";

import { validateRequest } from "./validateRequest";

test("validateRequest can safely assign parsed query data", async () => {
  const app = express();

  app.get(
    "/test",
    validateRequest(z.object({ page: z.coerce.number() }), "query"),
    (req, res) => {
      res.json({ ok: true, query: req.query });
    },
  );

  const server = app.listen(0);
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Server did not bind to a TCP port");
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:${address.port}/test?page=2`,
    );
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.deepEqual(payload, {
      ok: true,
      query: { page: 2 },
    });
  } finally {
    server.close();
    await once(server, "close");
  }
});
