import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function getSecretKey() {
  return new TextEncoder().encode(ENV.cookieSecret);
}

export async function signJwt(payload: {
  userId: number;
  openId: string;
  role: string;
}): Promise<string> {
  const issuedAt = Date.now();
  const expiresInMs = ONE_YEAR_MS;
  const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
  const secretKey = getSecretKey();

  return new SignJWT({
    openId: payload.openId,
    appId: ENV.appId,
    name: payload.openId, // required by SDK verifySession
    userId: payload.userId,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

export async function verifyJwt(token: string) {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
    return payload as { openId: string; appId: string; name: string; userId?: number; role?: string };
  } catch {
    return null;
  }
}
