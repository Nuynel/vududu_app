import {useState} from "react";
import {Box, Grid} from "grommet";
import DogsList from "./DogsList";
import LittersList from "./LittersList";
import SectionHeader from "../../e_features/SectionHeader";
import * as React from "react";
import EditingButtons from "../../d_widgets/EditingButtons";
import SubmitActionPopup from "../../e_features/SubmitActionPopup";
import {deleteDog, deleteLitter} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import {useLocation, useRoute} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {Paths} from "../../g_shared/constants/routes";
import Filter from "../../g_shared/ui_components/Filter";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";

enum DATA_TYPES {
  DOGS = 'DOGS',
  LITTERS = 'LITTERS'
}

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

const DogsScreen = () => {
  const [show, setShow] = useState(false);
  const [matchDogsRoutes] = useRoute('/app/dogs/*?')
  const [, setLocation] = useLocation();
  const [activeDataType, setActiveDataType] = useState<DATA_TYPES>(matchDogsRoutes ? DATA_TYPES.DOGS : DATA_TYPES.LITTERS)
  const [editingMode, switchEditingMode] = useState<boolean>(false)
  const [selectedId, changeSelectedId] = useState<string | null>(null)
  const {getInitialData} = useGetInitialData()
  const {dogTypeFilter, setDogTypeFilter, litterTypeFilter, setLitterTypeFilter} = useUIStateStore()

  const {isSmall, columns, rows, areas} = useResponsiveGrid(true);

  const switchIsIdSelected = (id) => {
    if (!selectedId || selectedId !== id) return changeSelectedId(id)
    changeSelectedId(null)
  }

  const getDeletePopupText = () => {
    return activeDataType === DATA_TYPES.DOGS
      ? 'Удалить выбранную собаку?'
      : 'Удалить выбранный помет?'
  }

  const deleteEntities = async () => {
    setShow(false)
    if (activeDataType === DATA_TYPES.DOGS) {
      await deleteDog(selectedId)
    } else {
      await deleteLitter(selectedId)
    }
    await getInitialData()
  }

  return (
    <Grid
      rows={rows}
      columns={columns}
      areas={areas}
      height={'100%'}
    >
      {isSmall && (
        <SectionHeader
          activeDataType={activeDataType}
          buttons={[
            {type: DATA_TYPES.DOGS, label: 'Собаки', link: Paths.dogs},
            {type: DATA_TYPES.LITTERS, label: 'Пометы', link: Paths.litters},
          ]}
          isLink
          setActiveDataType={setActiveDataType}
        />
      )}

      <Filter
        options={matchDogsRoutes ? dogTypeOptions : litterTypeOptions}
        value={matchDogsRoutes ? dogTypeFilter : litterTypeFilter}
        setValue={matchDogsRoutes ? setDogTypeFilter : setLitterTypeFilter}
      />

      <Box gridArea={'content'} pad={{left: 'small', right: 'small'}} background={'lightBackground'}>
        <Box overflow='auto'>
          {matchDogsRoutes ? (
            <DogsList
              selectMode={editingMode}
              selectedIds={[selectedId]}
              switchIsIdSelected={switchIsIdSelected}
            />
          ) : (
            <LittersList
              selectMode={editingMode}
              selectedIds={[selectedId]}
              switchIsIdSelected={switchIsIdSelected}
            />
          )}
        </Box>
      </Box>

      <EditingButtons
        isEditingModeActive={editingMode}
        switchEditingMode={() => switchEditingMode(!editingMode)}
        showPopup={() => setShow(true)}
        openCreator={() => setLocation(matchDogsRoutes ? Paths.dog_creator : Paths.litter_creator)}
      />

      {show && (
        <SubmitActionPopup
          text={getDeletePopupText()}
          submitButtonText={'Удалить'}
          closePopup={() => setShow(false)}
          submitAction={deleteEntities}
        />
      )}
    </Grid>
  )
}

export default DogsScreen
