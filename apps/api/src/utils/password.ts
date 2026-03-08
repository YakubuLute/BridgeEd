import crypto from "node:crypto";
import { promisify } from "node:util";

const PASSWORD_HASH_ALGORITHM = "scrypt";
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_LENGTH = 64;

const scryptAsync = promisify(crypto.scrypt);

const derivePasswordKey = async (password: string, salt: string, keyLength: number): Promise<Buffer> =>
  (await scryptAsync(password, salt, keyLength)) as Buffer;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const derivedKey = await derivePasswordKey(password, salt, PASSWORD_KEY_LENGTH);

  return `${PASSWORD_HASH_ALGORITHM}:${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password: string, passwordHash: string): Promise<boolean> => {
  const [algorithm, salt, hashedValue] = passwordHash.split(":");
  if (algorithm !== PASSWORD_HASH_ALGORITHM || !salt || !hashedValue) {
    return false;
  }

  const storedHash = Buffer.from(hashedValue, "hex");
  const derivedKey = await derivePasswordKey(password, salt, storedHash.length);
  if (derivedKey.length !== storedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, storedHash);
};
