import {OutgoingTreatmentData, OutgoingHeatData, IncomingEventData} from "../../types";
import {checkResponse, URL} from "./index";

const eventURLs = {
  HEAT: 'heat',
  ANTIPARASITIC_TREATMENT: 'treatment',
  VACCINATION: 'treatment',
}

type CreateEventData = Omit<(OutgoingTreatmentData | OutgoingHeatData), '_id' | 'activated' | 'profileId'>

export async function createEvent(data: CreateEventData)
  : Promise<{message: string, newEvents: IncomingEventData[]}>{
  try{
    return await fetch(`${URL}/api/${eventURLs[data.eventType]}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data)
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateHeatInfo (baseHeatInfo: Pick<OutgoingHeatData, 'comments' | 'date' | 'activated'>, id: string)
  : Promise<{message: string}>{
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/heat?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({baseHeatInfo})
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateTreatmentInfo (baseTreatmentInfo: Pick<OutgoingTreatmentData, 'comments' | 'date' | 'activated' | 'validity' | 'medication'>, id: string)
  : Promise<{message: string}> {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/treatment?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({baseTreatmentInfo})
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteEventsByIds (eventsIds: string[]): Promise<{message: string}> {
  try {
    return await fetch(`${URL}/api/events`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({eventsIds})
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}
