import {ReactNode, useState} from 'react';
import {ChevronDownIcon, ChevronUpIcon} from '../icons';

const Accordion = ({children, title}: { children: ReactNode, title: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white p-4 m-2 rounded-lg shadow-md">
    {/*<div className="w-full mx-auto bg-white border border-gray-300 rounded-md">*/}
      <button
        onClick={toggleAccordion}
        className="w-full px-4 py-2 text-left rounded-md flex justify-between items-center focus:outline-none"
      >
        <span className="text-lg font-medium">{title}</span>
        {isOpen ? <ChevronUpIcon color='black'/> : <ChevronDownIcon color='black'/>}
      </button>
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
