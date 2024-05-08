import React from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #28284b;
  padding: 8px;
  margin: 4px;
  border-radius: 8px;
`;
const ItemContainer = styled.TouchableOpacity`
  background-color: #28284b;
  padding: 8px;
  margin: 4px;
  border-radius: 8px;
  border-width: 1px;
`;

const SuggestionText = styled.Text`
  color: #e7e6f9;
  font-size: 16px;
`;

const SuggestionList = ({ suggestions, onSuggestionSelect }) => {
  const handleSuggestionPress = (translation, transcription, examples) => {
    onSuggestionSelect(translation, transcription, examples);
    console.log("Выбранное слово:", translation);
    console.log(
      "Транскрипция:",
      transcription ? transcription : "транскрипция не предоставлена"
    );
    examples.forEach((example) => {
      console.log("Пример:", example.text);
      console.log("Перевод примера:", example.translation);
    });
  };

  return (
    <Container>
      <FlatList
        data={suggestions}
        horizontal={true}
        renderItem={({ item }) => (
          <ItemContainer
            onPress={() =>
              handleSuggestionPress(
                item.translation,
                item.transcription,
                item.examples, // Pass the examples array to the press handler
              )
            }
          >
            <SuggestionText>{item.translation}</SuggestionText>
          </ItemContainer>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </Container>
  );
};

export default SuggestionList;
