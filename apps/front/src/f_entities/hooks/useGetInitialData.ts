import {useEffect} from "react";
import {getInitialDataReq} from '../../g_shared/methods/api'
import {useProfileDataStore} from "../store/useProfileDataStore";
import {isAuthenticated} from "../../g_shared/methods/helpers";
import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";
import {CROSSBREED} from "../../g_shared/types/breed";

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
        setBreedsData([...breeds, CROSSBREED]);
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
