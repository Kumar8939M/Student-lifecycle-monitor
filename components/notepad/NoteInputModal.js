import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Pressable,
  Image
} from 'react-native';
import { themeContext } from '../../config/themeContext';
import RoundIconBtn from './RoundIconBtn';
import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Button from "../Button"
import ImageCard from '../ImageCard';
import DropdownList from '../DropdownList';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';


const NoteInputModal = ({ visible, onClose, onSubmit, note, isEdit }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [images,setImages] = useState([])
  const [links,setLinks] = useState('')
  const [size,setSize] = useState(12);
  const [color,setColor] = useState("#151839");
  const [font,setFont] = useState("sans-serif");
  const [star,setStar] = useState(false);
  const theme = useContext(themeContext)
  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isEdit) {
      setTitle(note.title);
      setDesc(note.desc);
      if(typeof note.images ==="string")
        setImages(note.images.split(",")) 
      else{
        setImages(note.images);
      }
      setLinks(note.links);
      setSize(note.size)
      setColor(note.color)
      setFont(note.font)
      setStar(note.star)
    }
  }, [isEdit]);

  const sizeData = [
    {label:"8",value:"8"},
    {label:"10",value:"10"},
    {label:"12",value:"12"},
    {label:"14",value:"14"},
    {label:"16",value:"16"},
    {label:"18",value:"18"},
    {label:"20",value:"20"},
  ]

  const colorData = [
    {label:"red",value:"#F60000"},
    {label:"blue",value:"#005DF6"},
    {label:"yellow",value:"#E3F600"},
    {label:"black",value:"#151839"},
    {label:"grey",value:"#717171"},
    {label:"purple",value:"#F000FF"},
    {label:"brown",value:"#B2925D"},
  ]

  const fontData =[
    {label:"notoserif",value:"notoserif"},
    {label:"sans-serif",valu:"sans-serif"},
    {label:"sans-serif-light",value:"sans-serif-light"},
    {label:"sans-serif-thin",value:"sans-serif-thin"},
    {label:"sans-serif-condensed",value:"san-serif-condensed"},
    {label:"sans-serif-medium",value:"sans-serif-medium"},
    {label:"serif",value:"serif"},
    {label:"Roboto",value:"Roboto"},
    {label:"monospave",value:"monospace"}
  ]

  const handleOnChangeText = (text, valueFor) => {
    if (valueFor === 'title') setTitle(text);
    if (valueFor === 'desc') setDesc(text);
  };

  const handleSubmit = () => {
    if (!title.trim() && !desc.trim()) return onClose();

    const item = {
      id:uuidv4(),
      title:title,
      desc:desc,
      updated:new Date().toString(),
      images:images.toString(),
      links:links,
      size:size,
      color:color,
      font:font,
      star:star
    }

    if (isEdit) {
      onSubmit(note.id,item);
    } else {
      onSubmit(item)
      setTitle('');
      setDesc('');
    }
    onClose();
  };

  const closeModal = () => {
    if (!isEdit) {
      setTitle('');
      setDesc('');
      setImages([]);
      setLinks("");
      setSize("")
      setColor("")
      setFont("")
    }
    onClose();
  };
  
  function handleDocument(){
    DocumentPicker.getDocumentAsync({type:"image/*"})
      .then(async (result)=>{
          setImages((pre)=>[...pre,result.uri])
      }).catch((e)=>{
          console.log(e);
      }) 
  }

  function handleFileDelete(id){
    const newImages = images.filter(i => i !== id);
    setImages(newImages)
  }

  function renderItem({item}){ 
    return <ImageCard url={item} deleteImage={handleFileDelete} viewOnly={false}/>
  }

  return (
    <>
      
      <Modal visible={visible} animationType='fade'>
        <View style={[{flex:1},{backgroundColor:theme.mode.primary}]}>
        <View style={styles.container}>
          <TextInput
            value={title}
            onChangeText={text => handleOnChangeText(text, 'title')}
            placeholder='Title'
            placeholderTextColor={theme.mode.fifth}
            style={[styles.input, styles.title,{borderBottomColor:theme.mode.third,color:theme.mode.fifth}]}
          />
          <TextInput
            value={desc}
            multiline
            placeholder='Note'
            placeholderTextColor={theme.mode.fifth}
            style={[styles.input, styles.desc,{borderBottomColor:theme.mode.third,color:theme.mode.fifth}]}
            onChangeText={text => handleOnChangeText(text, 'desc')}
          />
          <TextInput
            value={links}
            multiline
            placeholder='Add links comma seperated'
            placeholderTextColor={theme.mode.fifth}
            style={[styles.input, styles.desc,{borderBottomColor:theme.mode.third,color:theme.mode.fifth}]}
            onChangeText={setLinks}
          />
          
          <Button customStyleRoot={{minHeight:40,marginTop:20}} customStyle={{backgroundColor:theme.mode.fourth}} onClick={handleDocument}>
            <AntDesign name="jpgfile1" size={24} color={theme.mode.text} />
          </Button>
          <View style={styles.btnContainer}>
            <DropdownList data={sizeData} value={size} setValue={setSize} label={"Font size"}/>
            <DropdownList data={colorData} value={color} setValue={setColor} label={"Font color"}/>
            <DropdownList data={fontData} value={font} setValue={setFont} label={"Font"}/>
          </View>
          {(star===true)?
                <Pressable onPress={()=>{setStar(false)}}><Image style={styles.circular} source={require("../../assets/filled.png")}/></Pressable>:
                <Pressable onPress={()=>{setStar(true)}}><Image style={styles.circular} source={require("../../assets/star.png")} /></Pressable>
          }

          <View style={styles.btnContainer}>
            <RoundIconBtn
              size={15}
              antIconName='check'
              onPress={handleSubmit}
            />
            {title.trim() || desc.trim() ? (
              <RoundIconBtn
                size={15}
                style={{ marginLeft: 15 }}
                antIconName='close'
                onPress={closeModal}
              />
            ) : null}
          </View>
        </View>
        <View style={{flex:1}}>
          <FlatList 
                data={images}
                renderItem={renderItem}
                keyExtractor={(item)=>item}
                numColumns={2}
                
          />
        </View>
        </View>
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex:2
  },
  input: {
    borderBottomWidth: 2,
    fontSize: 20,
  },
  title: {
    height: 40,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  desc: {
    height: 100,
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  circular: {
    flex:1,
    width: 35,
    height: 35,
    marginHorizontal:5,
    position:"absolute",
    top:10,
    right:10
},
});

export default NoteInputModal;
