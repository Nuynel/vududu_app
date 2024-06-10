import {checkResponse, URL} from "./index";
import {Breed} from "../../types";

export async function getBreeds (searchString: string = ''): Promise<{breeds: Breed[]}> {
  try{
    const queryParams = new URLSearchParams({searchString}).toString();
    return await fetch(`${URL}/api/breeds?${queryParams}`, {
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
