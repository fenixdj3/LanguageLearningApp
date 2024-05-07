import React, { useState, useEffect } from "react";
import { View, Modal, StyleSheet, Linking, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import styled from "styled-components/native";


// Reusing the styled components for button and button text
const Button = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.variant === "primary" ? "pink" : "#d4d8f0"};
  padding: 10px 20px;
  border-radius: 30px;
  margin: 5px;
  width: 80%;
`;

const ButtonText = styled.Text`
  color: #202342;
  font-size: 16px;
  align-self: center;
  font-family: "ShantellSansBold";
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #202342;
`;

const ModalView = styled.View`
  margin: 20px;
  background-color: "white";
  border-radius: 20px;
  padding: 35px;
  align-items: center;
`;

const ModalText = styled.Text`
  margin-bottom: 15px;
  text-align: center;
  color: white;
`;

function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Container>
      <Button variant="primary" onPress={() => setModalVisible(true)}>
        <ButtonText>О приложении</ButtonText>
      </Button>
      <Button onPress={handleLogout}>
        <ButtonText>Выйти</ButtonText>
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              LanguageApp — это инновационное мобильное приложение для изучения
              иностранных языков через словарные карточки. С его помощью можно
              осваивать лексику, запоминать и слушать произношение слов.
              LanguageApp делает обучение доступным, интерактивным.
            </Text>
            <Text style={styles.modalText}>
              Сайт загрузки:{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL("https://www.flaticon.com/authors/freepik")
                }
              >
                flaticon.com/authors/freepik
              </Text>
            </Text>
            <ModalText>
              Автоматический перевод:{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL("https://yandex.ru/dev/dictionary/")
                }
              >
                Яндекс.Словарь
              </Text>
              , Авто произношение слов:{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL(
                    "https://docs.expo.dev/versions/latest/sdk/speech/"
                  )
                }
              >
                Expo-Speech
              </Text>
            </ModalText>
            <ModalText>
              Связь с автором:{" "}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL("https://vk.com/desynk")}
              >
                VK,{" "}
              </Text>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL("https://t.me/Fenix232x")}
              >
                Telegram
              </Text>
              , Почта: andryusha-ushakov@bk.ru
            </ModalText>
          </View>
          <Button onPress={() => setModalVisible(!modalVisible)}>
            <ButtonText>Закрыть</ButtonText>
          </Button>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#28284b",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  link: {
    color: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#F44336",
  },
});

export default SettingsScreen;
