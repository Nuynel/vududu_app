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

  return (
    <button
      onClick={handleSignOut}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
        fill ? 'w-full' : ''
      }`}
    >
      Выйти
    </button>
  )
}

export default SignOutButton;
