import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../icons'; // Можем использовать react-icons для стрелки

const CustomSelect = ({ options, value, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (option) => {
    setValue(option.value);
    setIsOpen(false);
  };

  const DynamicIcon = isOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className="relative w-full">
      {/* Кнопка для селекта */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm flex justify-between items-center focus:outline-none"
      >
        <span>{options.find((option) => option.value === value)?.label || 'Выберите фильтр'}</span>
        <DynamicIcon color='black'/>
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-1 max-h-60 bg-white border border-gray-300 rounded-md shadow-lg overflow-auto z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelectOption(option)}
              className={`cursor-pointer py-2 px-3 hover:bg-gray-100 ${
                value === option.value ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
