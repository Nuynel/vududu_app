import {useState} from "react";
import {recoveryPassword, saveNewPassword} from "../../g_shared/methods/api";
import {useLocation} from "wouter";
import {Paths} from "../../g_shared/constants/routes";

const usePassRecovery = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRecoveryInitialized, changeIsRecoveryInitialized] = useState<null | boolean>(null)
  const [controlPassword, setControlPassword] = useState('')
  const [isLoading, setIsLoading] = useState<null | boolean>(null)

  const [, setLocation] = useLocation();

  const handleSubmit = () => {
    if (email) {
      setIsLoading(true)
      recoveryPassword({email})
        .then(() => {
          changeIsRecoveryInitialized(true)
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const updatePassword = (recoveryToken: string) => {
    if (password && password.length > 5 && password === controlPassword) {
      setIsLoading(true)
      saveNewPassword({password, recoveryToken})
        .then(() => {
          setLocation(Paths.sign_in + '?passwordUpdated')
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return {
    email,
    password,
    controlPassword,
    isLoading,
    isRecoveryInitialized,
    setEmail,
    setPassword,
    setControlPassword,
    handleSubmit,
    updatePassword,
  }
}

export default usePassRecovery;
