import {navigate} from "wouter/use-browser-location";
import {Paths, PrivateRoutes} from "../../constants/routes";
import {isAuthenticated, parseJwt} from "./index";

export const isValidRoute = (path: string): path is Paths => {
  return Object.values(Paths).includes(path as Paths);
};
export const navigationAfterInit = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (isAuthenticated(accessToken)) {
    // проверяем текущую локацию: если она НЕ в списке приватных, то редиректим на календарь
    const location = window.location.pathname;
    if (isValidRoute(location) && !PrivateRoutes.includes(location)) {
      const {profileId} = parseJwt(accessToken);
      if (!profileId) {
        return navigate(Paths.createProfile, { replace: true });
      }
      // return navigate('/calendar', { replace: true });
      navigate(Paths.events, { replace: true });
    }
  } else {
    // Access token недействителен или просрочен, перенаправьте на экран входа
    console.error('Токен обновления недействителен или просрочен, пользователь перенаправлен на экран хода')
    navigate("/sign-in", { replace: true });
  }
}

