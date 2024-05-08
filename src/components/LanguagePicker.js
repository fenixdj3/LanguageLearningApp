// LanguagePicker.js
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useLanguage } from "../services/LanguageContext";
import styled from "styled-components/native";

const PickerWrapper = styled.View`
  width: 80%;
  background-color: pink; 
  border-radius: 30px; 
  margin: 5px;

`;


const LanguagePicker = () => {
  const { languageID, setLanguageID } = useLanguage();

  return (
    <PickerWrapper>
      <Picker
        selectedValue={languageID}
        onValueChange={(itemValue) => setLanguageID(itemValue)}
        style={{ color: "#202342", width: "100%" }} // Стилизация текста и ширины
      >
        <Picker.Item label="Английский" value={1} />
        <Picker.Item label="Немецкий" value={2} />
        <Picker.Item label="Французкий" value={3} />
        {/* Добавьте другие языки по мере необходимости */}
      </Picker>
    </PickerWrapper>
  );
};

export default LanguagePicker;
