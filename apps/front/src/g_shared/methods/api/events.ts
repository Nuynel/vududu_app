import {EventData, Treatment, Heat} from "../../types";
import {URL} from "./index";

const eventURLs = {
  HEAT: 'heat',
  ANTIPARASITIC_TREATMENT: 'treatment',
  VACCINATION: 'treatment',
}

export async function createEvent(data: Omit<EventData, '_id' | 'activated'>) {
  try{
    return await fetch(`${URL}/${eventURLs[data.eventType]}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data)
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateHeatInfo (baseHeatInfo: Pick<Heat, 'comments' | 'date' | 'activated'>, id: string) {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/heat?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({baseHeatInfo})
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateTreatmentInfo (baseTreatmentInfo: Pick<Treatment, 'comments' | 'date' | 'activated' | 'validity' | 'medication'>, id: string) {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/treatment?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({baseTreatmentInfo})
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteEventsByIds (eventsIds: string[]) {
  try {
    return await fetch(`${URL}/events`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({eventsIds})
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}
