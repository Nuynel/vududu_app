import {useEffect, useState} from "react";
import * as React from "react";
import EditingButtons from "../../d_widgets/EditingButtons";
import SubmitActionPopup from "../../e_features/SubmitActionPopup";
import {deleteDog, getOtherDogs} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import {useLocation} from "wouter";
import {Paths} from "../../g_shared/constants/routes";
import Filter from "../../g_shared/ui_components/Filter";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import PageComponent from "../../d_widgets/PageComponent";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {IncomingDogData} from "../../g_shared/types";
import EntityList, {Entity} from "../../e_features/EntityList";

const dogTypeOptions = [ // todo move values to const
  {
    label: 'Только мои собаки',
    value: 'ownDogs'
  },
  {
    label: 'Другие добавленные мной собаки',
    value: 'allAddedDogs'
  }
]

const DogsScreen = () => {
  const [show, setShow] = useState(false);
  const [, setLocation] = useLocation();
  const [editingMode, switchEditingMode] = useState<boolean>(false)
  const [selectedId, changeSelectedId] = useState<string | null>(null)
  const {getInitialData} = useGetInitialData()
  const {dogTypeFilter, setDogTypeFilter} = useUIStateStore()
  const { dogsData, otherDogsData, setOtherDogsData } = useProfileDataStore();

  const switchIsIdSelected = (id) => {
    if (!selectedId || selectedId !== id) return changeSelectedId(id)
    changeSelectedId(null)
  }

  const deleteEntities = async () => {
    setShow(false)
    await deleteDog(selectedId)
    await getInitialData()
  }

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
    <PageComponent filter={!!(dogTypeFilter === 'ownDogs' ? dogsData.length : otherDogsData.length)}>
      {!!(dogTypeFilter === 'ownDogs' ? dogsData.length : otherDogsData.length) && (
        <Filter
          options={dogTypeOptions}
          value={dogTypeFilter}
          setValue={setDogTypeFilter}
        />
      )}

      <div className="w-full bg-gray-200">
        <div className="overflow-auto h-full">
          <EntityList
            list={getEntityList(dogTypeFilter === 'ownDogs' ? dogsData : otherDogsData)}
            setActiveId={(id) => setLocation(`~/app/dogs/dog/${id}`)}
            hasColorIndicator={false}
            hasIcons
            selectMode={editingMode}
            selectedIds={[selectedId]}
            switchIsIdSelected={switchIsIdSelected}
            openCreator={() => setLocation(`~${Paths.dog_creator}`)}
            addButtonText={'addFirstDog'}
          />
        </div>
      </div>

      <EditingButtons
        isListEmpty={!(dogTypeFilter === 'ownDogs' ? dogsData.length : otherDogsData.length)}
        isEditingModeActive={editingMode}
        switchEditingMode={() => switchEditingMode(!editingMode)}
        showPopup={() => setShow(true)}
        openCreator={() => setLocation(`~${Paths.dog_creator}`)}
      />

      {show && (
        <SubmitActionPopup
          text={'Удалить выбранную собаку?'}
          submitButtonText={'Удалить'}
          closePopup={() => setShow(false)}
          submitAction={deleteEntities}
        />
      )}
    </PageComponent>
  )
}

export default DogsScreen
