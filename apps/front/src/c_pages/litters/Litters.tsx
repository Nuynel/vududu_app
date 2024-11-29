import {useState} from "react";
import * as React from "react";
import EditingButtons from "../../d_widgets/EditingButtons";
import SubmitActionPopup from "../../e_features/SubmitActionPopup";
import {deleteLitter} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import {Route, useLocation} from "wouter";
import {Paths} from "../../g_shared/constants/routes";
import Filter from "../../g_shared/ui_components/Filter";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import PageComponent from "../../d_widgets/PageComponent";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {IncomingLitterData} from "../../g_shared/types";
import EntityList, {Entity} from "../../e_features/EntityList";

const litterTypeOptions = [
  {
    label: 'Только мои пометы',
    value: 'ownLitters'
  },
  {
    label: 'Другие добавленные мной пометы',
    value: 'allAddedLitters'
  }
]

const LittersScreen = () => {
  const [show, setShow] = useState(false);
  const [, setLocation] = useLocation();
  const [editingMode, switchEditingMode] = useState<boolean>(false)
  const [selectedId, changeSelectedId] = useState<string | null>(null)
  const {getInitialData} = useGetInitialData()
  const {litterTypeFilter, setLitterTypeFilter} = useUIStateStore()
  const { littersData } = useProfileDataStore();

  const getEntityList = (list: IncomingLitterData[]): Entity[] => {
    return list.map(entity => ({
      _id: entity._id,
      icon: null,
      title: `${entity.fatherData.fullName}/${entity.motherData.fullName}`,
      date: [entity.dateOfBirth],
    }))
  }
  const switchIsIdSelected = (id) => {
    if (!selectedId || selectedId !== id) return changeSelectedId(id)
    changeSelectedId(null)
  }

  const deleteEntities = async () => {
    setShow(false)
    await deleteLitter(selectedId)
    await getInitialData()
  }

  return (
    <PageComponent filter={!!littersData.length}>
        {!!littersData.length && (
          <Filter
            options={litterTypeOptions}
            value={litterTypeFilter}
            setValue={setLitterTypeFilter}
          />
        )}

        <div className="w-full bg-gray-200">
          <div className="overflow-auto h-full">
            <EntityList
              list={getEntityList(littersData)}
              setActiveId={(id) => setLocation(`/app/population/litters/litter/${id}`)}
              hasColorIndicator={false}
              hasIcons={false}
              selectMode={editingMode}
              selectedIds={[selectedId]}
              switchIsIdSelected={switchIsIdSelected}
              openCreator={() => setLocation(`~${Paths.litter_creator}`)}
              addButtonText={'addFirstLitter'}
            />
          </div>
        </div>

        <EditingButtons
          isListEmpty={!(littersData.length)}
          isEditingModeActive={editingMode}
          switchEditingMode={() => switchEditingMode(!editingMode)}
          showPopup={() => setShow(true)}
          openCreator={() => setLocation(`~${Paths.litter_creator}`)}
        />

        {show && (
          <SubmitActionPopup
            text={'Удалить выбранный помет?'}
            submitButtonText={'Удалить'}
            closePopup={() => setShow(false)}
            submitAction={deleteEntities}
          />
        )}
      </PageComponent>
  )
}

export default LittersScreen
