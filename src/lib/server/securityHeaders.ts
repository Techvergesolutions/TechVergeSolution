/** Security headers applied on Vercel (vercel.json) and API responses. */
export const SECURITY_HEADER_ENTRIES = [
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
] as const;

export function securityHeadersRecord(): Record<string, string> {
  return Object.fromEntries(SECURITY_HEADER_ENTRIES);
}

export function mergeSecurityHeaders(
  headers?: HeadersInit,
): Record<string, string> {
  const base = securityHeadersRecord();
  if (!headers) return base;
  if (headers instanceof Headers) {
    const out = { ...base };
    headers.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }
  if (Array.isArray(headers)) {
    return { ...base, ...Object.fromEntries(headers) };
  }
  return { ...base, ...headers };
}

type HeaderWritable = { setHeader: (name: string, value: string) => void };

export function setSecurityHeaders(response: HeaderWritable): void {
  for (const [name, value] of SECURITY_HEADER_ENTRIES) {
    response.setHeader(name, value);
  }
}
