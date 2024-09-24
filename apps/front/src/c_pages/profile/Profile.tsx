import * as React from "react";
import {useState} from "react";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {PROFILE_TYPES} from "../../g_shared/types/profile";
import SignOutButton from "../../d_widgets/SignOutButton";
import {useRoute} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {Paths} from "../../g_shared/constants/routes";
import BreedCreator from "./BreedCreator";
import PageComponent from "../../d_widgets/PageComponent";

enum DATA_TYPES {
  PROFILE = 'PROFILE',
  CONTACTS = 'CONTACTS'
}

const ProfileScreen = () => {
  const [matchProfileRoute] = useRoute(Paths.profile)
  const [activeDataType, setActiveDataType] = useState<DATA_TYPES>(matchProfileRoute ? DATA_TYPES.PROFILE : DATA_TYPES.CONTACTS)
  const {isSmall, columns, rows, areas} = useResponsiveGrid();

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

  const headerProps = {
    title: DATA_TYPES.PROFILE.toLowerCase(),
    back: isSmall
  }

  return (
    <PageComponent  headerProps={headerProps}>
      <div className="p-2 bg-lightBackground">
        <div className="overflow-auto">
          <div className="bg-white p-4 m-2 rounded-lg shadow-md">
            <div className="card-body">
              {/* E-mail */}
              <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                <span className="font-bold">E-mail:</span>
                <span className="truncate">{email}</span>
              </div>

              {/* Условное отображение для типа профиля */}
              <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                <span className="font-bold">{type === PROFILE_TYPES.KENNEL ? 'Название питомника:' : 'Имя заводчика:'}</span>
                <span className="truncate">{name || 'Не указано'}</span>
              </div>

              {/* Кинологическая федерация */}
              {connectedOrganisations?.canineFederation && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Кинологическая федерация:</span>
                  <span className="truncate">{connectedOrganisations?.canineFederation}</span>
                </div>
              )}

              {/* Национальный клуб породы */}
              {connectedOrganisations?.nationalBreedClub && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Национальный клуб породы:</span>
                  <span className="truncate">{connectedOrganisations?.nationalBreedClub}</span>
                </div>
              )}

              {/* Кинологический клуб */}
              {connectedOrganisations?.canineClub && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Кинологический клуб:</span>
                  <span className="truncate">{connectedOrganisations?.canineClub}</span>
                </div>
              )}

              {/* Питомник */}
              {connectedOrganisations?.kennel && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Питомник:</span>
                  <span className="truncate">{connectedOrganisations?.kennel}</span>
                </div>
              )}
            </div>
          </div>
          <BreedCreator email={email} />
        </div>
      </div>
    </PageComponent>
  );
}

export default ProfileScreen
