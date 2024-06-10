import {useEffect} from "react";
import {getInitialDataReq} from '../../g_shared/methods/api'
import {useProfileDataStore} from "../store/useProfileDataStore";
import useAuth from './useAuth';
import {isAuthenticated} from "../../g_shared/methods/helpers";
import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";

const useGetInitialData = () => {
  const {
    setUserData,
    setProfileData,
    setDogsData,
    setLittersData,
    setEventsData,
    setBreedsData,
  } = useProfileDataStore();

  const {accessToken} = useProfileDataStore();

  const getInitialData = async () => {
    if (isAuthenticated(accessToken)) {
      try {
        const { userData, profileData, dogs, litters, events, breeds } = await getInitialDataReq()
        setUserData(userData);
        if (profileData) setProfileData(profileData);
        setDogsData(dogs);
        setLittersData(litters);
        setEventsData(events);
        setBreedsData(breeds);
        // sessionStorage.setItem('isSessionInitializationFinished', 'true')
      } catch (e) {
        console.error('Error in useGetInitialData > getInitialData > try/catch block > Error information > ', e)
      }
    }
  }

  useEffect(() => {
    window.addEventListener(EB_EVENTS_NAMES.USER_AUTHENTICATION_SUCCESS, getInitialData)
    return () => {
      window.removeEventListener(EB_EVENTS_NAMES.USER_AUTHENTICATION_SUCCESS, getInitialData)
    }
  }, [accessToken])

  return {
    getInitialData
  }
}

export default useGetInitialData;
