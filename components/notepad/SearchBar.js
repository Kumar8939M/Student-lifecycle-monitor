import React, { useContext } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { themeContext } from '../../config/themeContext';

const SearchBar = ({ containerStyle, value, onClear, onChangeText }) => {
  const theme = useContext(themeContext)
  return (
    <View style={[styles.container, { ...containerStyle }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.searchBar,{borderColor:theme.mode.primary}]}
        placeholder='Search here..'
        placeholderTextColor={theme.mode.fifth}
      />
      {value ? (
        <AntDesign
          name='close'
          size={20}
          color={theme.mode.primary}
          onPress={onClear}
          style={styles.clearIcon}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 0.5,
    height: 40,
    borderRadius: 40,
    paddingLeft: 15,
    fontSize: 20,
  },
  container: {
    justifyContent: 'center',
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default SearchBar;
