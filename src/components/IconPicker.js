import React, { useState } from "react";
import { View, TouchableOpacity, Image, FlatList } from "react-native";
import styled from "styled-components/native";

import useIconList from "../services/useIconList";

const IconPicker = ({ onSelect }) => {
  const icons = useIconList();
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleIconPress = (iconUrl) => {
    setSelectedIcon(iconUrl);
    onSelect(iconUrl);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIcon === item.url;

    return (
      <IconWrapper onPress={() => handleIconPress(item.url)}>
        <IconImage
          source={{ uri: item.url }}
          style={{ opacity: isSelected ? 0.1 : 1 }} // Apply opacity effect
        />
      </IconWrapper>
    );
  };

  return (
    <IconList
      data={icons}
      renderItem={renderItem}
      keyExtractor={(item) => item.url}
      horizontal={false}
      numColumns={7}
    />
  );
};

const IconList = styled(FlatList)`
  margin-top: 10px;
  background-color: #27274a;
  border-radius: 10px;
`;

const IconWrapper = styled(TouchableOpacity)`
  margin-top: 10px;
  width: 30px;
  height: 30px;
  margin-horizontal:11px;
`;

const IconImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

export default IconPicker;
