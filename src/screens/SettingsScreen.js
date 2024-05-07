import { signOut } from "firebase/auth";
import React from "react";
import { Text, View } from "react-native";
import { auth } from "../services/firebase";

function SettingsScreen() {
    const handleLogout = async ()=>{
        await signOut(auth);
    }
  return (
    <View>
      <Text onPress={handleLogout}>LogOut</Text>
    </View>
  );
}

export default SettingsScreen;
