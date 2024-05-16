import {Button} from "grommet";
import * as React from "react";
import {signOut} from "../g_shared/methods/api";
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";

const SignOutButton = ({fill}: { fill: boolean }) => {
  const {removeAccessToken, setAccessToken} = useProfileDataStore();

  const handleSignOut = async () => {
    await signOut();
    setAccessToken('');
    removeAccessToken();
    // sessionStorage.removeItem('isSessionInitializationFinished')
  }

  return <Button onClick={handleSignOut} primary label='Выйти' fill={fill ? 'horizontal' : false}/>
}

export default SignOutButton;
