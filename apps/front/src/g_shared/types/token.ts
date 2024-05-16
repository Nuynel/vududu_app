export type DecodedToken = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  profileId: string | null;
  type: string;
  userId: string;
  // Определите дополнительные пользовательские поля, которые могут быть в вашем токене
  // [key: string]: any; // Для гибкости, если ваш JWT может содержать дополнительные поля
}
