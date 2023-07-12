import { Pressable, View,Text, StyleSheet } from "react-native"
import { useContext, useEffect, useState } from "react"
import Modal from "../components/Modal"
import SchedulerInput from "../components/scheduler/SchedulerInput"
import List from "../components/List"
import ScheduleCard from "../components/scheduler/SchedulerCard"
import { getScheduler } from "../database/sqlite/scheduler"
import { themeContext } from "../config/themeContext"

function Scheduler(){
    // const item1 = {id:1,name:"First",description:"Hello there this is the first one",time:new Date(),repeat:true,repeatby:"Day",repeatvalue:["Friday","Saturday","Sunday"],location:"",priority:true,notificationid:"",reminder:false}
    // const item2 = {id:2,name:"Second",description:"Hello there this is the second one",time:new Date(),repeat:true,repeatby:"Date",repeatvalue:new Date("01/10/23"),location:"",priority:true,notificationid:"",reminder:false}
    const [scheduleItems,setScheduleItems] = useState([])
    const [modal,setModal] = useState(false)
    const theme = useContext(themeContext)
    function handleAddTask(){ 
        setModal(true)
    }

    useEffect(()=>{
        async function getData(){ 
            getScheduler(setScheduleItems)
        }
        getData()
      },[])

      function update(){
        setScheduleItems([])
        getScheduler(setScheduleItems)
      }

    return(
        <View style={[styles.root,{backgroundColor:theme.mode.primary}]}>
            <View style={[styles.viewContainer]}>
                <List data={scheduleItems} Component={ScheduleCard} update={update} numColumns={1}/>
            </View>
            <View  style={[styles.addContainer]}>
                <Pressable onPress={() => handleAddTask()}>
                <View style={styles.addWrapper}>
                    <Text style={styles.addText}>+</Text>
                </View>
                </Pressable>
            </View>
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                <SchedulerInput update={update} setModal={setModal}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create(({
    root:{
        flex:1
    },
    viewContainer:{
        flex:1
    },
    addContainer:{
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        position:"absolute",
        bottom:30
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
}))

export default Scheduler