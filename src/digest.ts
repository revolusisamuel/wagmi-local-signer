import { createHash } from "node:crypto";

export function digest(input: string | Buffer): Buffer {
  return createHash("sha256").update(input).digest();
}

export function hex(buf: Buffer, n = 32): string {
  return buf.toString("hex").slice(0, n);
}
