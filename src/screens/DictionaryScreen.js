import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components/native";
import {
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import { addCategory, fetchCategories } from "../database/db";
import useAuth from "../services/useAuth";
import Modal from "react-native-modal";
import IconPicker from "../components/IconPicker";
import { useLanguage } from "../services/LanguageContext";

const screenHeight = Dimensions.get("window").height;

const Container = styled.View`
  flex: 1;
  background-color: #222242;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  padding-left: 16px;
`;

const Title = styled.Text`
  color: #e7e6f9;
  font-size: 32px;
  font-family: "ShantellSansRegular";
`;

const SearchContainer = styled.View`
  flex-direction: row;
  height: 40px;
  background-color: #27274a;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  align-items: center;
  padding: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  color: #e7e6f9;
  padding-left: 10px;
`;

const CategoryItemContainer = styled.TouchableOpacity`
  flex-direction: column;
  background-color: #28284b;
  margin: 0px 16px;
  padding: 8px;
`;

const CategoryRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CategoryIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-left: 12px;
  align-self: center;
`;

const CategoryInfo = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: 16px;
  padding-left: 16px;
  border-left-width: 1px;
  border-left-color: #e7e6f9;
`;

const CategoryTitle = styled.Text`
  color: #e7e6f9;
  font-size: 18px;
  font-family: "ShantellSansRegular";
`;

const CategoryMeta = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const CategoryWordCount = styled.Text`
  color: #e7e6f9;
  font-size: 14px;
  font-family: "ShantellSansRegular";
`;

const ProgressBarBackground = styled.View`
  background-color: #232343;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  height: 4px;
  margin-top: 4px;
  position: relative;
`;

const CategoryProgress = styled.View`
  background-color: #8a409a;
  height: 4px;
  border-radius: 4px;
`;

const ProgressText = styled.Text`
  color: #e7e6f9;
  margin-right: 0px;
  font-size: 12px;
  font-family: "ShantellSansRegular";
`;

const ModalContent = styled.View`
  background-color: #222242;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  height: ${screenHeight * 0.5}px;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const CategoryInput = styled.TextInput`
  background-color: #27274a;
  margin-top: 8px;
  border-radius: 10px;
  padding: 10px;
  color: #e7e6f9;
`;

const TITLE_BY_LANGUAGE_ID = {
  1: "Словарь Английского", // Пример для английского
  2: "Словарь Немецкого", // Пример для немецкого
  3: "Словарь Французкого", // Пример для французского
};

const CategoryItem = ({
  languageID,
  icon,
  title,
  count,
  progress,
  index,
  totalCount,
  categoryID,
  navigation,
  refreshCategories,
}) => {
  let containerStyle = {};
  if (index === 0) {
    // Для первого элемента
    containerStyle.borderTopLeftRadius = 8;
    containerStyle.borderTopRightRadius = 8;
    containerStyle.marginTop = 8;
  } else if (index === totalCount - 1) {
    // Для последнего элемента
    containerStyle.borderBottomLeftRadius = 8;
    containerStyle.borderBottomRightRadius = 8;
  }

  const handleEditCategory = () => {
    console.log("CategoryID:", { categoryID },"LanguageID:");
    navigation.navigate("EditCategory", {
      categoryID: categoryID,
      categoryName: title,
      categoryIcon: icon,
      languageID: languageID,
      refreshCategories: refreshCategories,
    });
  };

  return (
    <CategoryItemContainer style={containerStyle} onPress={handleEditCategory}>
      <CategoryRow>
        <CategoryIcon source={{ uri: icon }} />
        <CategoryInfo>
          <CategoryMeta>
            <CategoryTitle>{title}</CategoryTitle>
            <CategoryWordCount>{count}</CategoryWordCount>
          </CategoryMeta>
          <ProgressBarBackground>
            <CategoryProgress
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </ProgressBarBackground>
          <ProgressText>{`${Math.min(progress, 100)}%`}</ProgressText>
        </CategoryInfo>
      </CategoryRow>
    </CategoryItemContainer>
  );
};

const AddCategoryButton = ({ onPress }) => {
  return (
    <CategoryItemContainer onPress={onPress} style={{ borderRadius: 8 }}>
      <CategoryRow>
        <CategoryIcon
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Faddcategory.png?alt=media&token=6b585a46-2e00-456c-ab5f-22b2b1ed7eab",
          }}
        />
        <CategoryInfo>
          <CategoryMeta>
            <CategoryTitle>Добавить категорию</CategoryTitle>
          </CategoryMeta>
        </CategoryInfo>
      </CategoryRow>
    </CategoryItemContainer>
  );
};

const DictionaryScreen = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const { languageID } = useLanguage();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const refreshCategories = useCallback(() => {
    if (user && user.uid && languageID) {
      fetchCategories(user.uid, languageID, (fetchedCategories) => {
        setCategories(
          fetchedCategories.map((category) => ({
            ...category,
            icon: category.ImageURL,
          }))
        );
      });
    }
  }, [user, languageID]);

  const handleSaveCategory = () => {
    if (categoryName.trim() !== "") {
    addCategory(
      user.uid,
      languageID,
      categoryName,
      selectedIcon,
      refreshCategories
    );
      setCategoryName(""); // Очищаем поле ввода после сохранения
      setSelectedIcon(null); // Сбрасываем выбранный иконка
      toggleModal(); // Закрываем модальное окно после сохранения
    }
  };

  const titleText = TITLE_BY_LANGUAGE_ID[languageID] || "Словарь";

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]); 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <StatusBar backgroundColor="#222242" barStyle="light-content" />

        <FlatList
          ListHeaderComponentStyle={{
            backgroundColor: "#222242",
          }}
          ListHeaderComponent={
            <>
              <Header>
                <Title>{titleText}</Title>
                <TouchableOpacity
                  onPress={refreshCategories}
                  style={{ alignSelf: "center", marginRight: 25 }}
                >
                  <CategoryIcon
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fupdate.png?alt=media&token=cb26e5d1-5ecc-43d6-aa0b-61557779c451",
                    }}
                  />
                </TouchableOpacity>
              </Header>
              <AddCategoryButton onPress={toggleModal} />
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
                    <Text style={{ color: "#e7e6f9" }}>Новая категория</Text>
                    <TouchableOpacity onPress={handleSaveCategory}>
                      <Text style={{ color: "#938de2" }}>Сохранить</Text>
                    </TouchableOpacity>
                  </TopBar>
                  <CategoryInput
                    placeholder="Название категории"
                    placeholderTextColor="#3b3b5c"
                    onChangeText={setCategoryName}
                    value={categoryName}
                  />
                  <IconPicker onSelect={setSelectedIcon} />
                </ModalContent>
              </Modal>
            </>
          }
          data={categories}
          keyExtractor={(item) => String(item.CategoryID)}
          renderItem={({ item, index }) => (
            <CategoryItem
              {...item}
              index={index}
              totalCount={categories.length}
              languageID={item.LanguageID}
              icon={item.icon}
              title={item.Name}
              count={`${item.WordCount} слов`}
              progress={item.Progress}
              categoryID={item.CategoryID}
              navigation={navigation}
              refreshCategories={refreshCategories}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 60,
          }}
          keyboardShouldPersistTaps="handled" // Чтобы клавиатура не закрывалась при касании вне текстового поля
        />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default DictionaryScreen;
