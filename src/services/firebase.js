import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2R5hhDDCz3d9fJ1a3lr-evVIiJ4OqzMI",
  authDomain: "languagelearningexpoapp.firebaseapp.com",
  projectId: "languagelearningexpoapp",
  storageBucket: "languagelearningexpoapp.appspot.com",
  messagingSenderId: "128782869176",
  appId: "1:128782869176:web:371d7fc3dab7f49c748a4d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export { auth };