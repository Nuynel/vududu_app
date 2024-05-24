import {LitterData, NewLitter, NewLitterFormFields} from "../../g_shared/types";
import * as React from "react";
import {useState, useEffect} from "react";
import {createLitter, getStuds, getPuppies} from "../../g_shared/methods/api";
import {Button, Form, FormField, Heading, Box} from "grommet";
import {newLitterFormConfig} from "./formsConfig";
import {GENDER} from "../../g_shared/types/dog";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {fixTimezone} from "../../g_shared/methods/helpers";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

const initNewLitterData: Pick<NewLitter, NewLitterFormFields> = {
  fatherId: '',
  motherId: '',
  dateOfBirth: '',
  puppyIds: [],
  // puppiesCount: {
  //   male: 0,
  //   female: 0
  // },
  comments: '',
}

// чего нет: profileId, litterId, puppyCardId, puppyCardNumber

const AddNewLitterForm = ({hideCard}: {hideCard: () => void}) => {
  const {pushNewLitter} = useProfileDataStore()
  const [newLitterData, changeNewLitterData] = useState<Pick<NewLitter, NewLitterFormFields>>({...initNewLitterData})
  const {isSmall} = useResponsiveGrid()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth': {
        const dateWithTimezone = fixTimezone(value)
        return changeNewLitterData(
          (prevState): Pick<NewLitter, NewLitterFormFields> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      case 'puppyIds': {
        if (value) {
          if (newLitterData.puppyIds.includes(value)) {
            return changeNewLitterData((prevState): Pick<NewLitter, NewLitterFormFields> => (
              {...prevState, [key]: prevState.puppyIds.filter(id => id !== value)}
            ))
          } else {
            return changeNewLitterData((prevState): Pick<NewLitter, NewLitterFormFields> => (
              {...prevState, [key]: [...prevState.puppyIds, value]}
            ))
          }
        } else {
          return changeNewLitterData((prevState): Pick<NewLitter, NewLitterFormFields> => (
            {...prevState, [key]: []}
          ))
        }
      }
      default: {
        changeNewLitterData((prevState): Pick<NewLitter, NewLitterFormFields> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const [maleDogsList, changeMaleDogsList] = useState<{_id: string, fullName: string}[]>([])
  const [femaleDogsList, changeFemaleDogsList] = useState<{_id: string, fullName: string}[]>([])
  const [puppiesList, changePuppiesList] = useState<{_id: string, fullName: string}[]>([])

  const createLitterData = (): NewLitter => {
    return {
      ...newLitterData,
      registrationId: null,
      litterCardId: null,
    }
  }

  const handleSubmit = () => {
    const litterData = createLitterData()
    createLitter(litterData).then(({litter}: {litter: LitterData}) => {
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
      getPuppies(newLitterData.dateOfBirth).then(({puppies}) => {
        changePuppiesList(puppies)
      })
    }
  }, [newLitterData.dateOfBirth])

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
