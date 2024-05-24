import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import {
  clearCategory,
  deleteCategory,
  fetchWordsByCategoryID,
  addWord,
  db,
} from "../database/db";
import * as Speech from "expo-speech";
import Modal from "react-native-modal";
import SuggestionList from "../components/SuggestionList";

const screenHeight = Dimensions.get("window").height;

const Container = styled.View`
  flex: 1;
  background-color: #222242;
`;

const ButtonItemContainer = styled.TouchableOpacity`
  flex-direction: column;
  background-color: #28284b;
  margin: ${(props) => (props.variant === "secondary" ? "4px" : "16px")};
  padding: 8px;
  border-top-left-radius: ${(props) => (props.isFirst ? "8px" : "0px")};
  border-top-right-radius: ${(props) => (props.isFirst ? "8px" : "0px")};
  margin-top: ${(props) => (props.isFirst ? "8px" : "0px")};
  border-bottom-left-radius: ${(props) => (props.isLast ? "8px" : "0px")};
  border-bottom-right-radius: ${(props) => (props.isLast ? "8px" : "0px")};
  margin-bottom: ${(props) => (props.isLast ? "8px" : "0px")};
`;

const ExampleItemContainer = styled.TouchableOpacity`
  flex-direction: column;
  background-color: #28284b;
  padding: 8px;
  border-radius: 8px;
  margin: 4px;
`;

const CategoryTitleContainer = styled.View`
  flex-direction: column;
  background-color: #28284b;
  margin: 0px 4px;
  padding: 8px;
  border-radius: 8px;
`;

const ButtonContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-left: 12px;
  align-self: center;
`;

const ButtonTextContainer = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: 16px;
  padding-left: 16px;
  border-left-width: 1px;
  border-left-color: #e7e6f9;
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.secondary ? "#b7b6c5" : "#e7e6f9")};
  font-size: ${(props) => (props.secondary ? "14px" : "16px")};
  font-family: "ShantellSansRegular";
`;

const ButtonTextContainerMeta = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const WordContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-left-width: 2px;
  padding-left: 10px;
  border-left-color: #e7e6f9;
`;

const WordTextContainer = styled.View`
  flex-direction: column;
`;

const PlaySpeechButton = styled.TouchableOpacity`
  justify-content: center;
`;

const ModalContent = styled.View`
  background-color: #222242;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  height: ${screenHeight * 0.6}px;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const Input = styled.TextInput`
  background-color: #27274a;
  color: #e7e6f9;
  margin: 4px;
  margin-top: 10px;
  padding: 8px;
  border-top-left-radius: ${(props) => (props.isFirst ? "8px" : "0px")};
  border-top-right-radius: ${(props) => (props.isFirst ? "8px" : "0px")};
  margin-top: ${(props) => (props.isFirst ? "8px" : "0px")};
  border-bottom-left-radius: ${(props) => (props.isLast ? "8px" : "0px")};
  border-bottom-right-radius: ${(props) => (props.isLast ? "8px" : "0px")};
  margin-bottom: ${(props) => (props.isLast ? "8px" : "0px")};
  border-bottom-width: ${(props) => (props.isLast ? "0px" : "1px")};
  border-color: #07080f;
`;

const inputs = [
  { placeholder: "Слово на английском", isFirst: true, isLast: false },
  {
    placeholder: "Транскрипция (не обязательно)",
    isFirst: false,
    isLast: false,
  },
  { placeholder: "Перевод", isFirst: false, isLast: true },
];

const buttonData = [
  {
    id: "1",
    title: "Очистить категорию",
    url: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fcross.png?alt=media&token=f77a920e-ad2f-45bc-b59d-5000f7138474",
  },
  {
    id: "2",
    title: "Удалить категорию",
    url: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Ftrashcan.png?alt=media&token=290f2e15-e7fd-4ece-9872-53b4177418dd",
  },
  {
    id: "3",
    title: "Добавить слово",
    url: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Faddcategory.png?alt=media&token=6b585a46-2e00-456c-ab5f-22b2b1ed7eab",
  },
  // Дополнительные элементы данных...
];

const CustomButton = ({ onPress, title, url, index, totalCount, variant }) => {
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;
  return (
    <ButtonItemContainer
      variant={variant}
      isFirst={isFirst}
      isLast={isLast}
      onPress={onPress}
    >
      <ButtonContainerRow>
        <ButtonIcon
          source={{
            uri: url,
          }}
        />
        <ButtonTextContainer>
          <ButtonTextContainerMeta>
            <ButtonText>{title}</ButtonText>
          </ButtonTextContainerMeta>
        </ButtonTextContainer>
      </ButtonContainerRow>
    </ButtonItemContainer>
  );
};

const CategoryTitle = ({ title, url }) => {
  return (
    <CategoryTitleContainer>
      <ButtonContainerRow>
        <ButtonIcon
          source={{
            uri: url,
          }}
        />
        <ButtonTextContainer>
          <ButtonTextContainerMeta>
            <ButtonText>{title}</ButtonText>
          </ButtonTextContainerMeta>
        </ButtonTextContainer>
      </ButtonContainerRow>
    </CategoryTitleContainer>
  );
};
const WordButton = ({
  onPress,
  index,
  totalCount,
  englishWord,
  translateWord,
  languageID,
}) => {
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  const speechPress = (text) => {
    let languageCode = "en-US";
    if (languageID === 2) {
      languageCode = "de-DE";
    } else if (languageID === 3) {
      languageCode = "fr-FR";
    }
    Speech.speak(text, {
      language: languageCode, // Установите язык на английский
      rate: 1.0, // Скорость произношения
    });
  };

  return (
    <ButtonItemContainer isFirst={isFirst} isLast={isLast} onPress={onPress}>
      <WordContainer>
        <WordTextContainer>
          <ButtonText>{englishWord}</ButtonText>
          <ButtonText secondary>{translateWord}</ButtonText>
        </WordTextContainer>
        <PlaySpeechButton onPress={() => speechPress(englishWord)}>
          <ButtonIcon
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fplay.png?alt=media&token=86dc396c-4d2f-4164-af41-e58be028ce05",
            }}
          />
        </PlaySpeechButton>
      </WordContainer>
    </ButtonItemContainer>
  );
};

const CustomInput = ({ placeholder, isFirst, isLast, onChangeText, value }) => {
  return (
    <Input
      placeholder={placeholder}
      placeholderTextColor="#3b3b5c"
      isFirst={isFirst}
      isLast={isLast}
      onChangeText={onChangeText}
      value={value}
    />
  );
};

const AddExampleButton = ({ onPress, title, url }) => {
  return (
    <ExampleItemContainer onPress={onPress}>
      <ButtonContainerRow>
        <ButtonIcon
          source={{
            uri: url,
          }}
        />
        <ButtonTextContainer>
          <ButtonTextContainerMeta>
            <ButtonText>{title}</ButtonText>
          </ButtonTextContainerMeta>
        </ButtonTextContainer>
      </ButtonContainerRow>
    </ExampleItemContainer>
  );
};

const EditCategoryScreen = ({ route, navigation }) => {
  const { categoryName, categoryID, categoryIcon, languageID } = route.params;
  const [words, setWords] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isExampleVisible, setIsExampleVisible] = useState(false);
  const [wordText, setWordText] = useState(""); // Состояние для хранения текста из инпута
  const [translation, setTranslation] = useState(""); // Состояние для хранения перевода
  const [transcription, setTranscription] = useState(""); // Состояние для хранения т
  const [suggestions, setSuggestions] = useState([]); // Состояние для хранения предложенных переводов
  const [exampleText, setExampleText] = useState(""); // Для хранения текста примера
  const [exampleTranslation, setExampleTranslation] = useState(""); // Для хранения перевода примера

  useEffect(() => {
    navigation.setOptions({
      title: categoryName,
    });
    fetchWordsByCategoryID(categoryID, (fetchedWords) => {
      setWords(fetchedWords);
    });
  }, [categoryName, categoryID]);

  const handleClearCategory = () => {
    clearCategory(
      db,
      categoryID,
      () => {
        // После успешной очистки категории вызываем функцию для загрузки слов
        fetchWordsByCategoryID(categoryID, (fetchedWords) => {
          setWords(fetchedWords);
        });
      },
      (error) => {
        console.error("Error clearing category:", error);
      }
    );
  };

  const handleDeleteCategory = () => {
    deleteCategory(
      db,
      categoryID,
      (result) => {
        route.params.refreshCategories();
        navigation.goBack(); // Возвращаемся назад после удаления
        console.log("Категория успешно удалена");
      },
      (error) => {
        console.error("Ошибка при удалении категории:", error);
      }
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddExample = () => {
    setIsExampleVisible(!isExampleVisible);
  };

  const handleInputChange = async (text) => {
    setWordText(text);

    if (text.length >= 2) {
      let languagePair = "en-ru"; // Значение по умолчанию
      if (/[\u0400-\u04FF]/.test(text)) {
        // Проверка на наличие кириллических символов
        languagePair = "ru-en";
        if (languageID === 2) {
          languagePair = "ru-de"; // Русский на немецкий
        } else if (languageID === 3) {
          languagePair = "ru-fr"; // Русский на французский
        }
      } else {
        if (languageID === 2) {
          languagePair = "de-ru"; // Немецкий на русский
        } else if (languageID === 3) {
          languagePair = "fr-ru"; // Французский на русский
        }
      }

      try {
        const response = await fetch(
          `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20240313T145636Z.36876f40f24f0ebf.035f2b16f1c22383233c8aa31b942111cb419462&lang=${languagePair}&text=${encodeURIComponent(
            text
          )}`
        );
        const data = await response.json();

        let fetchedSuggestions = [];
        data.def.forEach((item) => {
          item.tr.forEach((translation) => {
            let examples = translation.ex
              ? translation.ex.map((ex) => {
                  return {
                    text: ex.text,
                    translation: ex.tr ? ex.tr[0].text : "", // Assuming only one translation for simplicity
                  };
                })
              : [];

            fetchedSuggestions.push({
              word: item.text,
              translation: translation.text,
              transcription: item.ts || "",
              examples: examples, // Changed to 'examples' to include both text and translation
            });
          });
        });

        setSuggestions(fetchedSuggestions);
      } catch (error) {
        console.error("Ошибка при запросе к API Яндекс.Словарь:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (
    selectedSuggestion,
    selectedTranscription,
    selectedExamples // Добавьте параметр для примеров
  ) => {
    // Проверка на язык ввода (русский или английский)
    if (/[\u0400-\u04FF]/.test(wordText)) {
      // Если текст содержит кириллические символы, это русское слово
      setTranslation(wordText); // Установить оригинальное слово как перевод
      setWordText(
        Array.isArray(selectedSuggestion)
          ? selectedSuggestion[0]
          : selectedSuggestion
      );
    } else {
      // Если текст содержит латинские символы, это английское слово
      setWordText(
        Array.isArray(selectedSuggestion)
          ? selectedSuggestion[0]
          : selectedSuggestion
      );
      setTranslation(wordText); // Установить оригинальное слово как перевод
    }
    setTranscription(selectedTranscription);

    // Установите первый доступный пример и его перевод, если они существуют
    if (selectedExamples && selectedExamples.length > 0) {
      setExampleText(selectedExamples[0].text);
      setExampleTranslation(selectedExamples[0].translation);
    } else {
      setExampleText("");
      setExampleTranslation("");
    }
  };

  const handleSaveWord = () => {
    // Проверяем, что слово на английском и его перевод заполнены
    if (!wordText.trim() || !translation.trim()) {
      alert("Пожалуйста, заполните слово на английском и перевод.");
      return;
    }

    addWord(
      categoryID,
      wordText,
      transcription,
      translation,
      exampleText,
      exampleTranslation,
      () => {
        console.log("Слово успешно добавлено в категорию.");
        // Закрытие модального окна и обновление списка слов
        toggleModal();
        fetchWordsByCategoryID(categoryID, setWords);
        // Очистка формы
        setWordText("");
        setTranslation("");
        setTranscription("");
        setExampleText("");
        setExampleTranslation("");
        route.params.refreshCategories();
      },
      (error) => {
        console.error("Ошибка при добавлении слова:", error);
      }
    );
  };

  const renderButton = (item, index) => (
    <CustomButton
      key={item.id}
      index={index}
      totalCount={buttonData.length}
      onPress={() => {
        if (item.id === "1") {
          handleClearCategory(); // Вызываем функцию для очистки категории
        } else if (item.id === "2") {
          handleDeleteCategory(); // Вызываем функцию для удаления категории
        } else if (item.id === "3") {
          toggleModal();
        }
      }}
      title={item.title}
      url={item.url}
    />
  );

  const renderWord = (word, index) => (
    <WordButton
      key={word.WordID}
      index={index}
      totalCount={words.length}
      onPress={() => console.log("Нажата кнопка для слова:", word.EnglishWord)}
      englishWord={word.EnglishWord}
      translateWord={word.Translation}
      languageID={languageID}
      speechPress={() => {
        /* Здесь можно реализовать воспроизведение произношения слова */
      }}
    />
  );

  return (
    <Container>
      <ScrollView>
        {buttonData.map((item, index) => renderButton(item, index))}
        {words.map((word, index) => renderWord(word, index))}
      </ScrollView>
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        swipeDirection="down"
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <ModalContent>
          <TopBar>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={{ color: "#938de2" }}>Отмена</Text>
            </TouchableOpacity>
            <Text style={{ color: "#e7e6f9" }}>Добавление слова</Text>
            <TouchableOpacity onPress={handleSaveWord}>
              <Text style={{ color: "#938de2" }}>Сохранить</Text>
            </TouchableOpacity>
          </TopBar>
          <CategoryTitle title={categoryName} url={categoryIcon} />
          <CustomInput
            placeholder={inputs[0].placeholder}
            isFirst={inputs[0].isFirst}
            isLast={inputs[0].isLast}
            onChangeText={handleInputChange} // Передаем функцию для обработки изменения текста
            value={wordText} // Передаем текущее значение текста в инпуте
          />
          <CustomInput
            placeholder={inputs[1].placeholder}
            isFirst={inputs[1].isFirst}
            isLast={inputs[1].isLast}
            onChangeText={setTranscription}
            value={transcription} // Используем транскрипцию для заполнения инпута
          />
          <CustomInput
            placeholder={inputs[2].placeholder}
            isFirst={inputs[2].isFirst}
            isLast={inputs[2].isLast}
            onChangeText={setTranslation}
            value={translation} // Используем перевод для заполнения инпута
          />
          {suggestions.length > 0 && (
            <SuggestionList
              suggestions={suggestions}
              onSuggestionSelect={handleSuggestionSelect}
            />
          )}
          {isExampleVisible && (
            <React.Fragment>
              <CustomInput
                placeholder="Пример"
                isFirst
                isLast={false}
                onChangeText={setExampleText} // Измените обработчик на setExampleText
                value={exampleText}
              />
              <CustomInput
                placeholder="Перевод примера"
                isFirst={false}
                isLast
                onChangeText={setExampleTranslation} // Измените обработчик на setExampleTranslation
                value={exampleTranslation}
              />
            </React.Fragment>
          )}
          <AddExampleButton
            title="Добавить пример"
            url="https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Faddcategory.png?alt=media&token=6b585a46-2e00-456c-ab5f-22b2b1ed7eab"
            onPress={handleAddExample}
          />
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EditCategoryScreen;
