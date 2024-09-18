import {useEffect, useState} from "react";
import {useLocation} from "wouter";
import {signUp} from "../../g_shared/methods/api";
import {Paths} from "../../g_shared/constants/routes";
import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";
import {z} from 'zod'

const useSignUp = () => {
  const [, setLocation] = useLocation();

  const [isLoading, setIsLoading] = useState<null | Boolean>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = ({email, password}: {email: string, password: string}) => {
    setIsLoading(true)
    signUp({
      email: email.toLowerCase(),
      password,
    }).then(() => {
      setError(null)
    }).catch(() => {
      setError('Пользователь не добавлен')
      window.dispatchEvent(new Event(EB_EVENTS_NAMES.ERROR))
    }).finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    if (isLoading === false && !error) {
      setLocation(Paths.confirmEmail);
    }
  }, [isLoading])

  return {
    isLoading,
    onSubmit,
  }
}

export default useSignUp;
