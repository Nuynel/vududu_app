import {useState} from "react";
import {signIn} from "../../g_shared/methods/api";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";

const useSignIn = () => {
  const [isLoading, setIsLoading] = useState<null | boolean>(null)
  const {setAccessToken, saveAccessToken} = useProfileDataStore();

  const onSubmit = ({email, password}: {email: string, password: string}) => {
    if (email && password) {
      setIsLoading(true)
      signIn({
        email: email.toLowerCase(),
        password,
      }).then(async (result: {accessToken: string}) => {
        const {accessToken} = result;
        setAccessToken(accessToken);
        saveAccessToken(accessToken);
      }).catch(() => {
        window.dispatchEvent(new Event(EB_EVENTS_NAMES.ERROR))
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }

  return {
    isLoading,
    onSubmit,
  }
}

export default useSignIn;
