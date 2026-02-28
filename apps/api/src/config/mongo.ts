import mongoose from "mongoose";

import { env } from "./env";

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  isConnected = true;
  console.info("[mongo] Connected to MongoDB");
};
