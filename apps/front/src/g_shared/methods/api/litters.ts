import {URL} from "./index";
import {NewLitter} from "../../types";

export async function createLitter(data: NewLitter) {
  try{
    return await fetch(`${URL}/litter`, {
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

export async function getLittersByDate(date: string) {
  try{
    const queryParams = new URLSearchParams({date}).toString();
    return await fetch(`${URL}/litters?${queryParams}`, {
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

export async function updateBaseLitterInfo (baseLitterInfo: {comments: string}, id: string) {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/litter?${queryParams}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({baseLitterInfo})
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteLitter (id: string) {
  try {
    const queryParams = new URLSearchParams({id}).toString();
    return await fetch(`${URL}/litter?${queryParams}`, {
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
