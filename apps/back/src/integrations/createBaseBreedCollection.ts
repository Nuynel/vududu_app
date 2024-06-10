import {MongoClient} from "mongodb";
import {COLLECTIONS, DB_NAME, FIELDS_NAMES} from "../constants";
import {Breed} from "../types";
import BREEDS from "../constants/base_breeds.json";
import {BREED_STATUSES} from "../types/breed";
import {insertEntity} from "../methods";

type RawBreedData = {name: {rus: string, eng: string}, group: number | null}

const findBreedByName = async<T extends Document>(
  client: MongoClient,
  name: string,
) => {
  console.log(name)
  return await client
    .db(DB_NAME)
    .collection<Breed>(COLLECTIONS.BREEDS)
    .findOne({ [FIELDS_NAMES.BREED_NAME_ENG]: name })
}

export const createBaseBreedCollection = async (client: MongoClient) => {
    return await Promise.all(BREEDS.map(async (rawBreedData: RawBreedData) => {
        const breedTemplate: Breed = {
            group: null,
            organisations: [],
            status: BREED_STATUSES.APPROVED,
            issueId: null,
            standard: null,
            images: null,
            name: {
                rus: '',
                eng: '',
            }
        }
        const breedData: Breed = {
            ...breedTemplate,
            ...rawBreedData,
        }
        const databaseBreed = await findBreedByName(client, breedData.name.eng)
        if (!databaseBreed) await insertEntity(client, COLLECTIONS.BREEDS, breedData)
    }))
}
