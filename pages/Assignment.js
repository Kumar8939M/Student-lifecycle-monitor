import { View ,StyleSheet,Pressable,Text} from "react-native"
import { useContext, useEffect } from "react"
import { useState } from "react"
import Modal from "../components/Modal"
import AssignmentInput from "../components/assignment/AssignmentInput"
import AssignmentCard from "../components/assignment/AssignmentCard"
import List from "../components/List"
import { getAssignment } from "../database/sqlite/assignment"
import { themeContext } from "../config/themeContext"

function Assignment(){
    // const item1 = {id:1,name:"First",description:"Description",due:new Date(),priority:1,progress:0.5,reminder:0}
    // const item2 = {id:2,name:"Second",description:"Description",due:new Date(),priority:0,progress:0.3,reminder:0}
    // const item3 = {id:3,name:"Third",description:"Description",due:new Date(),priority:1,progress:0.1,reminder:1}
    const [assignmentItems,setAssignmentItems] = useState([])
    const [modal,setModal] = useState(false)
    function handleAddTask(){ 
        setModal(true)
    }
    const theme = useContext(themeContext)

    useEffect(()=>{
        async function getData(){ 
            getAssignment(setAssignmentItems)
        }
        getData()
      },[])

      function update(){
        setAssignmentItems([])
        getAssignment(setAssignmentItems)
      }
    return(
        <View style={[styles.root,{backgroundColor:theme.mode.primary}]}>
            <View style={[styles.viewContainer]}>
                <List data={assignmentItems} Component={AssignmentCard} update={update} numColumns={1}/>
            </View>
            <View  style={[styles.addContainer]}>
                <Pressable onPress={() => handleAddTask()}>
                <View style={styles.addWrapper}>
                    <Text style={styles.addText}>+</Text>
                </View>
                </Pressable>
            </View>
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                <AssignmentInput update={update} setModal={setModal}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
})

export default Assignment