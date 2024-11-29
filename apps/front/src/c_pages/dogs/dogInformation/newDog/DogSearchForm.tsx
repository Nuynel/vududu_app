import React, {useState} from 'react';
import { useForm, Control, useController } from 'react-hook-form';
import {GENDER} from "../../../../g_shared/types/dog";
import {Breed} from "../../../../g_shared/types";
import BreedSelect from "../../../../e_features/BreedSelect";
import {CustomSelect, CustomSpinner} from "../../../../g_shared/ui_components";
import {fixTimezone} from "../../../../g_shared/methods/helpers";

type DogSearchFormProps = {
  onSearch: (data: DogSearchFormData) => void;
  breeds: Breed[];
  isLoading: boolean
};

type DogSearchFormData = {
  dateOfBirth: string;
  breedId: string | null;
  gender: GENDER | null;
};

const DogSearchForm: React.FC<DogSearchFormProps> = ({ onSearch, breeds, isLoading }) => {
  const { register, handleSubmit, setValue, control } = useForm<DogSearchFormData>();

  const onSubmit = (data: DogSearchFormData) => {
    onSearch({...data, dateOfBirth: fixTimezone(data.dateOfBirth)});
  };

  const breedRegister = register('breedId', { required: true });

  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name: 'gender',
    control,
    rules: {required: true},
    defaultValue: GENDER.MALE,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 mx-4 rounded-xl shadow-md">
      {/* Дата рождения */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium">
          Дата рождения
        </label>
        <input
          type="date"
          id="dateOfBirth"
          {...register('dateOfBirth', { required: true })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Порода */}
      <div>
        <label htmlFor="breedId" className="block text-sm font-medium">
          Порода
        </label>
        <BreedSelect
          breeds={breeds}
          register={breedRegister}
          setValue={(value: string) => setValue('breedId', value)}
        />
      </div>

      {/* Пол */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium">
          Пол
        </label>
        <CustomSelect
          options={[
            {value: '', label: 'Выберите пол'},
            {value: 'MALE', label: 'Кобель'},
            {value: 'FEMALE', label: 'Сука'}
          ]}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex justify-center items-center"
      >
        Поиск
        {isLoading && <CustomSpinner />}
      </button>
    </form>
  );
};

export default DogSearchForm;
