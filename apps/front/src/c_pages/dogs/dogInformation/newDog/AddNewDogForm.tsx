import React, { useState, useEffect } from 'react';
import DogSearchForm from './DogSearchForm';
import DogList from './DogList';
import DogDetailsForm from './DogDetailsForm';
import {Breed, IncomingDogData, IncomingLitterData, OutgoingDogData} from "../../../../g_shared/types";
import {createDog, getBreeds, updateBaseDogInfo, validateNewDog} from "../../../../g_shared/methods/api";
import {CROSSBREED} from "../../../../g_shared/types/breed";
import useGetInitialData from "../../../../f_entities/hooks/useGetInitialData";

type DetailedIncomingDogData = Pick<IncomingDogData, '_id' | 'ownerProfileId' | 'creatorProfileId' | 'litterData' | 'federationId' | 'name' | 'fullName' | 'dateOfBirth' | 'dateOfDeath' | 'breedId' | 'gender' | 'color' | 'isNeutered'>

const AddNewDogForm: React.FC = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [litters, setLitters] = useState<Pick<IncomingLitterData, '_id' | 'litterTitle' | 'dateOfBirth'>[]>([]);
  const [foundDogs, setFoundDogs] = useState<DetailedIncomingDogData[] | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [selectedDogData, setSelectedDogData] = useState<DetailedIncomingDogData | null>(null);
  const [showDetailsForm, setShowDetailsForm] = useState<boolean>(false);
  const [baseDogInfo, setBaseDogInfo] = useState<Pick<IncomingDogData, 'dateOfBirth' | 'breedId' | 'gender'> | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {getInitialData} = useGetInitialData()

  // Получение списка пород
  useEffect(() => {
    getAllBreeds();
  }, []);

  const getAllBreeds = () => {
     getBreeds('', new AbortController().signal)
      .then(({ breeds: newBreeds }) =>
        setBreeds([...newBreeds, CROSSBREED])
      )
      .catch((e) => console.error(e));
  };

  // Обработка поиска собак
  const handleSearch = (data: Pick<OutgoingDogData, 'dateOfBirth' | 'gender' | 'breedId'>) => {
    setIsLoading(true)
    validateNewDog(data)
      .then(({ dogs }) => {
        setFoundDogs(dogs)
        setBaseDogInfo(data)
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };

  // Обработка выбора собаки
  const handleSelectDog = (dogId: string | null) => {
    setSelectedDogId(dogId);
    setSelectedDogData(foundDogs.find(({_id}) => _id === dogId))
    setShowDetailsForm(true);
  };

  // Обработка отправки детальной формы
  const handleDetailsSubmit = (data) => {
    const newDog: OutgoingDogData = {
      ...data,
      breedId: baseDogInfo.breedId,
      gender: baseDogInfo.gender,
      dateOfBirth: baseDogInfo.dateOfBirth,
    };

    const dogPromise = selectedDogId
      ? updateBaseDogInfo(newDog, selectedDogId, true)
      : createDog(newDog);

    dogPromise
      .then(async () => await getInitialData())
      .then(() => window.history.back())
      .catch((e) => console.error(e));
  };

  return (
    <div className="space-y-4 py-4">
      {!showDetailsForm && (
        <DogSearchForm onSearch={handleSearch} breeds={breeds} isLoading={isLoading} />
      )}

      {foundDogs !== null && !showDetailsForm && (
        <DogList dogs={foundDogs} onSelectDog={handleSelectDog} />
      )}

      {showDetailsForm && (
        <DogDetailsForm
          onSubmit={handleDetailsSubmit}
          litters={litters}
          selectedDogData={selectedDogData}
          dogValidationData={baseDogInfo}
          breeds={breeds}
        />
      )}
    </div>
  );
};

export default AddNewDogForm;
