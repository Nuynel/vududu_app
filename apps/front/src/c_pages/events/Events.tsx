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
import {Route, useLocation} from "wouter";
import PageComponent from "../../d_widgets/PageComponent";
import {DATA_TYPES} from "../../g_shared/types/event";

const deletePopupText = 'Вы уверены, что хотите удалить эти события?'

const CalendarScreen = () => {
  const [show, setShow] = useState(false);
  const [selectedIds, changeSelectedIds] = useState<string[]>([])

  // const {columns, rows, areas} = useResponsiveGrid(true);
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
    <PageComponent filter>

      <EventFilter/>

      {/*<div className='h-full'>*/}
        <Route path={Paths.events_short}>
          <EventsList
            activeType={DATA_TYPES.PLANNED}
            selectedIds={selectedIds}
            switchIsIdSelected={switchIsIdSelected}
            showPopup={(value) => setShow(value)}
          />
        </Route>
        <Route path={Paths.history_short}>
          <EventsList
            activeType={DATA_TYPES.HISTORY}
            selectedIds={selectedIds}
            switchIsIdSelected={switchIsIdSelected}
            showPopup={(value) => setShow(value)}
          />
        </Route>
      {/*</div>*/}

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
