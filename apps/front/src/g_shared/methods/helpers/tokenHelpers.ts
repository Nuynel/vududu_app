import {DecodedToken} from "../../types";

export const parseJwt = (token: string): DecodedToken => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null; // В случае ошибки возвращаем null или подходящее значение
  }
}

export const isTokenExpired = (token: string) => {
  const decodedToken = parseJwt(token);
  const now = Math.floor(Date.now() / 1000); // Текущее время в секундах с начала эпохи Unix
  return !!(decodedToken && decodedToken.exp < now)
}

export const isAuthenticated = (accessToken: string) => {
  return accessToken
    && typeof accessToken === 'string'
    && parseJwt(accessToken)
    && !isTokenExpired(accessToken);
};
