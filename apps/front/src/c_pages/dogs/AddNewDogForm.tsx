import {Button, Form, FormField, Heading, Box, Text, Select} from "grommet";
import {newDogFormConfig} from "./formsConfig";
import * as React from "react";
import {useEffect, useState} from "react";
import {
  Breed,
  OutgoingDogData,
} from "../../g_shared/types";
import {createDog} from "../../g_shared/methods/api";
import {fixTimezone} from "../../g_shared/methods/helpers";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import {useBreeds} from "../../f_entities/hooks/useBreeds";

const initNewDogData: Omit<OutgoingDogData, 'litterId'> = {
  name: '',
  fullName: '',
  dateOfBirth: '',
  dateOfDeath: '',
  breedId: null,
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
  const [newDogData, changeNewDogData] = useState<Omit<OutgoingDogData, 'litterId'>>({...initNewDogData})
  const {pushNewDog} = useProfileDataStore()
  const {breeds, getAllBreeds, searchBreeds} = useBreeds();
  const {getInitialData} = useGetInitialData()

  const {isSmall} = useResponsiveGrid()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth': {
        const dateWithTimezone = fixTimezone(value);
        return changeNewDogData(
          (prevState): Omit<OutgoingDogData, 'litterId'> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      default: {
        changeNewDogData((prevState): Omit<OutgoingDogData, 'litterId'> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const handleSubmit = () => {
    createDog(newDogData)
      .then(async ({dog}) => {
        pushNewDog(dog)
        return await getInitialData()
      })
      .then(() => {
        hideCard()
      })
      .catch((e) =>{ console.error(e) })
  }

  useEffect(() => getAllBreeds(), [])

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
          if (key === 'breedId') return (
            <Box key={fieldConfig.id}>
              <FormField
                name={fieldConfig.label}
                htmlFor={fieldConfig.id}
                label={fieldConfig.label}
              >
                <Select
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={breeds.find(breed => breed._id === newDogData.breedId)}
                  options={breeds}
                  labelKey={(elem: Breed) => elem.name ? elem.name.rus : ''}
                  onSearch={(searchString) => searchBreeds(searchString)}
                  placeholder='Название породы'
                  onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                />
              </FormField>
              <Text size={"small"} margin={{bottom: 'small'}}>
                Если вашей породы нет в списке, вы можете добавить её в профиле
              </Text>
            </Box>
          )

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
