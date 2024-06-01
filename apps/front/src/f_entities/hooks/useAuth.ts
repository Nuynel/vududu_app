import {useEffect} from "react";
import {useProfileDataStore} from "../store/useProfileDataStore";
import {useLocation} from "wouter";

import {isAuthenticated, isValidRoute, parseJwt} from "../../g_shared/methods/helpers";
import {PrivateRoutes} from "../../g_shared/constants/routes";
import {refreshAccessToken} from "../../g_shared/methods/api";
import {Paths} from "../../g_shared/constants/routes";

import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";
import {isRoutePublic} from "../../g_shared/methods/helpers/navigationHelpers";

const useAuth = () => {
  const [location, setLocation] = useLocation();

  const {accessToken, setAccessToken, saveAccessToken, loadAccessToken} = useProfileDataStore();

  if (!accessToken && localStorage.getItem('accessToken')) {
    loadAccessToken();
  }
  const getNewTokenPair = () => {
    refreshAccessToken().then(({accessToken}: {accessToken: string | null}) => {
      setAccessToken(accessToken)
      saveAccessToken(accessToken)
    }).catch((error) => {
      console.error('Ошибка при обновлении access токена', error);
      setAccessToken(null)
      saveAccessToken(null)
    })
  }

  useEffect(() => {
    if (!accessToken && !isRoutePublic(location)) {
      // если нет токена, то пользователя редиректит на экран входа
      // кейс - токен удалили при выходе, надо редирекнуть
      setLocation(Paths.sign_in);
      return;
    }
    if (isAuthenticated(accessToken) && isValidRoute(location) && !PrivateRoutes.includes(location)) {
      // это обеспечивает редирект на календарь или создание профиля после установки токена доступа при логине
      // если роут в списке приватных, то навигации не происходит
      const {profileId} = parseJwt(accessToken);
      // todo могут быть ошибки если pathname будет включать в себя например параметры
      setLocation(profileId ? Paths.events : Paths.createProfile)
    }
    if (
      isAuthenticated(accessToken)
      // && !sessionStorage.getItem('isSessionInitializationFinished')
    ) {
      // информируем слушателей о том, что у нас в наличии есть рабочий токен доступа (кейс, когда пользователь логинится)
      window.dispatchEvent(new Event(EB_EVENTS_NAMES.USER_AUTHENTICATION_SUCCESS))
    }
    if (isAuthenticated(accessToken)) {
      // планируем обновление токенов через 8 минут, срок жизни токена доступа 10 минут
      const timerId = setTimeout(getNewTokenPair, 1000 * 60 * 8); // 8 minutes
      return () => clearTimeout(timerId);
    }
    // если в зависимости добавить location, то будут двойные срабатывания
  }, [accessToken])
}

export default useAuth;
