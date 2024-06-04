import React, { useState } from "react";
import styled from "styled-components/native";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Text } from "react-native";
import { db,addDefaultCategories,addDefaultWords,addUser, addWordsToCategories } from "../database/db";

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
  justify-content: stretch;
  margin-bottom: 20px;
`;

const CheckTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom:30px;
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
  color: pink;
  font-family: "ShantellSansRegular";
  align-self: center;
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
    <Line />
  </OrContainer>
);
function SignUpScreen({ navigation }) {
      const [isChecked, setIsChecked] = React.useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

 const handleSignUp = async (credentials) => {
   const { email, password, confirmPassword } = credentials;
   if (email && password && confirmPassword && password === confirmPassword) {
     try {
       // Регистрация пользователя через Firebase Auth
       const userCredential = await createUserWithEmailAndPassword(
         auth,
         email,
         password
       );
       console.log("Registration successful");

       // Получаем UID пользователя из Firebase
       const firebaseUserUid = userCredential.user.uid;

       // Использование db.transaction напрямую для работы с БД
       db.transaction((tx) => {
         // Добавление пользователя в локальную БД
         addUser(firebaseUserUid, email, tx, (success, result) => {
           if (success) {
             console.log("User added to local DB", result);
             // После успешного добавления пользователя, добавляем стандартные категории и слова
             addDefaultCategories(firebaseUserUid, tx);
             addWordsToCategories(firebaseUserUid,tx);
           } else {
             console.log("Error adding user to local DB", result);
           }
         });
       });
     } catch (error) {
       console.log("Error during Firebase registration:", error.message);
     }
   } else {
     console.log("Please ensure all fields are filled and passwords match");
   }
 };

  // Add any additional inputs and checkboxes as per your image

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title>Регистрация</Title>
          <Input
            placeholder="Логин"
            returnKeyType="next"
            value={credentials.username} // Bind the value to the state
            onChangeText={(text) =>
              setCredentials({ ...credentials, username: text })
            }
          />
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
            returnKeyType="next"
            value={credentials.password} // Bind the value to the state
            onChangeText={(text) =>
              setCredentials({ ...credentials, password: text })
            }
          />
          <Input
            placeholder="Подтверждение пароля"
            secureTextEntry
            returnKeyType="done"
            value={credentials.confirmPassword} // Bind the value to the state
            onChangeText={(text) =>
              setCredentials({ ...credentials, confirmPassword: text })
            }
          />
          <CheckboxContainer>
            <CustomCheckbox
              isChecked={isChecked}
              onToggle={() => setIsChecked(!isChecked)}
            />
            <ForgotPassword>
              Подписываясь, вы принимаете{" "}
              <Text style={{ color: "#d4d8f0" }}>
                Условия предоставления услуг
              </Text>{" "}
              и{" "}
              <Text style={{ color: "#d4d8f0" }}>
                Политику конфиденциальности
              </Text>
            </ForgotPassword>
          </CheckboxContainer>
          <Separator />
          <Button onPress={() => handleSignUp(credentials)}>
            <ButtonText>Создать аккаунт</ButtonText>
          </Button>
          <Footer>
            <FooterText>Уже есть аккаунт? </FooterText>
            <CreateAccountText onPress={() => navigation.navigate("Login")}>
              Войти!
            </CreateAccountText>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen;
