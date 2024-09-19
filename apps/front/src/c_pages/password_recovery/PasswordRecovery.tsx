import {useState} from "react";
import {useLocation, useParams, useRoute} from "wouter";
import {toast} from "react-toastify";
import StartPassRecovery from "./ui/StartPassRecovery";
import ContinuePassRecovery from "./ui/ContinuePassRecovery";
import FinishPassRecovery from "./ui/FinishPassRecovery";
import TokenExpired from "./ui/TokenExpired";
import {useTranslation} from "../../f_entities/contexts/i18n";
import {recoveryPassword, saveNewPassword} from "../../g_shared/methods/api";
import {Paths} from "../../g_shared/constants/routes";

const ConfirmEmailScreen = () => {
  const {recoveryToken}: {recoveryToken: string} = useParams();
  const [matchExpiredRoute] = useRoute('/app/password-recovery/token-expired')
  const [isRecoveryInitialized, changeIsRecoveryInitialized] = useState<null | boolean>(null)
  const [isLoading, setIsLoading] = useState<null | boolean>(null)
  const {translate} = useTranslation();
  const [, setLocation] = useLocation();

  const handleSubmit = ({email}: {email: string}) => {
    if (email) {
      setIsLoading(true)
      recoveryPassword({
        email: email.toLowerCase()
      }).then(() => {
        changeIsRecoveryInitialized(true)
      }).catch((e) => {
        toast.error(translate(e.message))
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }

  const updatePassword = ({password}: {password: string}, recoveryToken: string) => {
    if (password) {
      setIsLoading(true)
      saveNewPassword({
        password, recoveryToken
      }).then(() => {
        setLocation(Paths.sign_in + '?passwordUpdated')
      }).catch((e) => {
        toast.error(translate(e.message))
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }

  if (matchExpiredRoute) {
    return <TokenExpired />
  }

  if (!recoveryToken && !isRecoveryInitialized) {
    return (
      <StartPassRecovery
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    )
  }

  if (!recoveryToken && isRecoveryInitialized) {
    return <ContinuePassRecovery/>
  }

  if (recoveryToken) {
    return <FinishPassRecovery
      isLoading={isLoading}
      updatePassword={(data) => updatePassword(data, recoveryToken)}
    />
  }
}

export default ConfirmEmailScreen
