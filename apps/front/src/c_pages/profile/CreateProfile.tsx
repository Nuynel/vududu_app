import SignOutButton from "../../d_widgets/SignOutButton";
import {useState} from "react";
import * as React from "react";
import {createProfile} from '../../g_shared/methods/api';
import {Link, useLocation} from "wouter";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import { Paths } from '../../g_shared/constants/routes';
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";

export enum PROFILE_TYPES {
  // CANINE_FEDERATION = 'CANINE_FEDERATION',
  // NATIONAL_BREED_CLUb = 'NATIONAL_BREED_CLUb',
  // CANINE_CLUB = 'CANINE_CLUB',
  KENNEL = 'KENNEL',
  BREEDER = 'BREEDER',
  // MALE_DOG_OWNER = 'MALE_DOG_OWNER',
}

const CreateProfile = () => {
  const [profileType, setProfileType] = useState<PROFILE_TYPES | null>(null)
  const [name, setName] = useState<string>('')
  const [isNameFilled, switchIsNameFilled] = useState<boolean>(false)
  const [canineFederationName, setCanineFederationName] = useState<string>('')
  const [nationalBreedClubName, setNationalBreedClubName] = useState<string>('')
  const [canineClubName, setCanineClubName] = useState<string>('')
  const [kennelName, setKennelName] = useState<string>('')
  const [, setLocation] = useLocation();


  const {isSmall} = useResponsiveGrid()
  const { getInitialData } = useGetInitialData()
  const {setAccessToken, saveAccessToken} = useProfileDataStore();

  const submit = () => {
    createProfile({
      name,
      type: profileType,
      connectedOrganisations: {
        canineFederation: canineFederationName || null,
        nationalBreedClub: nationalBreedClubName || null,
        canineClub: canineClubName || null,
        kennel: kennelName || null,
      }
    }).then(async (result: {accessToken: string}) => {
      const {accessToken} = result;
      setAccessToken(accessToken);
      saveAccessToken(accessToken);
    }).then(() => {
      return getInitialData()
    })
      .then(() => setLocation(Paths.events, {replace: true}))
  }


  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-center">
            {!profileType && 'Шаг 1 из 3'}
            {profileType && !isNameFilled && 'Шаг 2 из 3'}
            {profileType && isNameFilled && 'Шаг 3 из 3'}
          </h3>
        </div>
        <div className="mb-6">
          {!profileType && (
            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={() => setProfileType(PROFILE_TYPES.KENNEL)}
              >
                {isSmall ? 'Добавить питомник' : 'Зарегистрироваться как питомник'}
              </button>
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={() => setProfileType(PROFILE_TYPES.BREEDER)}
              >
                {isSmall ? 'Добавить заводчика' : 'Зарегистрироваться как заводчик'}
              </button>
            </div>
          )}

          {profileType && !isNameFilled && (
            <div className="flex flex-col gap-4">
              <form onSubmit={() => switchIsNameFilled(true)} className="space-y-4">
                <div>
                  <label htmlFor="name-input-id" className="block text-sm font-medium text-gray-700">
                    {profileType === PROFILE_TYPES.KENNEL ? 'Название вашего питомника' : 'ФИО'}
                  </label>
                  <input
                    id="name-input-id"
                    placeholder={profileType === PROFILE_TYPES.KENNEL ? 'Василёк' : 'Иванов Иван Иванович'}
                    value={name}
                    onChange={event => setName(event.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {profileType === PROFILE_TYPES.KENNEL ? 'Сохранить название питомника' : 'Сохранить имя заводчика'}
                </button>
              </form>
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={() => setProfileType(null)}
              >
                Назад
              </button>
            </div>
          )}

          {profileType && isNameFilled && (
            <div className="flex flex-col gap-4">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="canine-federation-name-input-id" className="block text-sm font-medium text-gray-700">
                    Название кинологической федерации
                  </label>
                  <input
                    id="canine-federation-name-input-id"
                    placeholder="Российская кинологическая федерация"
                    value={canineFederationName}
                    onChange={event => setCanineFederationName(event.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="national-breed-club-name-input-id" className="block text-sm font-medium text-gray-700">
                    Название национального клуба породы
                  </label>
                  <input
                    id="national-breed-club-name-input-id"
                    placeholder="НКА Немецкая овчарка"
                    value={nationalBreedClubName}
                    onChange={event => setNationalBreedClubName(event.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="canine-club-name-input-id" className="block text-sm font-medium text-gray-700">
                    Название кинологического клуба
                  </label>
                  <input
                    id="canine-club-name-input-id"
                    placeholder='Клуб РОО КЦ "Март"'
                    value={canineClubName}
                    onChange={event => setCanineClubName(event.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                {profileType === PROFILE_TYPES.BREEDER && (
                  <div>
                    <label htmlFor="kennel-name-input-id" className="block text-sm font-medium text-gray-700">
                      Название питомника
                    </label>
                    <input
                      id="kennel-name-input-id"
                      placeholder="Василёк"
                      value={kennelName}
                      onChange={event => setKennelName(event.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Сохранить связанные организации
                </button>
              </form>
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={() => switchIsNameFilled(false)}
              >
                Назад
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 w-full">
          <SignOutButton fill />
        </div>
      </div>
    </div>
  )
}

export default CreateProfile
