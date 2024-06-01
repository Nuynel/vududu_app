import {navigate} from "wouter/use-browser-location";
import {Paths, PrivateRoutes} from "../../constants/routes";
import {isAuthenticated, parseJwt} from "./index";

export const isValidRoute = (path: string): path is Paths => {
  return Object.values(Paths).includes(path as Paths);
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& означает всё совпадение
}

export const isRoutePublic = (location) => {
  let passRecoveryPattern = new RegExp(`^${escapeRegExp(Paths.passwordRecovery)}`);

  return location === Paths.sign_in
    || location === Paths.sign_up
    || passRecoveryPattern.test(location)
}

export const navigationAfterInit = () => {
  const accessToken = localStorage.getItem('accessToken');
  const location = window.location.pathname;
  if (isAuthenticated(accessToken)) {
    // Todo потестить роут с каким-нибудь айдишником

    // проверяем текущую локацию: если она НЕ в списке приватных, то редиректим на календарь
    if (isValidRoute(location) && !PrivateRoutes.includes(location)) {
      const {profileId} = parseJwt(accessToken);
      if (!profileId) {
        return navigate(Paths.createProfile, { replace: true });
      }
      // return navigate('/calendar', { replace: true });
      navigate(Paths.events, { replace: true });
    }
  } else {
    if (!isRoutePublic(location)) {
      // Access token недействителен или просрочен, перенаправьте на экран входа
      console.error('Токен обновления недействителен или просрочен, пользователь перенаправлен на экран хода')
      navigate(Paths.sign_in, { replace: true });
    }
  }
}

