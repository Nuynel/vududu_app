import {checkResponse, URL} from "./index";
import {Pedigree} from '../../types'

export async function getPedigreeByDogId({id, type}: {id: string, type: 'COMMON' | 'EXTENDED'}): Promise<{pedigree: Pedigree}> {
  try {
    const queryParams = new URLSearchParams({id, type}).toString();
    return await fetch(`${URL}/api/pedigree?${queryParams}`, {
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
