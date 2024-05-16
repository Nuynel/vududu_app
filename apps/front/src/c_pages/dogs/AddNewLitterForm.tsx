import {LitterData, NewLitter, NewLitterFormFields} from "../../g_shared/types";
import * as React from "react";
import {useState} from "react";
import {createLitter, getStuds} from "../../g_shared/methods/api";
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
      default: {
        changeNewLitterData((prevState): Pick<NewLitter, NewLitterFormFields> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const [maleDogsList, changeMaleDogsList] = useState<{_id: string, fullName: string}[]>([])
  const [femaleDogsList, changeFemaleDogsList] = useState<{_id: string, fullName: string}[]>([])

  const createLitterData = (): NewLitter => {
    return {
      ...newLitterData,
      registrationId: null,
      puppyIds: [],
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
    if (searchString.length > 2) {
      getStuds(searchString, gender).then(({studs}) => {
        if (gender === GENDER.MALE) changeMaleDogsList(studs)
        if (gender === GENDER.FEMALE) changeFemaleDogsList(studs)
      })
    }
  }

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
        <Button margin='small' type="submit" primary label="Сохранить" alignSelf={"center"} />
      </Form>
    </Box>
);
}

export default AddNewLitterForm
