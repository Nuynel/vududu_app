import * as React from "react";
import {Box, Grid} from "grommet";
import EventsList from "./EventsList";
import {useState} from "react";
import SectionHeader from "../../e_features/SectionHeader";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import {DATA_TYPES} from "../../g_shared/types/event";
import ActivateButton from "./uiComponents/ActivateButton";
import EditingButtons from "../../d_widgets/EditingButtons";
import Filter from "./uiComponents/Filter";
import NewEventForm from "./uiComponents/NewEventForm";
import DeletePopup from "../../e_features/DeletePopup";
import {deleteEventsByIds} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

const deletePopupText = 'Вы уверены, что хотите удалить эти события?'

const CalendarScreen = () => {
  const [show, setShow] = useState(false);
  const [massEditing, switchEditingMode] = useState<boolean>(false)
  const [selectedIds, changeSelectedIds] = useState<string[]>([])

  const {columns, rows, areas} = useResponsiveGrid(true);
  const {eventTypeFilter, activeDataType, setActiveDataType} = useUIStateStore()

  const {getInitialData} = useGetInitialData()
  const switchIsIdSelected = (id) => {
    if (selectedIds.includes(id)) {
      changeSelectedIds(prevState => prevState.filter(elem => elem !== id))
    } else {
      changeSelectedIds(prevState => [...prevState, id])
    }
  }

  const deleteEntities = async () => {
    setShow(false)
    await deleteEventsByIds(selectedIds)
    await getInitialData()
  }

  return (
    <Grid
      rows={rows}
      columns={columns}
      areas={areas}
      height={'100%'}
    >
      <SectionHeader
        activeDataType={activeDataType}
        buttons={[
          {type: DATA_TYPES.PLANNED, label: 'Планировщик', link: '/events/planned'},
          {type: DATA_TYPES.HISTORY, label: 'История', link: '/events/history'},
        ]}
        isLink={true}
        setActiveDataType={setActiveDataType}
      />

      <Filter/>

      <Box gridArea={'content'} pad={{left: 'small', right: 'small'}} background={'lightBackground'}>
        <Box overflow='auto'>
          <EventsList
            activeType={activeDataType}
            activeEventType={eventTypeFilter}
            selectMode={massEditing}
            selectedIds={selectedIds}
            switchIsIdSelected={switchIsIdSelected}
          />
        </Box>
      </Box>

      <EditingButtons
        isEditingModeActive={massEditing}
        switchEditingMode={() => switchEditingMode(!massEditing)}
        showPopup={() => setShow(true)}
        openCreator={() => {}}
      >
        {massEditing && <ActivateButton eventTypeFilter={eventTypeFilter} activate={() => {}}/>}
      </EditingButtons>

      {show && !massEditing && <NewEventForm close={() => setShow(false)}/>}

      {show && massEditing && (
        <DeletePopup
          closePopup={() => setShow(false)}
          deleteEntities={deleteEntities}
          text={deletePopupText}
        />
      )}
    </Grid>
  );
}

export default CalendarScreen
