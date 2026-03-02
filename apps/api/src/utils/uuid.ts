import crypto from "node:crypto";

const toHex = (value: number): string => value.toString(16).padStart(2, "0");

export const createUuidV7 = (): string => {
  const now = BigInt(Date.now());
  const random = crypto.randomBytes(10);
  const randomByte = (index: number): number => random[index] ?? 0;
  const bytes = new Uint8Array(16);

  bytes[0] = Number((now >> 40n) & 0xffn);
  bytes[1] = Number((now >> 32n) & 0xffn);
  bytes[2] = Number((now >> 24n) & 0xffn);
  bytes[3] = Number((now >> 16n) & 0xffn);
  bytes[4] = Number((now >> 8n) & 0xffn);
  bytes[5] = Number(now & 0xffn);
  bytes[6] = 0x70 | (randomByte(0) & 0x0f);
  bytes[7] = randomByte(1);
  bytes[8] = 0x80 | (randomByte(2) & 0x3f);
  bytes[9] = randomByte(3);
  bytes[10] = randomByte(4);
  bytes[11] = randomByte(5);
  bytes[12] = randomByte(6);
  bytes[13] = randomByte(7);
  bytes[14] = randomByte(8);
  bytes[15] = randomByte(9);

  const hex = Array.from(bytes, toHex).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join("-");
};
