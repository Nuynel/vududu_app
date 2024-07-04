import {useState} from "react";
import {IncomingDogData} from "../../../g_shared/types";
import {validateNewDog} from "../../../g_shared/methods/api";
import {fixTimezone} from "../../../g_shared/methods/helpers";

const initNewDogValidationData: Pick<IncomingDogData, 'dateOfBirth' | 'gender' | 'breedId'> = {
  dateOfBirth: '',
  breedId: null,
  gender: null,
}

const useNewDogValidation = () => {
  const [
    newDogValidationData,
    changeNewDogValidationData,
  ] = useState<Pick<IncomingDogData, 'dateOfBirth' | 'gender' | 'breedId'>>({...initNewDogValidationData})

  const [
    dogDataMatch,
    changeDogDataMatch,
  ] = useState<Pick<IncomingDogData, 'ownerProfileId' | '_id' | 'creatorProfileId' | 'federationId' | 'fullName' | 'dateOfBirth' | 'gender' | 'breedId' | 'name' | 'dateOfDeath' | 'color' | 'isNeutered' | 'litterData'>[] | null>(null)

  const [
    isLoading,
    switchIsLoading
  ] = useState<boolean>(false)

  const handleValidateNewDog = async () => {
    switchIsLoading(true)
    validateNewDog(newDogValidationData).then(async ({dogs}) => {
      changeDogDataMatch(dogs)
      switchIsLoading(false)
    })
  }

  const handleNewDogValChange = (key, value) => {
    changeDogDataMatch(null)
    switch (key) {
      case 'dateOfBirth': {
        const dateWithTimezone = fixTimezone(value);
        return changeNewDogValidationData(
          (prevState): Pick<IncomingDogData, 'dateOfBirth' | 'gender' | 'breedId'> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      default: {
        changeNewDogValidationData((prevState): Pick<IncomingDogData, 'dateOfBirth' | 'gender' | 'breedId'> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  return {
    newDogValidationData,
    handleValidateNewDog,
    dogDataMatch,
    isLoading,
    handleNewDogValChange,
  }
}

export default useNewDogValidation
