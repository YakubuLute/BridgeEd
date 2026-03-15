import mongoose from "mongoose";
import { createServer } from "http";

import { app } from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./config/mongo";
import { bootstrapSeedData } from "./services/bootstrap/bootstrap.service";
import { initSocket } from "./services/socket.service";

const start = async (): Promise<void> => {
  await connectToDatabase();
  await bootstrapSeedData();

  const httpServer = createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.info(`[api] BridgeEd API running on http://localhost:${env.PORT}`);
  });
};

void start().catch((error) => {
  console.error("[api] Startup failed", error);
  void mongoose.disconnect();
  process.exit(1);
});
