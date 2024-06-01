import * as React from "react";
import {useParams} from "wouter";
import usePassRecovery from "./usePassRecovery";
import StartPassRecovery from "./ui/StartPassRecovery";
import ContinuePassRecovery from "./ui/ContinuePassRecovery";
import FinishPassRecovery from "./ui/FinishPassRecovery";

type Props = {
  email: string,
  password: string,
  controlPassword: string,
  isRecoveryInitialized: null | boolean,
  isLoading:  null | boolean,
  setEmail: () => void,
  setPassword: () => void,
  setControlPassword: () => void,
  handleSubmit: () => void,
}

const ConfirmEmailScreen = () => {
  const {recoveryToken}: {recoveryToken: string} = useParams();

  const {
    email,
    password,
    controlPassword,
    isRecoveryInitialized,
    isLoading,
    setEmail,
    setPassword,
    setControlPassword,
    handleSubmit,
    updatePassword
  } = usePassRecovery();

  if (!recoveryToken && !isRecoveryInitialized) {
    return <StartPassRecovery email={email} isLoading={isLoading} setEmail={setEmail} handleSubmit={handleSubmit}/>
  }

  if (!recoveryToken && isRecoveryInitialized) {
    return <ContinuePassRecovery/>
  }

  if (recoveryToken) {
    return <FinishPassRecovery
      password={password}
      controlPassword={controlPassword}
      isRecoveryInitialized={isRecoveryInitialized}
      isLoading={isLoading}
      setPassword={setPassword}
      setControlPassword={setControlPassword}
      updatePassword={() => updatePassword(recoveryToken)}
    />
  }
}

export default ConfirmEmailScreen
