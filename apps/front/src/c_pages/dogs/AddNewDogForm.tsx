import {Button, Form, FormField, Heading, Box} from "grommet";
import {newDogFormConfig} from "./formsConfig";
import * as React from "react";
import {useState} from "react";
import {
  DogData,
  NewDog,
  NewDogFormFields
} from "../../g_shared/types";
import {createDog} from "../../g_shared/methods/api";
import {fixTimezone} from "../../g_shared/methods/helpers";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

const initNewDogData: Pick<NewDog, NewDogFormFields> = {
  name: '',
  fullName: '',
  dateOfBirth: '',
  breed: '',
  gender: null,
  microchipNumber: '',
  tattooNumber: '',
  pedigreeNumber: '',
  color: '',
  isNeutered: false,
}

// ToDo просле добавления собаки на сервер надо либо добавлять его локально, либо перезапрашивать список собак

// чего нет: profileId, litterId, puppyCardId, puppyCardNumber

const AddNewDogForm = ({hideCard}: {hideCard: () => void}) => {
  const [newDogData, changeNewDogData] = useState<Pick<NewDog, NewDogFormFields>>({...initNewDogData})

  const {pushNewDog} = useProfileDataStore()

  const {isSmall} = useResponsiveGrid()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth': {
        const dateWithTimezone = fixTimezone(value);
        return changeNewDogData(
          (prevState): Pick<NewDog, NewDogFormFields> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      default: {
        changeNewDogData((prevState): Pick<NewDog, NewDogFormFields> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const createDogData = (): Omit<NewDog, 'profileId' | 'litterTitle'> => {
    return {
      ...newDogData,
      litterId: null,
      puppyCardId: null,
      puppyCardNumber: null,
    }
  }

  const handleSubmit = () => {
    const dogData = createDogData()
    createDog(dogData)
      .then(({dog}: {dog: DogData}) => {
        pushNewDog(dog)
        hideCard()
      })
      .catch((e) =>{ console.error(e) })
  }

  return (
    <Box pad={"medium"} width={isSmall ? 'auto' : 'large'}>
      <Heading level={2} margin={"medium"}>Добавить собаку</Heading>
      <Form
        onSubmit={handleSubmit}
        style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
      >
        {Object.keys(initNewDogData).map((key) => {
          const fieldConfig = newDogFormConfig[key]
          const Field = fieldConfig.component
          return (
            <FormField
              key={fieldConfig.id}
              name={fieldConfig.label}
              htmlFor={fieldConfig.id}
              label={fieldConfig.label}
            >
              <Field
                id={fieldConfig.id}
                name={fieldConfig.label}
                value={newDogData[key]}
                format={fieldConfig.format}
                options={fieldConfig.options}
                placeholder={fieldConfig.placeholder}
                onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
              />
            </FormField>
          )
        })}
        <Button margin='small' type="submit" primary label="Сохранить" />
      </Form>
    </Box>
  );
}

export default AddNewDogForm
