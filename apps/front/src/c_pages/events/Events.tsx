import * as React from "react";
import {useState} from "react";
import EventsList from "./EventsList";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import ActivateButton from "./uiComponents/ActivateButton";
import EditingButtons from "../../d_widgets/EditingButtons";
import EventFilter from "./uiComponents/EventFilter";
import SubmitActionPopup from "../../e_features/SubmitActionPopup";
import {deleteEventsByIds} from "../../g_shared/methods/api";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import {Paths} from "../../g_shared/constants/routes";
import {useLocation, useRoute} from "wouter";
import PageComponent from "../../d_widgets/PageComponent";

const deletePopupText = 'Вы уверены, что хотите удалить эти события?'

const CalendarScreen = () => {
  const [show, setShow] = useState(false);
  const [massEditing, switchEditingMode] = useState<boolean>(false)
  const [selectedIds, changeSelectedIds] = useState<string[]>([])
  const [matchEventsRoutes] = useRoute(Paths.events)

  // const {columns, rows, areas} = useResponsiveGrid(true);
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

  const headerProps = {
    title: 'calendar',
    back: false,
    submenu: {
      left: {
        path: Paths.events,
        title: 'events',
        isActive: matchEventsRoutes
      },
      right: {
        path: Paths.history,
        title: 'history',
        isActive: !matchEventsRoutes
      }
    }
  }

  return (
    <PageComponent filter headerProps={headerProps}>

    {/*// <Grid*/}
    {/*//   rows={rows}*/}
    {/*//   columns={columns}*/}
    {/*//   areas={areas}*/}
    {/*//   height={'100%'}*/}
    {/*// >*/}
    {/*//   <SectionHeader*/}
    {/*//     activeDataType={activeDataType}*/}
    {/*//     buttons={[*/}
    {/*//       {type: DATA_TYPES.PLANNED, label: 'Планировщик', link: Paths.events},*/}
    {/*//       {type: DATA_TYPES.HISTORY, label: 'История', link: Paths.history},*/}
    {/*//     ]}*/}
    {/*//     isLink={true}*/}
    {/*//     setActiveDataType={setActiveDataType}*/}
    {/*//   />*/}

      <EventFilter/>

      <div className="p-2 bg-gray-100">
        <div className="overflow-auto">
          <EventsList
            activeType={activeDataType}
            activeEventType={eventTypeFilter}
            selectMode={massEditing}
            selectedIds={selectedIds}
            switchIsIdSelected={switchIsIdSelected}
          />
        </div>
      </div>


      {/*<Box gridArea={'content'} pad={{left: 'small', right: 'small'}} background={'lightBackground'}>*/}
      {/*  <Box overflow='auto'>*/}
      {/*    <EventsList*/}
      {/*      activeType={activeDataType}*/}
      {/*      activeEventType={eventTypeFilter}*/}
      {/*      selectMode={massEditing}*/}
      {/*      selectedIds={selectedIds}*/}
      {/*      switchIsIdSelected={switchIsIdSelected}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*</Box>*/}

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
</PageComponent>
  );
}

export default CalendarScreen
