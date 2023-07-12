import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { themeContext } from '../../config/themeContext';
import { deleteTodoTable } from '../../database/sqlite/todo';
import { updateTrackerScore } from '../../database/sqlite/tracker';

const SubTask = ({id,name,parent,parentColor,update}) => {


    const theme = useContext(themeContext)
    function handleDelete(){
      updateTrackerScore();
        deleteTodoTable(id,parent)
        update();
    }

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={[styles.square,{backgroundColor:parentColor}]}></View>
        <BouncyCheckbox onPress={handleDelete} fillColor={theme.mode.fourth}/>
        <Text style={styles.itemText}>{name}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignSelf:"flex-end",
    width:"90%",
    marginTop:-10
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 10,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default SubTask;