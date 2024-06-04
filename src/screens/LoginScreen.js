import React, { useState } from "react";
import styled from "styled-components/native";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebase";

const Container = styled.View`
  flex: 1;
  background-color: #202342;
  padding: 20px;
`;

const Title = styled.Text`
  color: pink;
  font-size: 32px;
  margin-bottom: 20px;
  font-family: "ShantellSansRegular";
`;

const Input = styled.TextInput`
  background-color: #d4d8f0;
  border-radius: 10px;
  color: #202342;
  padding: 10px 20px;
  margin-bottom: 15px;
`;

const Button = styled.TouchableOpacity`
  background-color: pink;
  border-radius: 20px;
  padding: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonText = styled.Text`
  color: #202342;
  font-size: 18px;
  font-family: "ShantellSansBold";
`;

const OrContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: pink;
`;

const OrText = styled.Text`
  margin: 0 10px;
  color: pink;
  font-family: "ShantellSansRegular";
`;

const SocialIconRow = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const FooterText = styled.Text`
  color: pink;
  font-family: "ShantellSansRegular";
`;

const CreateAccountText = styled(FooterText)`
  color: #d4d8f0;
  font-family: "ShantellSansBold";
`;

const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CheckTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Checkbox = styled.View`
  width: 20px;
  height: 20px;
  border-width: 1px;
  border-color: pink;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

const CheckboxIcon = styled.View`
  width: 14px;
  height: 14px;
  background-color: pink;
`;

const CheckboxLabel = styled.Text`
  color: pink;
  font-family: "ShantellSansRegular";
`;

const ForgotPassword = styled.Text`
  color: #d4d8f0;
  font-family: "ShantellSansRegular";
  align-self: center;
`;

const SocialIconContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: pink;
  align-items: center;
  justify-content: center;
  margin: 5px;
`;

const CustomCheckbox = ({ isChecked, label, onToggle }) => (
  <CheckTouchable onPress={onToggle}>
    <Checkbox>{isChecked && <CheckboxIcon />}</Checkbox>
    <CheckboxLabel>{label}</CheckboxLabel>
  </CheckTouchable>
);

const Separator = () => (
  <OrContainer>
    <Line />
    <OrText>Or</OrText>
    <Line />
  </OrContainer>
);

function LoginScreen({ navigation }) {
  const [isChecked, setIsChecked] = React.useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const { email, password } = credentials;
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful");
        // navigation.navigate("YourNextScreen"); // Navigate upon success
      } catch (err) {
        console.log("got error: ", err.message);
        // Optionally, handle errors more gracefully here
      }
    } else {
      console.log("Please enter both email and password");
      // Optionally, inform the user to fill in both fields
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title>Авторизация</Title>
          <Input
            placeholder="Почта"
            keyboardType="email-address"
            returnKeyType="next"
            value={credentials.email} // Bind the value to the state
            onChangeText={(text) =>
              setCredentials({ ...credentials, email: text })
            }
          />
          <Input
            placeholder="Пароль"
            secureTextEntry
            returnKeyType="done"
            value={credentials.password} // Bind the value to the state
            onChangeText={(text) =>
              setCredentials({ ...credentials, password: text })
            }
          />
          <CheckboxContainer>
            <CustomCheckbox
              isChecked={isChecked}
              label="Запомнить меня"
              onToggle={() => setIsChecked(!isChecked)}
            />
            <ForgotPassword>Забыли пароль?</ForgotPassword>
          </CheckboxContainer>
          <Button onPress={handleLogin}>
            <ButtonText>Войти</ButtonText>
          </Button>
          <Separator />
          <SocialIconRow>
            <SocialIconContainer>
              <Icon name="facebook" size={25} color="#202342" />
            </SocialIconContainer>
            <SocialIconContainer>
              <Icon name="twitter" size={25} color="#202342" />
            </SocialIconContainer>
            <SocialIconContainer>
              <Icon name="google" size={25} color="#202342" />
            </SocialIconContainer>
          </SocialIconRow>
          <Footer>
            <FooterText>Нету аккаунта? </FooterText>
            <CreateAccountText onPress={() => navigation.navigate("Sign Up")}>
              Создайте новый!
            </CreateAccountText>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
