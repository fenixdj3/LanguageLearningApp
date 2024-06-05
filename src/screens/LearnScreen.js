import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import Swiper from "react-native-deck-swiper";
import FlipCard from "react-native-flip-card";
import * as Speech from "expo-speech";
import useAuth from "../services/useAuth";
import {
  getNewWordsForCurrentUser,
  getWordsForReview,
  updateWordProgress,
  markWordAsLearned,
  markWordAsKnown,
  markWordAsLearning,
} from "../database/db";
import { useLanguage } from "../services/LanguageContext";

const Container = styled.View`
  flex: 1;
  background-color: #222242;
  justify-content: flex-start;
  align-items: center;
`;

const CardText = styled.Text`
  color: white;
  font-family: "ShantellSansRegular";
  font-size: 18px;
  text-align: center;
  margin: 5px 0;
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #28284b;
  margin: 5px;
  margin-bottom: 100px;
  border-radius: 10px;
  border: 1px solid #e7e6f9;
  padding: 20px;
  height: 250px;
`;

const MessageText = styled.Text`
  color: white;
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin: 20px 0;
  z-index: 20000;
`;

const StyledButton = styled(TouchableOpacity)`
  margin: 10px;
  padding: 10px;
  background-color: ${(props) => (props.selected ? "#6b8e23" : "#556b2f")};
  border-radius: 5px;
  width: 40%;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;

const speakWord = (word, languageID) => {
  let language;
  switch (languageID) {
    case 1:
      language = "en"; // Английский
      break;
    case 2:
      language = "de"; // Немецкий
      break;
    case 3:
      language = "fr"; // Французский
      break;
    default:
      language = "en"; // По умолчанию английский
  }

  Speech.speak(word, {
    language,
  });
};

function LearnScreen() {
  const [cards, setCards] = useState([]);
  const [mode, setMode] = useState("new"); // new or review
  const [noWordsForNew, setNoWordsForNew] = useState(false);
  const [noWordsForReview, setNoWordsForReview] = useState(false);
  const { user } = useAuth();
  const { languageID } = useLanguage();

  const fetchWords = () => {
    if (user && user.uid) {
      if (mode === "new") {
        getNewWordsForCurrentUser(user.uid, languageID, (words) => {
          setCards(words);
          setNoWordsForNew(words.length === 0);
        });
      } else {
        getWordsForReview(user.uid, languageID, (words) => {
          setCards(words);
          setNoWordsForReview(words.length === 0);
        });
      }
    }
  };

  const handleSwipe = (cardIndex, quality) => {
    const word = cards[cardIndex];

    if (word && user) {
      if (mode === "review") {
        updateWordProgress(word.WordID, quality, user.uid);
        if (quality >= 4) {
          markWordAsLearned(word.WordID, user.uid);
        }
      } else {
        if (quality === 5) {
          // "Я уже знаю это слово"
          markWordAsKnown(word.WordID, user.uid);
        } else {
          // "Начать учить это слово"
          markWordAsLearning(word.WordID, user.uid);
        }
      }
    }
    if (cardIndex === cards.length - 1) {
      fetchWords();
    }
  };

  useEffect(() => {
    fetchWords();

    const interval = setInterval(() => {
      fetchWords();
    }, 0); // Обновляем слова каждые 10 секунд

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, [user, mode, languageID]);

  const renderCard = (card) => (
    <FlipCard
      key={`flip-card-${card.WordID}-${mode}`} // Используем уникальный идентификатор WordID и режим в качестве ключа
      flipHorizontal={true}
      flipVertical={false}
      friction={6}
      perspective={1000}
      flip={false}
      clickable={true}
      onFlipEnd={(isFlipEnd) => console.log("isFlipEnd", isFlipEnd)}
      style={{ borderRadius: 10, width: "90%", alignSelf: "center" }}
    >
      <CardContainer style={{ flexDirection: "column" }}>
        <CardText style={{ marginRight: 10 }}>{card.EnglishWord}</CardText>
        <CardText style={{ marginRight: 10 }}>{card.Transcription}</CardText>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => speakWord(card.EnglishWord, languageID)}
        >
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fspeaking.png?alt=media&token=dfadd67e-3a0e-44b8-bbfd-77baea6a1f4a",
            }}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
      </CardContainer>
      <CardContainer>
        <CardText>{card.Translation}</CardText>
      </CardContainer>
    </FlipCard>
  );

  if (cards.length === 0) {
    if (mode === "review" && noWordsForReview) {
      return (
        <Container>
          <MessageText>Сегодня нет слов для повторения</MessageText>
          <StyledButton onPress={() => setMode("new")}>
            <ButtonText>Перейти к новым словам</ButtonText>
          </StyledButton>
        </Container>
      );
    }
    if (mode === "new" && noWordsForNew) {
      return (
        <Container>
          <MessageText>Сегодня нет новых слов для изучения</MessageText>
          <StyledButton onPress={() => setMode("review")}>
            <ButtonText>Перейти к повторению слов</ButtonText>
          </StyledButton>
        </Container>
      );
    }
    return (
      <Container>
        <Text>Загрузка карточек...</Text>
      </Container>
    );
  }

  return (
    <Container>
      <ButtonContainer>
        <StyledButton selected={mode === "new"} onPress={() => setMode("new")}>
          <ButtonText>Новые слова</ButtonText>
        </StyledButton>
        <StyledButton
          selected={mode === "review"}
          onPress={() => setMode("review")}
        >
          <ButtonText>Повторение слов</ButtonText>
        </StyledButton>
      </ButtonContainer>
      <Swiper
        key={`swiper-${mode}-${cards.map((card) => card.WordID).join("-")}`} // Используем уникальный идентификатор для режима и WordID карт
        cards={cards}
        renderCard={renderCard}
        onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, 0)}
        onSwipedRight={(cardIndex) => handleSwipe(cardIndex, 5)}
        onSwipedAll={fetchWords}
        verticalSwipe={false}
        cardIndex={0}
        stackSize={3}
        backgroundColor="transparent"
        stackSeparation={15}
        infinite
      />
    </Container>
  );
}

export default LearnScreen;
