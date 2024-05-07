import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import styled from "styled-components/native";
import logo from "../../assets/png/logo.png";
// Создание стилизованных компонентов
const Container = styled(SafeAreaView)`
  flex: 1;
  justify-content: space-between;
  padding: 20px;
  background-color: #202342;
`;

const Title = styled(Text)`
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  color: pink;
  font-family: "GrandstanderRegular";
`;

const Subtitle = styled(Text)`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: #d4d8f0;
  font-family: "ShantellSansRegular";
`;

const ButtonContainer = styled(View)`
  justify-content: space-between;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${(props) =>
    props.variant === "primary" ? "pink" : "#d4d8f0"};
  padding: 10px 20px;
  border-radius: 30px;
  margin: 5px;
`;

const ButtonText = styled(Text)`
  color: #202342;
  font-size: 16px;
  align-self: center;
  font-family: "ShantellSansBold";
`;

function SignUpOrLoginScreen({ navigation }){
  return (
    <Container>
      <StatusBar
        backgroundColor="#202342" // Установите цвет фона статус бара
        barStyle="light-content" // Установите стиль текста статус бара (light-content, dark-content)
      />
      <View>
        <View style={styles.logoBackground}>
          <Image source={logo} style={styles.logoStyle} />
        </View>
        <Title>LanguageApp</Title>
        <Subtitle>Учим английский вместе!</Subtitle>
      </View>
      <ButtonContainer>
        <Button onPress={() => navigation.navigate("SignUp")} >
          <ButtonText>Создать аккаунт</ButtonText>
        </Button>
        <Button variant="primary" onPress={() => navigation.navigate("Login")}>
          <ButtonText>Уже есть аккаунт</ButtonText>
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  logoBackground: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#0b151d",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#d4d8f0",
  },
  logoStyle: {
    width: 250,
    height: 250,
  },
});
export default SignUpOrLoginScreen;
