import React, {useState} from 'react';
import {IncomingDogData} from "../../../../g_shared/types";
import {getFormattedDate} from "../../../../g_shared/methods/helpers";
import SubmitActionPopup from "../../../../e_features/SubmitActionPopup";

const dogOwningDisputeText = 'Пожалуйста, напишите в службу поддержки vududu_support@vududu.ru. Укажите данные собаки (кличку, пол, дату рождения и породу), прикрепите доказательства владения собакой и мы рассмотрим Вашу заявку'

type DetailedIncomingDogData = Pick<IncomingDogData, '_id' | 'ownerProfileId' | 'creatorProfileId' | 'litterData' | 'federationId' | 'name' | 'fullName' | 'dateOfBirth' | 'dateOfDeath' | 'breedId' | 'gender' | 'color' | 'isNeutered'>

type DogListProps = {
  dogs: DetailedIncomingDogData[] | null;
  onSelectDog: (dogId: string | null) => void;
};

const DogList: React.FC<DogListProps> = ({ dogs, onSelectDog }) => {
  const [showPopup, switchShowPopup] = useState<boolean>(false)
  return (
    <div className="space-y-4 bg-white p-6 mx-4 rounded-xl shadow-md">
      {dogs && dogs.length > 0 ? (
        <div className="flex flex-col">
          <h2 className="text-lg font-medium mb-2">Найденные собаки:</h2>
          <ul className="space-y-2">
            {dogs.map((dog) => (
              <li
                key={dog._id}
                className="p-4 border border-gray-300 rounded-md"
              >
                <div className="flex flex-col justify-between items-center w-full">
                  <div className="w-full">
                    <p>
                      <strong>Кличка:</strong> {dog.fullName}
                    </p>
                    <p>
                      <strong>Дата рождения:</strong> {getFormattedDate(new Date(dog.dateOfBirth))}
                    </p>
                    {dog.ownerProfileId && (<p className="text-rose-600"><strong> Собака уже закреплена за владельцем </strong></p>)}
                  </div>
                  {dog.ownerProfileId ? (
                    <button
                      onClick={() => switchShowPopup(true)}
                      className={`mt-2 px-4 py-2 rounded-full text-white bg-gray-400`}
                    >
                      Оспорить владение
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectDog(dog._id)}
                      className={`mt-2 px-4 py-2 rounded-full text-white bg-green-600`}
                    >
                      Это моя собака
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelectDog(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full self-center w-full"
          >
            Моей собаки нет в списке
          </button>
        </div>
      ) : (
        <>
          <p>Собаки не обнаружены.</p>
          <button
            onClick={() => onSelectDog(null)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            Добавить новую собаку
          </button>
        </>
      )}
      {showPopup && (
        <SubmitActionPopup
          text={dogOwningDisputeText}
          closePopup={() => switchShowPopup(false)}
        />
      )}
    </div>
  );
};

export default DogList;
