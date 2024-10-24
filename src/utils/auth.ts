import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key';
const accesTokenExpires = '1d';
const refreshTokenExpires = '15d';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (payload: TokenPayload): Tokens => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: accesTokenExpires,
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: refreshTokenExpires,
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const refreshAccessToken = (refreshToken: string): string | null => {
  const payload = verifyRefreshToken(refreshToken);
  if (payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: accesTokenExpires });
  }
  return null;
};
