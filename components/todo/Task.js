import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Keyboard,KeyboardAvoidingView} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TextInput,TouchableOpacity } from 'react-native';
import { themeContext } from '../../config/themeContext';
import { useState,useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { v4 as uuidv4 } from 'uuid';
import { deleteTodoGroup, getTodoTable, insertTodoTable, updateTodoGroupLabel, updateTodoGroupStarred } from '../../database/sqlite/todo';
import List from '../List';
import SubTask from './SubTask';
import { updateTrackerScore } from '../../database/sqlite/tracker';
const Task = ({id,name,color,star,update,groupid}) => {

    const theme = useContext(themeContext)
    const [edit,setEdit] = useState(false)
    const [label,setLabel] = useState(name);
    const [starred,setStarred] = useState((star==1)?true:false)
    const [modal,setModal] = useState(false);
    const [task,setTask] = useState();
    const [taskItems, setTaskItems] = useState([]);

    useEffect(()=>{
        async function getData(){
            console.log("Todo");
            getTodoTable(setTaskItems,groupid);
        }
        getData()
      },[])

    function handleDelete(){
      updateTrackerScore()
      deleteTodoGroup(id,groupid)
      update()
    }
    function updateSub(){
        getTodoTable(setTaskItems,groupid);
    }

    function handlelabel(){
        updateTodoGroupLabel(id,label)
    }
    function handleStarred(){
      if(starred==true)
        updateTodoGroupStarred(id,false)
      else
        updateTodoGroupStarred(id,true)
    }
    function handleAddTask(){
        Keyboard.dismiss()
        const obj = {id:uuidv4(),name:task,completed:false,parent:groupid}
        console.log(obj);
        insertTodoTable(groupid,obj)
        setTaskItems([...taskItems, obj])
        setTask(null);
        setModal(false)
    }

  return (
    <View>
    <View style={[styles.item,{backgroundColor:theme.mode.secondary}]}>
      <View style={styles.itemLeft}>
        <View style={[styles.square,{backgroundColor:color}]}></View>
       
        <BouncyCheckbox onPress={handleDelete} fillColor={theme.mode.fourth}/>
        {(edit===false)?
        <Pressable style={styles.itemText} onPress={()=>{setEdit(true)}}><Text style={{color:theme.mode.text}}>{label}</Text></Pressable>:
        <TextInput style={{color:theme.mode.text}} value={label} onChangeText={setLabel} onBlur={handlelabel}/>}
      </View>
      <View style={styles.itemRight}>
      {(starred===true)?
        <Pressable onPress={()=>{handleStarred();setStarred(false)}}><Image style={styles.circular} source={require("../../assets/filled.png")}/></Pressable>:
        <Pressable onPress={()=>{handleStarred();setStarred(true)}}><Image style={styles.circular} source={require("../../assets/star.png")} /></Pressable>
        }
        <Pressable onPress={()=>{setModal(true)}}><Image style={styles.circular} source={require("../../assets/add.png")} /></Pressable>
      </View>
      <Modal visible={modal} setVisibility={setModal} transparent={false}>
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
        
        <Button customStyleRoot={styles.btn} onClick={()=>{setModal(false)}}>Close</Button>
      </Modal>
    </View>
    <View>
        <List data={taskItems} Component={SubTask} numColumns={1} parentColor={color} update={updateSub}/>
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
    marginBottom: -10,
    elevation:7,
    marginHorizontal:10
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  itemRight:{
    flexDirection:"row",
    alignItems:"center",
    flexWrap:'wrap'
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
    maxWidth: '70%',
  },
  circular: {
    width: 25,
    height: 25,
    marginHorizontal:5,
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
  writeTaskWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  btn:{
    marginTop:30,
    minWidth:200
},
});

export default Task;