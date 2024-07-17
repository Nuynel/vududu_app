import * as React from "react";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {IncomingDogData} from "../../g_shared/types";
import EntityList, {Entity} from "../../e_features/EntityList";
import {useLocation} from "wouter";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import {useEffect} from "react";
import {getOtherDogs} from "../../g_shared/methods/api";

type Props = {
  selectMode: boolean,
  selectedIds: string[],
  switchIsIdSelected: (id) => void,
}

const DogsList = ({selectMode, selectedIds, switchIsIdSelected}: Props) => {
  const { dogsData, otherDogsData, setOtherDogsData } = useProfileDataStore();
  const { dogTypeFilter } = useUIStateStore();
  const [, setLocation] = useLocation();

  const getEntityList = (list: IncomingDogData[]): Entity[] => {
    return list.map(entity => ({
      _id: entity._id,
      icon: entity.gender,
      title: entity.fullName || entity.name,
      date: [entity.dateOfBirth],
    }))
  }

  useEffect(() => {
    if (!otherDogsData.length) {
      getOtherDogs().then(({protectedOtherDogs}) => setOtherDogsData(protectedOtherDogs))
    }
  }, [])

  return (
    <EntityList
      list={getEntityList(dogTypeFilter === 'ownDogs' ? dogsData : otherDogsData)}
      setActiveId={(id) => setLocation(`/dogs/dog/${id}`)}
      hasColorIndicator={false}
      hasIcons
      selectMode={selectMode}
      selectedIds={selectedIds}
      switchIsIdSelected={switchIsIdSelected}
    />
  )
}

export default DogsList
