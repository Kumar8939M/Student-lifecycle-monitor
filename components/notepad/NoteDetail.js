import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert,FlatList} from 'react-native';
import RoundIconBtn from './RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from '../../config/NoteProvider';
import NoteInputModal from './NoteInputModal';
import { themeContext } from '../../config/themeContext';
import StyledText from '../StyledText';
import { deleteNotepad, updateNoteAll } from '../../database/sqlite/notepad';
import ImageCard from '../ImageCard';
import * as Linking from 'expo-linking';


const formatDate = ms => {
  if(typeof ms==="string"){
    ms = new Date(ms)
  }
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
};

const NoteDetail = props => {
  const [note, setNote] = useState(props.route.params.note);
  const { notes, setNotes } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [images,setImages] = useState([]);
  const [links,setLinks] = useState(props.route.params.note.links.split(","));
  const theme = useContext(themeContext)
  console.log(note);

  useEffect(()=>{
    if(typeof note.images ==="string"){
      setImages(note.images.split(",")) 
      console.log(note.images);
    }
    else{
        setImages(note.images);
        console.log(note.images);
    }
    
  },[])

  const deleteNote = async () => {
    deleteNotepad(note.id)

    const newNotes = notes.filter(n => n.id !== note.id);
    setNotes(newNotes);
    props.navigation.goBack();
  };

  const displayDeleteAlert = () => {
    Alert.alert(
      'Are You Sure!',
      'This action will delete your note permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteNote,
        },
        {
          text: 'No Thanks',
          onPress: () => console.log('no thanks'),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleUpdate = async (id,item) => {
    updateNoteAll(id,item)
    item.id = id
    if(!item.images.trim()){
      item.images = []
    }else{
      item.images = item.images.split(",");
    }
    setNote(item)
  };
  const handleOnClose = () => setShowModal(false);

  const openEditModal = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  function renderItem({item}){ 
    return <ImageCard url={item} viewOnly={true}/>
  }

  async function linkHandler(data){
    if(await Linking.canOpenURL(data)===true){
      Linking.openURL(data);
    }else{
      Alert.alert("Warning","Invalid Link")
    }
  }

  return (
    <View style={{flex:1,backgroundColor:theme.mode.primary}}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 30,backgroundColor:theme.mode.primary }]}
      >
        <Text style={[styles.time,{color:theme.mode.fifth}]}>
            {`Updated At ${formatDate(note.updated)}`}
        </Text>
        <Text style={[styles.title,{color:theme.mode.fifth}]}>{note.title}</Text>
        <StyledText style={[styles.desc,{color:note.color,fontSize:parseInt(note.size),fontFamily:note.font}]} data={note.desc}/>
        <Text style={{fontSize:20,marginTop:20,color:theme.mode.text}}>Hyperlinks</Text>
        {
          ((typeof links ==="object") && links.length>0) &&
          <View>
            {links.map((data)=>{
              return <Text style={{color:"blue",textDecorationLine:"underline",fontSize:16}} key={data} onPress={()=>{linkHandler(data)}}>{data}</Text>
            })}
          </View>
        }
      </ScrollView>
      <View style={{flex:1,overflow:"scroll",marginTop:40,backgroundColor:theme.mode.primary}}>
        <FlatList 
                  data={images}
                  renderItem={renderItem}
                  keyExtractor={(item)=>item}
                  numColumns={2}
                  
          />
      </View>
      
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName='delete'
          style={{ backgroundColor: theme.mode.fourth, marginBottom: 15 }}
          onPress={displayDeleteAlert}
        />
        <RoundIconBtn antIconName='edit' onPress={openEditModal} />
      </View>
      <NoteInputModal
        isEdit={isEdit}
        note={note}
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 3,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 20,
    opacity: 0.6,
  },
  time: {
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.5,
  },
  btnContainer: {
    position: 'absolute',
    right: 15,
    bottom: 50,
  },
});

export default NoteDetail;
