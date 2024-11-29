import React, { useState, useEffect, useRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import {Breed} from "../g_shared/types";

type BreedSelectProps = {
  breeds: Breed[];
  register: UseFormRegisterReturn;
  setValue: (value: string) => void;
};

const BreedSelect: React.FC<BreedSelectProps> = ({ breeds, register, setValue }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>(breeds);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBreeds(breeds);
    } else {
      setFilteredBreeds(
        breeds.filter((breed) =>
          breed.name.rus.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, breeds]);

  const handleSelect = (breedId: string, breedName: string) => {
    setSearchTerm(breedName);
    setIsDropdownOpen(false);
    setValue(breedId);
  };

  // Закрытие дропдауна при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.parentElement?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        type="text"
        {...register}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        placeholder="Начните вводить породу..."
        autoComplete="off"
        ref={inputRef}
      />
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-lg">
          {filteredBreeds.length > 0 ? (
            filteredBreeds.map((breed) => (
              <li
                key={breed._id}
                onClick={() => handleSelect(breed._id || '', breed.name.rus)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {breed.name.rus}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">Порода не найдена</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default BreedSelect;
