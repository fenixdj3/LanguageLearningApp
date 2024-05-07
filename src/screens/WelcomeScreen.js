/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

// Define your styled components outside of the WelcomeScreen function
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #202342;
`;

const TextStyle = styled.Text`
  font-size: 40px;
  color: #d4d8f0;
  font-family: "HandleeRegular";
`;

function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("SignUpOrLogin");
    }, 3000);
    return () => clearTimeout(timer); // Clears the timer on component unmount
  }, [navigation]);

  return (
    <Container>
      <TextStyle>LanguageApp</TextStyle>
    </Container>
  );
}

export default WelcomeScreen;
