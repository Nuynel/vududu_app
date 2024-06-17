import * as React from "react";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {IncomingDogData} from "../../g_shared/types";
import EntityList, {Entity} from "../../e_features/EntityList";
import {useLocation} from "wouter";

type Props = {
  selectMode: boolean,
  selectedIds: string[],
  switchIsIdSelected: (id) => void,
}

const DogsList = ({selectMode, selectedIds, switchIsIdSelected}: Props) => {
  const { dogsData } = useProfileDataStore();
  const [, setLocation] = useLocation();

  const getEntityList = (list: IncomingDogData[]): Entity[] => {
    return list.map(entity => ({
      _id: entity._id,
      icon: entity.gender,
      title: entity.name || entity.fullName,
      date: [entity.dateOfBirth],
    }))
  }

  return (
    <EntityList
      list={getEntityList(dogsData)}
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
