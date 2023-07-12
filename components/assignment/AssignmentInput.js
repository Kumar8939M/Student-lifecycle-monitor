import { StyleSheet,View,ScrollView, Alert} from "react-native"
import Title from "../Title";
import Input from "../Input";
import TimeDatePicker from "../TimeDatePicker"; 
import Switch from "../Switch";
import Button from "../Button";
import { useState,useRef,useEffect, useContext } from "react";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { initializeNotification, dropNotification, schedulePushNotification } from "../../config/NotificationProvider";
import { cancelScheduledNotificationAsync } from "expo-notifications";
import { insertAssignment, updateAssignmentAll } from "../../database/sqlite/assignment";
import { themeContext } from "../../config/themeContext";

function AssignmentInput({data,setModal,update}){

    const [name,setName] = useState((data)?data.name:null);
    const [description,setDescription] = useState((data)?data.description:null);
    const [due,setDue] = useState((data)?data.due:null);
    const [reminder,setReminder] = useState((data)?data.reminder:false);
    const [priority,setPriority] = useState((data)?data.priority:false);
    const [notificationid,setNotificationId] = useState((data)?data.notificationid:[])
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const theme = useContext(themeContext)

    function notificationResponse(res){
        console.log(res);
    }

    useEffect(()=>{
        initializeNotification(setExpoPushToken,setNotification,notificationListener,responseListener,notificationResponse)

        return ()=>{
            dropNotification(notificationListener,responseListener)
        }
    },[])

    async function handleAdd(){
        if(name==null || name==="" || description==null || description==="" || due==null){
            Alert.alert("Warning","Please Fill all the details");
            return
        }

        if(notificationid.length>0){
            for(var i=0;i<notificationid.length;i++){
                cancel(notificationid[i])
            }
            setNotificationId([]);
            async function cancel (data){
                await cancelScheduledNotificationAsync(data);
            }
        }

        if(reminder===true){
            const trigger = due
            const res = await schedulePushNotification("You have an Assignment pending",name,{},trigger)
            setNotificationId((pre)=>[...pre,res])
        }

        const item = {
            id:uuidv4(),
            name:name,
            description:description,
            due:due.toString(),
            priority:priority,
            progress:(data)?data.progress:0,
            reminder:reminder,
            notificationid:notificationid.toString()
        }

        if(data){
            updateAssignmentAll(data.id,item)
            console.log("In update");
            update()
            return;
        }

        insertAssignment(item)
        update();
        setModal(false)
    }

    return (
        <ScrollView contentContainerStyle={[styles.scroll]} style={[styles.root]} >
            <Title>Enter</Title>
            <Input label={"Name"} value={name} setValue={setName}/>
            <Input label={"Description"} value={description} setValue={setDescription}/>
            <TimeDatePicker mode={"date"} value={due} setValue={setDue}/>
            <View style={styles.rowContainer}>
                <Switch value={reminder} setValue={setReminder} label={"Reminder"}/>
                <Switch value={priority} setValue={setPriority} label={"Priority"}/>
            </View>
            <View style={styles.btnContainer}>
                <Button onClick={()=>{setModal(false)}}>Cancel</Button>
                <Button onClick={handleAdd}>{(data)?"Update":"Add"}</Button>
            </View>
        </ScrollView>
    )
}
const styles =  StyleSheet.create({
    scroll:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    root:{
        width:"90%"
    },
    rowContainer:{
        flexDirection:"row"
    },
    btnContainer:{
        width:"90%",
        flexDirection:"row",
        minHeight:100
    }
})

export default AssignmentInput