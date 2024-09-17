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
    connectedOrganisations: {
      canineFederation,
      nationalBreedClub,
      canineClub,
      kennel
    }
  } = useProfileDataStore();

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
              {type === PROFILE_TYPES.KENNEL ? (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Название питомника:</span>
                  <span className="truncate">{name}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Имя заводчика:</span>
                  <span className="truncate">{name}</span>
                </div>
              )}

              {/* Кинологическая федерация */}
              {canineFederation && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Кинологическая федерация:</span>
                  <span className="truncate">{canineFederation}</span>
                </div>
              )}

              {/* Национальный клуб породы */}
              {nationalBreedClub && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Национальный клуб породы:</span>
                  <span className="truncate">{nationalBreedClub}</span>
                </div>
              )}

              {/* Кинологический клуб */}
              {canineClub && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Кинологический клуб:</span>
                  <span className="truncate">{canineClub}</span>
                </div>
              )}

              {/* Питомник */}
              {kennel && (
                <div className="grid grid-cols-2 items-center mb-2 text-sm md:text-base">
                  <span className="font-bold">Питомник:</span>
                  <span className="truncate">{kennel}</span>
                </div>
              )}
            </div>

            {/* Footer с кнопкой выхода */}
            <div className="flex justify-center p-4">
              <SignOutButton fill={false}/>
            </div>
          </div>
          <BreedCreator email={email} />
        </div>
      </div>
    </PageComponent>
  );
}

export default ProfileScreen
