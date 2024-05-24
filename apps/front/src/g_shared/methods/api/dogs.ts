import {URL} from "./index";
import {BaseDogInfo, NewDog} from "../../types";
import {GENDER} from "../../types/dog";

export async function createDog(data: Omit<NewDog, 'profileId' | 'litterTitle'>) {
  try{
    return await fetch(`${URL}/api/dog`, {
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

export async function deleteDog (id: string) {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/dog?${queryParams}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getStuds (searchString: string, gender: GENDER) {
  try{
    const queryParams = new URLSearchParams({searchString, gender}).toString();
    return await fetch(`${URL}/api/stud?${queryParams}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getPuppies (dateOfBirth: string) {
  try{
    const queryParams = new URLSearchParams({dateOfBirth}).toString();
    return await fetch(`${URL}/api/puppies?${queryParams}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateBaseDogInfo (baseDogInfo: BaseDogInfo, id: string) {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/api/dog?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({baseDogInfo})
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}
