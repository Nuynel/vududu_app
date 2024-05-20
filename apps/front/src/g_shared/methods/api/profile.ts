import {URL} from "./index";
import {PROFILE_TYPES} from "../../../c_pages/profile/CreateProfile";
import {ProfileData} from "../../types";

type ConnectedOrganisations = {
  canineFederation: string | null,
  nationalBreedClub: string | null,
  canineClub: string | null,
  kennel: string | null,
}

type NewProfile = {
  name: string,
  type: PROFILE_TYPES,
  connectedOrganisations: ConnectedOrganisations
}

export async function createProfile(data: NewProfile) {
  try{
    return await fetch(`${URL}/api/profile`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
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

export async function getProfile(): Promise<{ profileData: ProfileData }> {
  try {
    return await fetch(`${URL}/api/profile`, {
      method: 'GET',
      headers: {
        "content-type": "application/json",
      },
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}


