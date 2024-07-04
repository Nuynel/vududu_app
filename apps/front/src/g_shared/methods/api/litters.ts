import {checkResponse, URL} from "./index";
import {IncomingLitterData, OutgoingLitterData} from "../../types";

export async function createLitter(data: OutgoingLitterData): Promise<{ litter: IncomingLitterData }> {
  try{
    return await fetch(`${URL}/api/litter`, {
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

export async function getLittersByDate(date: string, breedId: string | null)
  : Promise<{litters: Pick<IncomingLitterData, '_id' | 'litterTitle' | 'dateOfBirth'>[]}> {
  try{
    const queryParams = new URLSearchParams({date, breedId: breedId || ''}).toString();
    return await fetch(`${URL}/api/litters?${queryParams}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateBaseLitterInfo (data: Pick<OutgoingLitterData, 'comments'>, id: string)
  : Promise<{message: string}> {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/litter?${queryParams}`, {
      method: 'PUT',
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

export async function deleteLitter (id: string)
  : Promise<{message: string}> {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/litter?${queryParams}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}
