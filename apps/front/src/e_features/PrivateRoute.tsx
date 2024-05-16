import * as React from "react";
import {Box} from "grommet";
import {useLocation, useRoute} from "wouter";
import {isAuthenticated, parseJwt} from "../g_shared/methods/helpers";
import {Paths} from "../g_shared/constants/routes";
import {navigate} from "wouter/types/use-browser-location";
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";

const PrivateRoute = ({ children }) => {
  const [, setLocation] = useLocation();
  const accessToken = localStorage.getItem('accessToken')
  const [matchCreateProfileRoute] = useRoute(Paths.createProfile)

  if (!isAuthenticated(accessToken)) {
    // Сохраняем текущее местоположение для возможного возвращения после аутентификации
    // sessionStorage.setItem('returnTo', location);
    setLocation(Paths.sign_in);
    return null;
  }

  const {profileId} = parseJwt(accessToken);

  if (!profileId && !matchCreateProfileRoute) {
    setLocation(Paths.createProfile, {replace: true});
    return null;
  }

  return (
    <Box gridArea="main" height={'full'}>
      {children}
    </Box>
  );
}

export default PrivateRoute;
