import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import Swiper from "react-native-deck-swiper";
import FlipCard from "react-native-flip-card";
import * as Speech from "expo-speech";
import useAuth from "../services/useAuth";
import { getRandomWordsForCurrentUser } from "../database/db";

const Container = styled.View`
  flex: 1;
  background-color: #222242;
`;

const CardText = styled.Text`
  color: white;
  font-family: "ShantellSansRegular";
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #28284b;
  margin-bottom: 50px;
  border-radius: 5px;
  border: 0.1px solid #e7e6f9;
`;

function MenuScreen() {
  const [cards, setCards] = useState([]);
  const { user } = useAuth();
  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // обмен элементами
    }
    return array;
  };

  const fetchRandomWords = () => {
    if (user && user.uid) {
      getRandomWordsForCurrentUser(user.uid, (words) => {
        if (words && words.length > 0) {
          const shuffledWords = shuffleArray(
            words.map((word) => ({
              word: word.EnglishWord,
              translation: word.Translation,
              transcription: word.Transcription,
            }))
          );
          setCards(shuffledWords);
        } else {
          console.log("No words found or an error occurred.");
        }
      });
    }
  };

  useEffect(() => {
    fetchRandomWords();
  }, [user]);

  const renderCard = (card, index) => (
    <FlipCard
      key={index}
      flipHorizontal={true}
      flipVertical={false}
      friction={6}
      perspective={1000}
      flip={false}
      clickable={true}
      onFlipEnd={(isFlipEnd) => console.log("isFlipEnd", isFlipEnd)}
      style={{ borderradius: 10 }}
    >
      <CardContainer style={{ flexDirection: "column" }}>
        <CardText style={{ marginRight: 10 }}>{card.word}</CardText>
        <CardText style={{ marginRight: 10 }}>{card.transcription}</CardText>
        <TouchableOpacity style={{marginTop:100}} onPress={() => Speech.speak(card.word)}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fspeaking.png?alt=media&token=dfadd67e-3a0e-44b8-bbfd-77baea6a1f4a",
            }}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
      </CardContainer>
      <CardContainer>
        <CardText>{card.translation}</CardText>
      </CardContainer>
    </FlipCard>
  );

  if (cards.length === 0) {
    return (
      <Container>
        <Text>Loading cards...</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Swiper
        key={cards.length} // Используем длину массива cards в качестве ключа для принудительного обновления компонента
        cards={cards}
        renderCard={renderCard}
        onSwipedAll={fetchRandomWords} // Загружаем новый набор слов, когда все карточки были свайпнуты
        verticalSwipe={false}
        cardIndex={0}
        stackSize={3} // Можно настроить размер стека карточек
        backgroundColor="transparent"
        stackSeparation={15}
        infinite // Добавьте это, если хотите, чтобы карточки циклически повторялись
      />
    </Container>
  );
}

export default MenuScreen;
