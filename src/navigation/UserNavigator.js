import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import * as React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import DictionaryScreen from "../screens/DictionaryScreen";
import EditCategoryScreen from "../screens/EditCategoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MenuScreen from "../screens/MenuScreen"
import { StatusBar } from "react-native";

const menuName = "Меню";
const dictionaryName = "Словарь";
const settingsName = "Настройки";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



const DictionaryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={dictionaryName}
        component={DictionaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#222242",
          },
          headerTintColor: "#938de2",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "ShantellSansRegular",
            fontSize: 26,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const UserContainerScreen = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#202342" barStyle="light-content" />
      <Tab.Navigator
        initialRouteName={menuName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === menuName) {
              iconName = focused ? "school" : "school-outline";
            } else if (rn === dictionaryName) {
              iconName = focused ? "book" : "book-outline";
            } else if (rn === settingsName) {
              iconName = focused ? "settings" : "settings-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#928de2",
          tabBarInactiveTintColor: "#e7e6f9",
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: "ShantellSansRegular",
          },
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "EditCategory") {
              return { display: "none" };
            }

            return {
              backgroundColor: "rgba(56, 56, 99, 0.99)",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 12,
              borderTopWidth: 0,
            };
          })(),
        })}
      >
        <Tab.Screen
          name={menuName}
          component={MenuScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={dictionaryName}
          component={DictionaryStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name={settingsName}
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default UserContainerScreen;
