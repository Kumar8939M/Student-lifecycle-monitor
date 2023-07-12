import { useEffect, useState,useRef } from "react";
import { Alert, StyleSheet,View } from "react-native";
import Button from "../Button";
import Input from "../Input";
import RadioButton from "../RadioButton";
import Switch from "../Switch";
import TimeDatePicker from "../TimeDatePicker";
import PickDay from "./PickDay";
import Title from "../Title";
import { ScrollView } from "react-native";
import { dropNotification, initializeNotification, schedulePushNotification } from "../../config/NotificationProvider";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { insertScheduler, updateSchedulerAll } from "../../database/sqlite/scheduler";
import { cancelScheduledNotificationAsync } from "expo-notifications";

function SchedulerInput({data,setModal,update}){

    const[name,setName] = useState((data)?data.name:null);
    const[description,setDescription] = useState((data)?data.description:null);
    const[time,setTime] = useState((data)?data.time:null);
    const [repeat,setRepeat] = useState((data)?data.repeat:false);
    const [repeatBy,setRepeatBy] = useState((data)?data.repeatby:"Date");
    const [repeatValue,setRepeatValue] = useState((data)?data.repeatvalue:new Date());
    const [location,setLocation] = useState((data)?data.location:null);
    const [notificationId,setNotificationId] = useState((data)?data.notificationid:[]);
    const [reminder,setReminder] = useState((data)?data.reminder:false);
    const [priority,setPriority] = useState((data)?data.priority:false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    

    function notificationResponse(res){
        console.log(res);
    }

    useEffect(()=>{
        initializeNotification(setExpoPushToken,setNotification,notificationListener,responseListener,notificationResponse)

        return ()=>{
            dropNotification(notificationListener,responseListener)
        }
    },[])

    const option = [
        {label: 'Day'},
        {label: 'Date'}
    ];

    var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    

    async function handleAdd(){
        if(name == null || name=="" || description == null || description=="" || time == null ){
            Alert.alert("Warning","Fill all fields");
            return;
        }

        if(notificationId.length>0){
            for(var i=0;i<notificationId.length;i++){
                cancel(notificationId[i])
            }
            setNotificationId([])
            async function cancel (data){
                await cancelScheduledNotificationAsync(data);
            }
        }

        if(reminder===true){
            if(repeat===true){
                if(repeatBy==="Day"){
                    // for(var i=0;i<repeatValue.length;i++){
                    //     const trigger = {weekday:days.indexOf(repeatValue[i])+1,hour:time.getHours(),minute:time.getMinutes(),repeat:true}
                    //     console.log(trigger);
                    //     const res = await schedulePushNotification("Scheduled Event",name,{},trigger)
                    //     setNotificationId((pre)=>[...pre,res])
                    // }
                    const trigger = {date:time,repeat:true}
                    const res = await schedulePushNotification("Scheduled Event",name,{},trigger)
                    setNotificationId((pre)=>[...pre,res])
                }else{
                    const trigger = repeatValue
                    const res = await schedulePushNotification("Scheduled Event",name,{},trigger)
                    setNotificationId((pre)=>[...pre,res])
                }
            }else{
                const trigger = time
                const res = await schedulePushNotification("Scheduled Event",name,{},trigger)
                setNotificationId((pre)=>[...pre,res])
            }
        }

        const item = {
            id:uuidv4(),
            name:name,
            description:description,
            time:time.toString(),
            repeat:repeat,
            repeatby:repeatBy,
            repeatvalue:repeatValue.toString(),
            location:location,
            priority:priority,
            notificationid:notificationId.toString(),
            reminder:reminder
        }

        console.log(item);
        if(data){
            updateSchedulerAll(data.id,item)
            update();
        }else{
            insertScheduler(item);
            update();
        }

        setModal(false)
    }


    return (
        <ScrollView contentContainerStyle={styles.scroll} style={styles.root} >
            <Title>Enter</Title>
            <Input label={"Name"} value={name} setValue={setName}/>
            <Input label={"Description"} value={description} setValue={setDescription}/>
            <Input label={"Location"} value={location} setValue={setLocation}/>
            <TimeDatePicker mode={"time"} value={time} setValue={setTime}/>
            <View style={styles.rowContainer}>
                <Switch value={reminder} setValue={setReminder} label={"Reminder"}/>
                <Switch value={priority} setValue={setPriority} label={"Priority"}/>
                <Switch value={repeat} setValue={setRepeat} label={"Repeat"}/>
            </View>
            {(repeat===true) &&
            <View style={styles.cont2}>
                <RadioButton data={option} value={repeatBy} setValue={setRepeatBy}/>
                {(repeatBy==="Day")?
                <PickDay value={(repeatValue.length)?repeatValue:[]} setValue={setRepeatValue}/>:
                <TimeDatePicker mode={"date"} value={repeatValue} setValue={setRepeatValue} />
                }
            </View>
            }
            <View style={styles.btnContainer}>
                <Button onClick={()=>{setModal(false)}}>Cancel</Button>
                <Button onClick={handleAdd}>{(data)?"Update":"Add"}</Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    
    scroll:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"

    },
    root:{
        width:"90%"
    },
    cont2:{
        marginVertical:10
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

export default SchedulerInput;