import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();
dotenv.config({ path: ".env.example", override: false });

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  OTP_EXPIRY_SECONDS: z.coerce.number().int().min(30).default(300),
  AUTH_SESSION_TTL_MINUTES: z.coerce.number().int().min(5).default(60),
  PASSWORD_RESET_TOKEN_TTL_MINUTES: z.coerce.number().int().min(5).default(60),
  AUTH_MAX_LOGIN_ATTEMPTS: z.coerce.number().int().min(1).default(3),
  AUTH_LOCKOUT_MINUTES: z.coerce.number().int().min(1).default(15),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(60_000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(20)
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env = parsed.data;
