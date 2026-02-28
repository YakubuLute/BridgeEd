import express from "express";
import cors from "cors";
import helmet from "helmet";
import { API_VERSION } from "@bridgeed/shared";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import v1Routes from "./routes/v1";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(`/api/${API_VERSION}`, v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);
