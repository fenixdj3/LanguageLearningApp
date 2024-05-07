import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import StackNavigator from "./src/navigation/StackNavigator";
import "react-native-gesture-handler";
import { database } from "./src/database/db";
import WelcomeScreen from "./src/screens/WelcomeScreen";


export default function App() {
  SplashScreen.preventAutoHideAsync(); // Предотвратить автоматическое скрытие SplashScreen

  const [fontsLoaded, fontError] = useFonts({
    GrandstanderRegular: require("./assets/fonts/GrandstanderRegular.ttf"),
    HandleeRegular: require("./assets/fonts/HandleeRegular.ttf"),
    PacificoRegular: require("./assets/fonts/PacificoRegular.ttf"),
    ShantellSansBold: require("./assets/fonts/ShantellSansBold.ttf"),
    ShantellSansRegular: require("./assets/fonts/ShantellSansRegular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Загрузка шрифтов и инициализация базы данных
        await database.initDB();
        await database.fetchUsers();
        await database.exportDatabaseFile();
        await database.moveDatabaseToFileSystem();
      } catch (e) {
        console.warn(e);
      } finally {
        // Гарантировать скрытие SplashScreen после инициализации
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null; // Возвращаем null, пока шрифты не загружены
  }


  return (
    <StackNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
