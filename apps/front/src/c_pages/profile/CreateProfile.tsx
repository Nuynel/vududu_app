import * as React from "react";
import SignOutButton from "../../d_widgets/SignOutButton";
import {createProfile} from '../../g_shared/methods/api';
import {useLocation} from "wouter";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import { Paths } from '../../g_shared/constants/routes';
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import LanguageSelect from "../../e_features/LanguageSelect";
import {useTranslation} from "../../f_entities/contexts/i18n";

export enum PROFILE_TYPES {
  // CANINE_FEDERATION = 'CANINE_FEDERATION',
  // NATIONAL_BREED_CLUb = 'NATIONAL_BREED_CLUb',
  // CANINE_CLUB = 'CANINE_CLUB',
  KENNEL = 'KENNEL',
  BREEDER = 'BREEDER',
  // MALE_DOG_OWNER = 'MALE_DOG_OWNER',
}

const CreateProfile = () => {
  const [, setLocation] = useLocation();
  const {translate} = useTranslation();

  const {isSmall} = useResponsiveGrid()
  const { getInitialData } = useGetInitialData()
  const {setAccessToken, saveAccessToken} = useProfileDataStore();

  const submit = (profileType) => {
    createProfile({type: profileType,})
      .then(async (result: {accessToken: string}) => {
        const {accessToken} = result;
        setAccessToken(accessToken);
        saveAccessToken(accessToken);
      })
      .then(() => getInitialData())
      .then(() => setLocation(Paths.events, {replace: true}))
  }

  return (
    <div className={`flex flex-col justify-center items-center bg-gray-800 w-full ${isSmall ? 'py-6' : ''} h-full`}>
      <div className={`flex justify-center items-center flex-col bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12 m-4' : 'w-96 m-6'}`}>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-center">
            {translate('profileCreating')}
          </h3>
        </div>
        <div className="mb-6 w-full">
          <div className="flex flex-col gap-4">
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300"
              onClick={() => submit(PROFILE_TYPES.KENNEL)}
            >
              {isSmall ? translate('addKennel') : translate('registerAsKennel')}
            </button>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300"
              onClick={() => submit(PROFILE_TYPES.BREEDER)}
            >
              {isSmall ? translate('addBreeder') : translate('registerAsBreeder')}
            </button>
          </div>
        </div>

        <SignOutButton />
      </div>
      <LanguageSelect small/>
    </div>
  )
}

export default CreateProfile
