import * as React from "react";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {IncomingLitterData} from "../../g_shared/types";
import EntityList, {Entity} from "../../e_features/EntityList";
import {useLocation} from "wouter";

type Props = {
  selectMode: boolean,
  selectedIds: string[],
  switchIsIdSelected: (id) => void,
}

const LittersList = ({selectMode, selectedIds, switchIsIdSelected}: Props) => {
  const { littersData } = useProfileDataStore();
  const [, setLocation] = useLocation();

  const getEntityList = (list: IncomingLitterData[]): Entity[] => {
    return list.map(entity => ({
      _id: entity._id,
      icon: null,
      title: `${entity.fatherData.fullName}/${entity.motherData.fullName}`,
      date: [entity.dateOfBirth],
    }))
  }

  return (
    <EntityList
      list={getEntityList(littersData)}
      setActiveId={(id) => setLocation(`/litters/litter/${id}`)}
      hasColorIndicator={false}
      hasIcons={false}
      selectMode={selectMode}
      selectedIds={selectedIds}
      switchIsIdSelected={switchIsIdSelected}
    />
  )
}

export default LittersList
