import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { themeContext } from '../../config/themeContext';

const RoundIconBtn = ({ antIconName, size, color, style, onPress }) => {

  const theme = useContext(themeContext)
  return (
    <AntDesign
      name={antIconName}
      size={size || 24}
      color={color || theme.mode.text}
      style={[styles.icon, { ...style },{backgroundColor:theme.mode.third}]}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});

export default RoundIconBtn;
