import {checkResponse, URL} from "./index";
import {IncomingDogData, OutgoingDogData} from "../../types";
import {GENDER} from "../../types/dog";

export async function createDog(data: Omit<OutgoingDogData, 'litterId'>): Promise<{message: string, dog: IncomingDogData}> {
  try {
    return await fetch(`${URL}/api/dog`, {
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

export async function deleteDog (id: string): Promise<{message: string}> {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/dog?${queryParams}`, {
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

export async function getStuds (searchString: string, gender: GENDER)
  : Promise<{studs: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]}>
{
  try{
    const queryParams = new URLSearchParams({searchString, gender}).toString();
    return await fetch(`${URL}/api/stud?${queryParams}`, {
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

export async function getPuppies (dateOfBirth: string, breedId: string | null)
  : Promise<{puppies: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]}>
{
  try{
    const queryParams = new URLSearchParams({dateOfBirth, breedId: breedId || ''}).toString();
    return await fetch(`${URL}/api/puppies?${queryParams}`, {
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

export async function updateBaseDogInfo (rawDogInfo: OutgoingDogData, id: string, isAssigment: boolean = false): Promise<{message: string}> {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/dog?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({rawDogInfo, isAssigment})
    }).then(r => {
      checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function validateNewDog (
  newDogData: Pick<OutgoingDogData, 'dateOfBirth' | 'gender' | 'breedId'>
): Promise<{dogs: Pick<IncomingDogData, 'ownerProfileId' | '_id' | 'creatorProfileId' | 'federationId' | 'fullName' | 'dateOfBirth' | 'gender' | 'breedId' | 'name' | 'dateOfDeath' | 'color' | 'isNeutered' | 'litterData'>[]}> {
  try {
    const queryParams = new URLSearchParams(newDogData).toString();
    return await fetch(`${URL}/api/validate-new-dog?${queryParams}`, {
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
