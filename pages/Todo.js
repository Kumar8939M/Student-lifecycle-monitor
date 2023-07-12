import React, {useContext, useEffect, useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import 'react-native-get-random-values'
import Task from '../components/todo/Task';
import { getTodoGroup, insertTodoGroup } from '../database/sqlite/todo';
import { v4 as uuidv4 } from 'uuid';
import List from '../components/List';
import { themeContext } from '../config/themeContext';

function Todo() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const theme = useContext(themeContext)

  useEffect(()=>{
    async function getData(){
        
        getTodoGroup(setTaskItems)
    }
    getData()
  },[])


  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const handleAddTask = () => {
    Keyboard.dismiss();
    var color = rgbToHex(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256))
    const group = {id:uuidv4(),name:task,color:color.toString(),completed:false,star:false,groupid:uuidv4()}
    console.log(group);
    insertTodoGroup(group)
    setTaskItems([...taskItems, group])
    setTask(null);
  }

  function update(){
    setTaskItems([])
    getTodoGroup(setTaskItems)
  }

  return (
    <View style={[styles.container,{backgroundColor:theme.mode.primary}]}>
      
        <List Component={Task} data={taskItems} update={update} numColumns={1}/>
        
      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={"What's the chore today"} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});

export default Todo