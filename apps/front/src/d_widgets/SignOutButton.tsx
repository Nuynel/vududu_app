import * as React from "react";
import {signOut} from "../g_shared/methods/api";
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {useTranslation} from "../f_entities/contexts/i18n";

const SignOutButton = ({fill}: { fill?: boolean }) => {
  const {removeAccessToken, setAccessToken} = useProfileDataStore();
  const {translate} = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    setAccessToken('');
    removeAccessToken();
    // sessionStorage.removeItem('isSessionInitializationFinished')
  }

  return (
    <button
      onClick={handleSignOut}
      className={`flex justify-center text-blue-600 hover:text-blue-800 ${fill ? 'w-full' : ''}`}
    >
      {translate('signOut')}
    </button>
  )
}

export default SignOutButton;
