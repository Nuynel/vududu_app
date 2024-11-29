import * as React from "react";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {PROFILE_TYPES} from "../../g_shared/types/profile";
import {Link} from "wouter";
import {Paths} from "../../g_shared/constants/routes";
import PageComponent from "../../d_widgets/PageComponent";

const ProfileScreen = () => {
  const {
    email,
    name,
    type,
    connectedOrganisations
  }: {
    email: string,
    name: string | null,
    type: PROFILE_TYPES,
    connectedOrganisations: {
      canineFederation: string | null,
      nationalBreedClub: string | null,
      canineClub: string | null,
      kennel: string | null
    } | null
  } = useProfileDataStore()

  return (
    <PageComponent>
      <div className="g-gray-200 grid grid-rows-1">
        <div className="overflow-auto">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="card-body">
              <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                <span className="font-bold">E-mail:</span>
                <span className="truncate">{email}</span>
              </div>

              <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                <span className="font-bold">Тип профиля:</span>
                <span className="truncate">{type === PROFILE_TYPES.KENNEL ? 'Питомник' : 'Заводчик'}</span>
              </div>

              <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                <span className="font-bold">{type === PROFILE_TYPES.KENNEL ? 'Название питомника:' : 'Имя заводчика:'}</span>
                <span className="truncate">{name || 'Не указано'}</span>
              </div>

              {connectedOrganisations?.canineFederation && (
                <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Кинологическая федерация:</span>
                  <span className="truncate">{connectedOrganisations?.canineFederation}</span>
                </div>
              )}

              {connectedOrganisations?.nationalBreedClub && (
                <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Национальный клуб породы:</span>
                  <span className="truncate">{connectedOrganisations?.nationalBreedClub}</span>
                </div>
              )}

              {connectedOrganisations?.canineClub && (
                <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Кинологический клуб:</span>
                  <span className="truncate">{connectedOrganisations?.canineClub}</span>
                </div>
              )}

              {connectedOrganisations?.kennel && (
                <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Питомник:</span>
                  <span className="truncate">{connectedOrganisations?.kennel}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-md font-bold mb-2">Настройки</h3>
            <ul className="space-y-2">
              <li className="text-blue-500 text-sm hover:underline">
                <Link to={Paths.subscription}>
                  Подписка
                </Link>
              </li>
              <li className="text-blue-500 text-sm hover:underline">
                <Link to={Paths.privacy}>
                  Приватность и доступы
                </Link>
              </li>
              <li className="text-blue-500 text-sm hover:underline">
                <Link to={Paths.data_export}>
                  Экспорт данных
                </Link>
              </li>
              <li className="text-blue-500 text-sm hover:underline">
                <Link to={Paths.breed_creator}>
                  Добавление породы
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageComponent>
  );
}

export default ProfileScreen
