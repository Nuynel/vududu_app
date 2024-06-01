import {useEffect, useState} from "react";
import {signIn} from "../../g_shared/methods/api";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";

const useSignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState<null | boolean>(null)
  const {setAccessToken, saveAccessToken} = useProfileDataStore();

  const handleSubmit = () => {
    if (email && password) {
      setIsLoading(true)
    }
  }

  useEffect(() => {
    if (isLoading === true) {
      signIn({
        email,
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
  }, [isLoading])

  return {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  }
}

export default useSignIn;
