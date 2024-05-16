import {useState} from "react";
import AddNewDogForm from "./AddNewDogForm";
import {Box, Button, Grid, Layer} from "grommet";
import DogsList from "./DogsList";
import LittersList from "./LittersList";
import AddNewLitterForm from "./AddNewLitterForm";
import {CloseIcon} from "../../g_shared/icons";
import SectionHeader from "../../e_features/SectionHeader";
import * as React from "react";
import EditingButtons from "../../d_widgets/EditingButtons";
import DeletePopup from "../../e_features/DeletePopup";
import {deleteDog, deleteLitter} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import {useRoute} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

enum DATA_TYPES {
  DOGS = 'DOGS',
  LITTERS = 'LITTERS'
}

const DogsScreen = () => {
  const [show, setShow] = useState(false);
  const [matchDogsRoutes] = useRoute('/dogs/*?')
  const [activeDataType, setActiveDataType] = useState<DATA_TYPES>(matchDogsRoutes ? DATA_TYPES.DOGS : DATA_TYPES.LITTERS)
  const [editingMode, switchEditingMode] = useState<boolean>(false)
  const [selectedId, changeSelectedId] = useState<string | null>(null)
  const {getInitialData} = useGetInitialData()
  const hideCard = () => setShow(false)

  const {isSmall, columns, rows, areas} = useResponsiveGrid();

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
            {type: DATA_TYPES.DOGS, label: 'Собаки', link: '/dogs'},
            {type: DATA_TYPES.LITTERS, label: 'Пометы', link: '/litters'},
          ]}
          isLink
          setActiveDataType={setActiveDataType}
        />
      )}

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
      >

      </EditingButtons>

      {show && !editingMode && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          {activeDataType === DATA_TYPES.DOGS ? (
            <AddNewDogForm hideCard={hideCard}/>
          ) : (
            <AddNewLitterForm hideCard={hideCard}/>
          )}
          <Box style={{height: '48px', position: "absolute", top: 16, right: 20}}>
            <Button
              focusIndicator={false}
              icon={<CloseIcon color='white' />}
              fill={false}
              style={{width: '48px', borderRadius: '24px'}}
              primary
              onClick={hideCard}
            />
          </Box>
      </Layer>
      )}
      {show && editingMode && (
        <DeletePopup text={getDeletePopupText()} closePopup={() => setShow(false)} deleteEntities={deleteEntities}/>
      )}
    </Grid>
  )
}

export default DogsScreen


