/*
TODO: Выдает ошибку при добавлении контекста в app.js
FIXME: Исправить её
*/
import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [languageID, setLanguageID] = useState(1); // По умолчанию, например, English

  return (
    <LanguageContext.Provider value={{ languageID, setLanguageID }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
