/*
TODO: Выдает ошибку при добавлении контекста в app.js
FIXME: Исправить её
*/
// LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext(null); // Создаем контекст с начальным значением null

export const LanguageProvider = ({ children }) => {
  const [languageID, setLanguageID] = useState(1); // Начальное значение для languageID, например, 1

  return (
    <LanguageContext.Provider value={{ languageID, setLanguageID }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); // Хук для удобства использования контекста

