import React, { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import {Breed, IncomingDogData, IncomingLitterData} from "../../../../g_shared/types";
import { CustomSelect } from "../../../../g_shared/ui_components";
import {GENDER} from "../../../../g_shared/types/dog";
import {formatSingleDate} from "../../../../g_shared/methods/helpers";

type DetailedIncomingDogData = Pick<IncomingDogData, '_id' | 'ownerProfileId' | 'creatorProfileId' | 'litterData' | 'federationId' | 'name' | 'fullName' | 'dateOfBirth' | 'dateOfDeath' | 'breedId' | 'gender' | 'color' | 'isNeutered'>


type DogDetailsFormProps = {
  onSubmit: (data: DogDetailsFormData) => void;
  litters: Pick<IncomingLitterData, '_id' | 'litterTitle' | 'dateOfBirth'>[];
  selectedDogData: DetailedIncomingDogData | null;
  dogValidationData: Pick<IncomingDogData, 'dateOfBirth' | 'breedId' | 'gender'>; // Данные поиска
  breeds: Breed[];
};

type DogDetailsFormData = {
  name: string;
  fullName: string;
  dateOfDeath: string | null;
  microchipNumber: string | null;
  tattooNumber: string | null;
  pedigreeNumber: string | null;
  color: string | null;
  isNeutered: boolean;
  litterId: string | null;
  breedId: string | null;
  gender: GENDER | null;
  dateOfBirth: string;
};

const DogDetailsForm: React.FC<DogDetailsFormProps> = ({ onSubmit, litters, selectedDogData, dogValidationData, breeds }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<DogDetailsFormData>({
    defaultValues: {
      ...selectedDogData,
      breedId: selectedDogData?.breedId || dogValidationData.breedId,
      gender: selectedDogData?.gender || dogValidationData.gender,
      dateOfBirth: selectedDogData?.dateOfBirth || dogValidationData.dateOfBirth,
    }
  });

  const [showDateOfDeath, switchShowDateOfDeath] = useState<boolean>(false);

  // Отслеживаем значения полей для валидации
  const microchipNumber = watch('microchipNumber');
  const tattooNumber = watch('tattooNumber');
  const pedigreeNumber = watch('pedigreeNumber');

  const handleFormSubmit = (data: DogDetailsFormData) => {
    // Кастомная валидация: проверяем, что заполнено хотя бы одно из полей
    if (!data.microchipNumber && !data.tattooNumber && !data.pedigreeNumber) {
      const errorMessage =
        'Необходимо заполнить хотя бы одно из полей: Номер микрочипа, Номер тату, Номер родословной';

      // Устанавливаем ошибки для соответствующих полей
      setError('microchipNumber', { type: 'manual', message: errorMessage });
      setError('tattooNumber', { type: 'manual', message: errorMessage });
      setError('pedigreeNumber', { type: 'manual', message: errorMessage });
      return; // Останавливаем отправку формы
    } else {
      // Очищаем ошибки, если они были
      clearErrors(['microchipNumber', 'tattooNumber', 'pedigreeNumber']);
    }

    // Вызываем переданный обработчик отправки данных
    onSubmit(data);
  };

  // Используем useController для управления CustomSelect
  const {
    field: { onChange: onLitterChange, onBlur: onLitterBlur, value: litterValue },
  } = useController({
    name: 'litterId',
    control,
    rules: { required: false },
    defaultValue: null,
  });

  const getOptionsByLitters = () => {
    const defaultOption = [{ value: null, label: 'Помет не выбран' }];
    const optionsFromLitters = litters.map((litter) => ({
      value: litter._id,
      label: `${litter.litterTitle} - ${litter.dateOfBirth}`,
    }));
    return [...defaultOption, ...optionsFromLitters];
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 bg-white p-6 mx-4 rounded-xl shadow-md"
    >
      {/* Пол, Порода и Дата рождения (заблокированные поля) */}
      <div>
        <label className="block text-sm font-medium">Пол</label>
        <input
          type="text"
          value={selectedDogData?.gender || dogValidationData.gender}
          disabled
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Порода</label>
        <input
          type="text"
          value={breeds.find(b => b._id === (selectedDogData?.breedId || dogValidationData.breedId))?.name.rus || ''}
          disabled
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Дата рождения</label>
        <input
          type="date"
          value={formatSingleDate(selectedDogData?.dateOfBirth || dogValidationData.dateOfBirth)}
          disabled
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
        />
      </div>


      {/* Имя */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Кличка
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Это поле обязательно для заполнения' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      {/* Полное имя */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">
          Полное имя
        </label>
        <input
          type="text"
          id="fullName"
          {...register('fullName')}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Чекбокс для отображения поля "Дата смерти" */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showDateOfDeath"
          checked={showDateOfDeath}
          onChange={() => switchShowDateOfDeath(!showDateOfDeath)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="showDateOfDeath" className="ml-2 block text-sm">
          Внести дату смерти
        </label>
      </div>

      {/* Дата смерти */}
      {showDateOfDeath && (
        <div>
          <label htmlFor="dateOfDeath" className="block text-sm font-medium">
            Дата смерти
          </label>
          <input
            type="date"
            id="dateOfDeath"
            {...register('dateOfDeath')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      )}

      {/* Окрас */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium">
          Окрас
        </label>
        <input
          type="text"
          id="color"
          {...register('color')}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Кастрирован */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isNeutered"
          {...register('isNeutered')}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isNeutered" className="ml-2 block text-sm">
          Кастрирован
        </label>
      </div>

      {/* Данные помёта */}
      <div>
        <label htmlFor="litterId" className="block text-sm font-medium">
          Помёт
        </label>
        <CustomSelect
          options={getOptionsByLitters()}
          value={litterValue}
          onChange={onLitterChange}
          onBlur={onLitterBlur}
        />
      </div>

      {/* Поля "Номер микрочипа" и "Номер тату" с сообщением */}
      <div className="border border-gray-300 rounded-md p-4 space-y-4">
        <p className="text-sm text-gray-700 mb-2">
          Заполняя как минимум одно из этих полей, вы подтверждаете, что являетесь законным владельцем данной собаки. В соответствии с правилами сайта присвоение себе чужих собак запрещено.
        </p>

        {/* Номер микрочипа */}
        <div>
          <label htmlFor="microchipNumber" className="block text-sm font-medium">
            Номер микрочипа
          </label>
          <input
            type="text"
            id="microchipNumber"
            {...register('microchipNumber')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Номер тату */}
        <div>
          <label htmlFor="tattooNumber" className="block text-sm font-medium">
            Номер тату
          </label>
          <input
            type="text"
            id="tattooNumber"
            {...register('tattooNumber')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Номер родословной */}
        <div>
          <label htmlFor="pedigreeNumber" className="block text-sm font-medium">
            Номер родословной
          </label>
          <input
            type="text"
            id="pedigreeNumber"
            {...register('pedigreeNumber')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.pedigreeNumber && (
            <span className="text-red-500 text-sm">{errors.pedigreeNumber.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex justify-center items-center"
      >
        Сохранить
      </button>
    </form>
  );
};

export default DogDetailsForm;

