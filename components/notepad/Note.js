import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {themeContext} from "../../config/themeContext"

const Note = ({ item, onPress }) => {
  const { title, desc } = item;
  const theme = useContext(themeContext)
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container,{backgroundColor:theme.mode.secondary}]}>
      <Text style={[styles.title,{color:theme.mode.text}]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={{color:theme.mode.text}} numberOfLines={3}>{desc}</Text>
    </TouchableOpacity>
  );
};

const width = Dimensions.get('window').width - 40;

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 10,
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Note;
