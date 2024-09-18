import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import * as RU from './translations/ru.json'
import * as EN from './translations/en.json'

export enum LANGUAGES { RU = 'ru', EN = 'en' }

const translations = {
  [LANGUAGES.EN]: EN,
  [LANGUAGES.RU]: RU,
};

interface TranslationContextType {
  translate: (key: string) => string;
  setLanguage: Dispatch<SetStateAction<string>>; // Правильный тип для setLanguage
  language: LANGUAGES; // Добавляем текущее значение языка в интерфейс
}

const defaultValue: TranslationContextType = {
  translate: (key) => key,
  setLanguage: () => {},
  language: LANGUAGES.RU, // Добавляем текущее значение языка в интерфейс
};

const TranslationContext = createContext<TranslationContextType>(defaultValue);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(LANGUAGES.RU); // Язык по умолчанию

  const translate = (key: string) => {
    return translations[language][key] || key; // Если перевод не найден, возвращаем ключ
  };

  return (
    <TranslationContext.Provider value={{ translate, setLanguage, language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
