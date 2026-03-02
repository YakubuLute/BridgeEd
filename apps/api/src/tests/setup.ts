process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.PORT = process.env.PORT ?? "4001";
process.env.MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/bridgeed_test";
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "test-gemini-key";
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? "test-secret-key-that-is-at-least-thirty-two-characters";
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
