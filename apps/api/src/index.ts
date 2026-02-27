import mongoose from "mongoose";

import { app } from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./config/mongo";

const start = async (): Promise<void> => {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    console.info(`[api] BridgeEd API running on http://localhost:${env.PORT}`);
  });
};

void start().catch((error) => {
  console.error("[api] Startup failed", error);
  void mongoose.disconnect();
  process.exit(1);
});
