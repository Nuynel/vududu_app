import jwt, {JwtPayload} from "jsonwebtoken";

const ACCESS_SECRET_KEY = 'abirvalg'
const API_ACCESS_SECRET_KEY = 'HollywoodRedTricolourPitPrait'
const REFRESH_SECRET_KEY = 'ciclopentanoperhidrofenantreno'

enum TOKEN_TYPES { ACCESS = 'ACCESS', API_ACCESS = 'API_ACCESS', REFRESH = 'REFRESH' }

function isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
  return typeof decoded === 'object' && 'userId' in decoded && 'type' in decoded;
}
export const generateAccessToken = (profileId: string | null): string => jwt.sign({ profileId, type: TOKEN_TYPES.ACCESS }, ACCESS_SECRET_KEY, { expiresIn: '10m' });

export const generateAPIAccessToken = (userId: string, profileId: string | null): string => jwt.sign({ userId, profileId, type: TOKEN_TYPES.API_ACCESS }, API_ACCESS_SECRET_KEY, { expiresIn: '10m' });

export const generateRefreshToken = (id: string): string => jwt.sign({ userId: id, type: TOKEN_TYPES.REFRESH }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

const checkJWT = (token: string, key: string, tokenType: TOKEN_TYPES): { userId: string | null, profileId: string | null } => {
  const decoded = jwt.verify(token, key);
  const isTokenValid = isJwtPayload(decoded) && decoded.type === tokenType;
  return isTokenValid ? { userId: decoded.userId, profileId: decoded.profileId } : { userId: null, profileId: null };
};

export const checkAPIAccessToken = (token: string) => checkJWT(token, API_ACCESS_SECRET_KEY, TOKEN_TYPES.API_ACCESS)

export const checkRefreshToken = (token: string) => checkJWT(token, REFRESH_SECRET_KEY, TOKEN_TYPES.REFRESH)
