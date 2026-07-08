import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerDocument } from "./config/swagger";
import { globalErrorHandler } from "./errors/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import router from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl === "*" ? true : env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFound);
app.use(globalErrorHandler);

export default app;
