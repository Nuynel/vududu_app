import {IncomingDogData, OutgoingLitterData} from "../../g_shared/types";
import * as React from "react";
import {useState, useEffect} from "react";
import {createLitter, getStuds, getPuppies} from "../../g_shared/methods/api";
import {Button, Form, FormField, Heading, Box} from "grommet";
import {newLitterFormConfig} from "./formsConfig";
import {GENDER} from "../../g_shared/types/dog";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {fixTimezone} from "../../g_shared/methods/helpers";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

const initNewLitterData: Omit<OutgoingLitterData, 'litterTitle'> = {
  fatherId: '',
  motherId: '',
  dateOfBirth: '',
  comments: '',
  puppyIds: [],
  breedId: null,
}

const AddNewLitterForm = ({hideCard}: {hideCard: () => void}) => {
  const {pushNewLitter, getBreedById} = useProfileDataStore()
  const [newLitterData, changeNewLitterData] = useState<Omit<OutgoingLitterData, 'litterTitle'>>({...initNewLitterData})
  const {isSmall} = useResponsiveGrid()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth': {
        const dateWithTimezone = fixTimezone(value)
        return changeNewLitterData(
          (prevState): Omit<OutgoingLitterData, 'litterTitle'> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      case 'puppyIds': {
        if (value) {
          if (newLitterData.puppyIds.includes(value)) {
            return changeNewLitterData((prevState): Omit<OutgoingLitterData, 'litterTitle'> => (
              {...prevState, [key]: prevState.puppyIds.filter(id => id !== value)}
            ))
          } else {
            return changeNewLitterData((prevState): Omit<OutgoingLitterData, 'litterTitle'> => (
              {...prevState, [key]: [...prevState.puppyIds, value]}
            ))
          }
        } else {
          return changeNewLitterData((prevState): Omit<OutgoingLitterData, 'litterTitle'> => (
            {...prevState, [key]: []}
          ))
        }
      }
      default: {
        changeNewLitterData((prevState): Omit<OutgoingLitterData, 'litterTitle'> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const [maleDogsList, changeMaleDogsList] = useState<Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]>([])
  const [femaleDogsList, changeFemaleDogsList] = useState<Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]>([])
  const [puppiesList, changePuppiesList] = useState<Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]>([])

  const createLitterData = (): OutgoingLitterData => {
    const fatherFullName = maleDogsList.find((dog) => dog._id === newLitterData.fatherId).fullName
    const motherFullName = femaleDogsList.find((dog) => dog._id === newLitterData.motherId).fullName

    return {
      ...newLitterData,
      litterTitle: `${newLitterData.dateOfBirth}, ${fatherFullName}/${motherFullName}`,
    }
  }

  const handleSubmit = () => {
    const litterData = createLitterData()
    createLitter(litterData).then(({litter}) => {
      pushNewLitter(litter)
      hideCard()
    }).catch((e) =>{
      console.error(e)
    })
  }

  const handleSearch = (searchString: string, gender: GENDER) => {
    if (searchString.length > 0) {
      getStuds(searchString, gender).then(({studs}) => {
        if (gender === GENDER.MALE) changeMaleDogsList(studs)
        if (gender === GENDER.FEMALE) changeFemaleDogsList(studs)
      })
    }
  }

  useEffect(() => {
    if (newLitterData.dateOfBirth) {
      getPuppies(newLitterData.dateOfBirth, newLitterData.breedId).then(({puppies}) => {
        changePuppiesList(puppies)
      })
    }
  }, [newLitterData.dateOfBirth])

  useEffect(() => {
    if (newLitterData.motherId && newLitterData.fatherId) {
      const motherBreed = femaleDogsList.find(stud => stud._id === newLitterData.motherId).breedId;
      const fatherBreed = maleDogsList.find(stud => stud._id === newLitterData.fatherId).breedId;
      if (fatherBreed === motherBreed) {
        handleInputChange('breedId', fatherBreed);
      } else {
        handleInputChange('breedId', null);
      }
    }
  }, [newLitterData.motherId, newLitterData.fatherId])

  return (
    <Box pad={"medium"} width={isSmall ? 'auto' : 'large'}>
      <Heading level={2} margin={"medium"}>Добавить помёт</Heading>
      <Form
        onSubmit={handleSubmit}
        style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
      >
        {['fatherId', 'motherId'].map((key) => {
          const fieldConfig = newLitterFormConfig[key]
          const Field = fieldConfig.component
          const dogsList = key === 'fatherId' ? maleDogsList : femaleDogsList
          return (
            <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
              <Field
                id={fieldConfig.id}
                name={fieldConfig.label}
                value={fieldConfig.valueGetter(dogsList, newLitterData[key])}
                options={dogsList}
                labelKey={fieldConfig.labelKey}
                format={fieldConfig.format}
                placeholder={fieldConfig.placeholder}
                onSearch={(searchString) => fieldConfig.searchHandler(searchString, handleSearch)}
                onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
              />
            </FormField>
          )
        })}
        {['dateOfBirth', 'comments'].map((key) => {
          const fieldConfig = newLitterFormConfig[key]
          const Field = fieldConfig.component
          return (
            <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
              <Field
                id={fieldConfig.id}
                name={fieldConfig.label}
                value={newLitterData[key]}
                format={fieldConfig.format}
                placeholder={fieldConfig.placeholder}
                onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
              />
            </FormField>
          )})}
        {['breedId'].map((key) => {
          const fieldConfig = newLitterFormConfig[key]
          const Field = fieldConfig.component
          return (
            <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
              <Field
                disabled
                id={fieldConfig.id}
                name={fieldConfig.label}
                value={getBreedById(newLitterData[key]).name.rus || 'ERROR'}
                format={fieldConfig.format}
                placeholder={fieldConfig.placeholder}
                onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
              />
            </FormField>
          )})}
        {['puppyIds'].map((key) => {
          const fieldConfig = newLitterFormConfig[key]
          const Field = fieldConfig.component
          return (
            <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
              <Field
                id={fieldConfig.id}
                name={fieldConfig.label}
                value={newLitterData[key].map(puppyId => puppiesList.find(puppy => puppy._id === puppyId))}
                options={puppiesList}
                labelKey={fieldConfig.labelKey}
                format={fieldConfig.format}
                placeholder={fieldConfig.placeholder}
                // onSearch={(searchString) => fieldConfig.searchHandler(searchString, handleSearch)}
                onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
              />
            </FormField>
          )
        })}
        <Button margin='small' type="submit" primary label="Сохранить" alignSelf={"center"} />
      </Form>
    </Box>
);
}

export default AddNewLitterForm
