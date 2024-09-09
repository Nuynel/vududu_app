import * as React from "react";
import {useState} from "react";
import {Box, Grid} from "grommet";
import EventsList from "./EventsList";
import SectionHeader from "../../e_features/SectionHeader";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import {DATA_TYPES} from "../../g_shared/types/event";
import ActivateButton from "./uiComponents/ActivateButton";
import EditingButtons from "../../d_widgets/EditingButtons";
import EventFilter from "./uiComponents/EventFilter";
import SubmitActionPopup from "../../e_features/SubmitActionPopup";
import {deleteEventsByIds} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {Paths} from "../../g_shared/constants/routes";
import {useLocation} from "wouter";

const deletePopupText = 'Вы уверены, что хотите удалить эти события?'

const CalendarScreen = () => {
  const [show, setShow] = useState(false);
  const [massEditing, switchEditingMode] = useState<boolean>(false)
  const [selectedIds, changeSelectedIds] = useState<string[]>([])

  const {columns, rows, areas} = useResponsiveGrid(true);
  const {eventTypeFilter, activeDataType, setActiveDataType} = useUIStateStore()
  const [, setLocation] = useLocation();

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
          {type: DATA_TYPES.PLANNED, label: 'Планировщик', link: Paths.events},
          {type: DATA_TYPES.HISTORY, label: 'История', link: Paths.history},
        ]}
        isLink={true}
        setActiveDataType={setActiveDataType}
      />

      <EventFilter/>

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
        openCreator={() => setLocation(Paths.event_creator)}
      >
        {massEditing && <ActivateButton eventTypeFilter={eventTypeFilter} activate={() => {}}/>}
      </EditingButtons>

      {show && (
        <SubmitActionPopup
          closePopup={() => setShow(false)}
          submitButtonText={'Удалить'}
          submitAction={deleteEntities}
          text={deletePopupText}
        />
      )}
    </Grid>
  );
}

export default CalendarScreen
