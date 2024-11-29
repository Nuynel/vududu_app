import React, { useState, useRef, useEffect } from 'react';
import {useTranslation, LANGUAGES} from "../f_entities/contexts/i18n"
import {ChevronDownIcon} from "../g_shared/icons";

// todo разобраться с пропсами, а то хня какая-то

const LanguageSelect = ({small, bottom}: {small?: boolean, bottom?: boolean}) => {
  const { setLanguage, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (language: LANGUAGES) => {
    setLanguage(language);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);;
  }, []);

  return (
    <div className={small && "absolute top-8 right-8 "} ref={dropdownRef}>
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex justify-center items-center w-full h-8 rounded-md border border-gray-500 shadow-sm px-2 bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {language === LANGUAGES.RU ? 'Русский' : 'English'}
          <span
            className={`ml-2 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <ChevronDownIcon color='#6B7280' />
          </span>
        </button>

        {isOpen && (
          <div
            className={`origin-top-right absolute ${
              bottom ? 'bottom-full mb-2' : 'top-full mt-2'
            } right-0 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                className={`block px-4 py-2 w-full text-sm ${
                  language === LANGUAGES.RU
                    ? 'text-indigo-600 font-semibold'
                    : 'text-gray-700'
                } hover:bg-gray-200 hover:text-gray-900`}
                role="menuitem"
                onClick={() => handleLanguageChange(LANGUAGES.RU)}
              >
                Русский
              </button>

              <button
                className={`block px-4 py-2 w-full text-sm ${
                  language === LANGUAGES.EN
                    ? 'text-indigo-600 font-semibold'
                    : 'text-gray-700'
                } hover:bg-gray-200 hover:text-gray-900`}
                role="menuitem"
                onClick={() => handleLanguageChange(LANGUAGES.EN)}
              >
                English
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelect;
