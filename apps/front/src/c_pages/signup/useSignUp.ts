import {useEffect, useState} from "react";
import {useLocation} from "wouter";
import {signUp} from "../../g_shared/methods/api";
import {Paths} from "../../g_shared/constants/routes";
import {EB_EVENTS_NAMES} from "../../g_shared/constants/eventBusEventsNames";
import {z} from 'zod'

const useSignUp = () => {
  // для регистрации мне нужны только email и пароль
  // (пароль надо повторить, он должен быть не короче 8 символов, содержать цифры, строчные и заглавные буквы)
  // ToDo на странице регистрации можно добавить выбор питомник / заводчик и если питомник то добавить его имя
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [controlPassword, setControlPassword] = useState('')
  const [isEmailValid, setIsEmailValid] = useState<null | Boolean>(null)
  const [isPasswordValid, setIsPasswordValid] = useState<null | Boolean>(null)
  const [isControlPasswordValid, setIsControlPasswordValid] = useState<null | Boolean>(null)
  const [isLoading, setIsLoading] = useState<null | Boolean>(null)
  const [error, setError] = useState<string | null>(null)

  const checkIsPasswordValid = () => {
    return password.length > 5;
  }

  const checkIsControlPasswordValid = () => {
    return password === controlPassword;
  }

  const checkIsEmailValid = () => {
    return email.includes('@') && !email.includes(' ') && email.includes('.')
  }

  const handleSubmit = () => {
    setIsEmailValid(checkIsEmailValid())
    setIsPasswordValid(checkIsPasswordValid())
    setIsControlPasswordValid(checkIsControlPasswordValid())
  }

  useEffect(() => {
    if (isEmailValid && isPasswordValid && isControlPasswordValid) {
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
  }, [isEmailValid, isPasswordValid, isControlPasswordValid])

  useEffect(() => {
    if (isLoading === false && !error) {
      setLocation(Paths.confirmEmail);
    }
  }, [isLoading])

  return {
    email,
    password,
    controlPassword,
    isLoading,
    setEmail,
    setPassword,
    setControlPassword,
    handleSubmit,
  }
}

export default useSignUp;
