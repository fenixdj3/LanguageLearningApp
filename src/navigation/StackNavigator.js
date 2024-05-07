import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SignUpOrLoginScreen from "../screens/SignUpOrLoginScreen";
import LoginScreen from "../screens/LoginScreen";
import useAuth from "../services/useAuth";
import SignUpScreen from "../screens/SignUpScreen";
import { StatusBar } from "react-native";
import UserContainerScreen from "./UserNavigator";
const Stack = createStackNavigator();
export default function StackNavigator() {
  const { user } = useAuth();
  if (user) {
    return (
      
      <UserContainerScreen/>
    );
  } else {
    return (
      <NavigationContainer>
        <StatusBar
          backgroundColor="#202342" // Установите цвет фона статус бара
          barStyle="light-content" // Установите стиль текста статус бара (light-content, dark-content)
        />
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUpOrLogin"
            component={SignUpOrLoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
