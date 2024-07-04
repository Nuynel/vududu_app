import {checkResponse, URL} from "./index";
import {Breed} from "../../types";

export async function getBreeds (searchString: string, signal: AbortSignal): Promise<{breeds: Breed[]}> {
  const queryParams = new URLSearchParams({searchString}).toString();
  return await fetch(`${URL}/api/breeds?${queryParams}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    signal,
  }).then(r => {
    checkResponse(r)
    return r.json()
  })
}

export async function createBreed(data: Pick<Breed, 'name'> & {breedDescription: string}) {
  try{
    return await fetch(`${URL}/api/breed`, {
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
