import { useContext, useRef, useState } from "react";
import { StyleSheet, View ,Text,Pressable,Image,TextInput} from "react-native";
import Modal from "../Modal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { themeContext } from "../../config/themeContext";
import { ProgressBar } from 'react-native-paper';
import AssignmentInput from "./AssignmentInput";
import { deleteAssignment, updateAssignment } from "../../database/sqlite/assignment";
import { updateTrackerScore } from "../../database/sqlite/tracker";

function AssignmentCard(props){
    let {name,description,due,priority,progress,reminder,update} = props
    console.log(typeof due);
    const[importance,setImportance] = useState(priority)
    const[modal,setModal] = useState(false)
    const theme = useContext(themeContext)
    const [edit,setEdit] = useState(false)
    const [load,setLoad] = useState(progress)
    function handlePriority(state){
        console.log(state);
        updateAssignment(props.id,"priority",state)
        update()
    }

    function handleDelete(){
        deleteAssignment(props.id)
        update();
    }

    function differnce(){
        let date = new Date();
        let diff = date.getTime()-due.getTime()
        let remainingDays = Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
        return remainingDays+1
    }

    function calcProgress(){
        return load*100
    }

    function setProgress(v){
        setLoad(v/100)
    }

    function handleProgress(){
        setEdit(false)
        if(load>=1){
            updateTrackerScore()
            deleteAssignment(props.id)
        }else{
            updateAssignment(props.id,"progress",load)
        }
        update()
    }
    

    return(
        <View style={[styles.root,{backgroundColor:theme.mode.secondary}]}>
            <View style={styles.itemLeft}>
                <Text style={[{color:theme.mode.text}]}>{name}</Text>
                <Text style={[{color:theme.mode.text}]}>{description}</Text>
                <Text  style={[{color:theme.mode.text}]}>{`Remaining days : ${differnce()}`}</Text>
                <View style={[styles.progressContainer]}>
                    <ProgressBar style={[styles.progress,{borderColor:theme.mode.third}]} progress={progress} color={theme.mode.third} />
                    {(edit===false)?
                        <Pressable  onPress={()=>{setEdit(true)}}><Text style={[{color:theme.mode.text}]} >{`${calcProgress()}%`}</Text></Pressable>:
                        <TextInput style={[{color:theme.mode.text}]} value={load} onChangeText={setProgress} onBlur={handleProgress}/>
                    }
                </View>
            </View>
            <View style={styles.itemRight}>
                {(importance===true)?
                <Pressable onPress={()=>{handlePriority(false);setImportance(false)}}><Image style={styles.circular} source={require("../../assets/filled.png")}/></Pressable>:
                <Pressable onPress={()=>{handlePriority(true);setImportance(true)}}><Image style={styles.circular} source={require("../../assets/star.png")} /></Pressable>
                }
                <Pressable onPress={()=>{setModal(true)}}><Image style={styles.circular} source={require("../../assets/edit.png")} /></Pressable>
                <BouncyCheckbox onPress={handleDelete} fillColor={theme.mode.fourth}/>
            </View>
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                <AssignmentInput update={update} data={props} setModal={setModal}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        elevation:7,
        marginHorizontal:10,
        flex:1,
    },
    itemLeft: {
        flex:1,
        flexDirection: 'column',
        minHeight:150,
        justifyContent:"space-between",
        flexWrap:"wrap"
    },
    itemRight:{
        flexDirection:"row",
        flexWrap:'wrap',
        justifyContent:"flex-start",
        position:"absolute",
        right:10,
        top:20
    },
    circular: {
        width: 25,
        height: 25,
        marginHorizontal:5,
    },
    progress:{
        maxWidth:"90%",
        borderWidth:1,
        marginTop:10
    },
    progressContainer:{
        flexDirection:"row"
    }
})
export default AssignmentCard;