import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "../Modal"
import SchedulerInput from "./SchedulerInput";
import { Pressable,Image } from "react-native";
import { themeContext } from "../../config/themeContext";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { deleteScheduler, updateScheduler } from "../../database/sqlite/scheduler";
import { updateTrackerScore } from "../../database/sqlite/tracker";

function SchedulerCard(props){

    
    const [priority,setPriority] = useState(props.priority)
    const [modal,setModal] = useState(false)
    const theme = useContext(themeContext)
    function handlePriority(){
        updateScheduler(props.id,"priority",priority)
    }

    function handleDelete(){
        updateTrackerScore()
        deleteScheduler(props.id)
        props.update()
    }


    return(
        <View style={[styles.root,{backgroundColor:theme.mode.secondary}]}>
            <View style={styles.itemLeft}>
                <Text style={[{color:theme.mode.text}]}>{props.name}</Text>
            </View>
            <View style={styles.itemRight}>
                {(priority===true)?
                <Pressable onPress={()=>{handlePriority();setPriority(false)}}><Image style={styles.circular} source={require("../../assets/filled.png")}/></Pressable>:
                <Pressable onPress={()=>{handlePriority();setPriority(true)}}><Image style={styles.circular} source={require("../../assets/star.png")} /></Pressable>
                }
                <Pressable onPress={()=>{setModal(true)}}><Image style={styles.circular} source={require("../../assets/edit.png")} /></Pressable>
                <BouncyCheckbox onPress={handleDelete} fillColor={theme.mode.fourth}/>
            </View>
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                <SchedulerInput update={props.update} data={props} setModal={setModal}/>
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
    circular: {
        width: 25,
        height: 25,
        marginHorizontal:5,
      },
})

export default SchedulerCard