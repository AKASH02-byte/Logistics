import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

const LOGIN_KEY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

/**
 * Generates a human-typeable Login Key, e.g. "7K4P-92MX-81".
 * Never called with any client input — server-generated only.
 */
export function generateLoginKey(): string {
  const groups = [4, 4, 2];
  const bytes = randomBytes(groups.reduce((a, b) => a + b, 0));
  let cursor = 0;

  return groups
    .map((groupLength) => {
      let group = "";
      for (let i = 0; i < groupLength; i++) {
        group += LOGIN_KEY_ALPHABET[bytes[cursor] % LOGIN_KEY_ALPHABET.length];
        cursor++;
      }
      return group;
    })
    .join("-");
}

/**
 * Generates a Labour ID candidate, e.g. "LAB001". The caller is responsible
 * for retrying on a uniqueness conflict against the `labours` table.
 */
export function formatLabourCode(sequence: number): string {
  return `LAB${String(sequence).padStart(3, "0")}`;
}

export async function hashLoginKey(loginKey: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scryptAsync(loginKey, salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export async function verifyLoginKey(
  loginKey: string,
  storedHash: string
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = storedHash.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scryptAsync(loginKey, salt, expected.length)) as Buffer;

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
