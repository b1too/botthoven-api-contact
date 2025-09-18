import * as ipaddr from 'ipaddr.js';

export function ipToBytes(ip?: string): Buffer | null {
  if (!ip) return null;
  try {
    const parsed = ipaddr.parse(ip);
    return Buffer.from(parsed.toByteArray());
  } catch {
    return null;
  }
}
