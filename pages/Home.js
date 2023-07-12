import { useContext, useEffect, useState } from "react"
import { Pressable, ScrollView, View,RefreshControl ,Text,StyleSheet,SafeAreaView} from "react-native"
import { createNotepad } from "../database/sqlite/notepad";
import { createTracker } from "../database/sqlite/tracker";
import { createAssignment, getAssignment, getAssignmentHome } from "../database/sqlite/assignment";
import { createScheduler, getScheduler, getSchedulerHome } from "../database/sqlite/scheduler";
import { createTodoGroup, getTodoGroup, getTodoGroupHome } from "../database/sqlite/todo";
import List from "../components/List";
import Task from "../components/todo/Task";
import RoundIconBtn from "../components/notepad/RoundIconBtn";
import AssignmentCard from "../components/assignment/AssignmentCard";
import SchedulerCard from "../components/scheduler/SchedulerCard";
import { useNavigation } from "@react-navigation/native";
import { themeContext } from "../config/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../components/LoadingOverlay";
import { Dimensions } from "react-native";

function Home(){
    const [todo,setTodo] = useState([]);
    const [assignment,setAssignment] = useState([]);
    const [schedule,setSchedule] = useState([]);
    const [refreshing,setRefreshing] = useState(false)
    const navigation = useNavigation();
    const [greet, setGreet] = useState('');
    const [username,setName] = useState('')
    const theme = useContext(themeContext)
    const [loading,setLoading] = useState(false)

    const findGreet = async () => {
        const hrs = new Date().getHours();
        if (hrs === 0 || hrs < 12) return setGreet('Morning');
        if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
        setGreet('Evening');
        const name = await AsyncStorage.getItem("User")
        setName(name);
        return true
    };

    useEffect(()=>{

        async function call(){
            createTracker();
            createNotepad();
            createAssignment();
            createScheduler();
            createTodoGroup();
            update()
            await findGreet()
        }
        call()
    },[])


    const quotes = [
        "Believe you can and you’re halfway there",
        "You have to expect things of yourself before you can do them",
        "It always seems impossible until it's done",
        "Don't let what you cannot do interfere with what you can do",
        "Start where you are. Use what you have. Do what you can",
        "Strive for progress, not perfection",
       " There is no substitute for hard work.",
        'The difference between ordinary and extraordinary is that little "extra"',
        "You don't always get what you wish for; you get what you work for",
        "Don't let your victories go to your head, or your failures go to your heart"
    ]

    const screenHeight = Dimensions.get('window').height


    function update(){
        getTodoGroupHome(setTodo);
        getAssignmentHome(setAssignment)
        getSchedulerHome(setSchedule)
    }

    function onRefresh(){
        setRefreshing(true)
        update()
        setRefreshing(false)
    }

    if(loading===true){
        return <LoadingOverlay />
    }

    return(
        <SafeAreaView  style={[styles.root,{backgroundColor:theme.mode.primary,height:"auto",maxHeight:screenHeight}]}>
            <ScrollView nestedScrollEnabled={true} contentContainerStyle={[styles.scroll]} refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            }>
                {/* <Text style={[styles.header,{color:theme.mode.fifth}]}>{`Good ${greet} ${username}`}</Text>
                <Text style={[{color:theme.mode.fifth,marginTop:10,marginBottom:30,fontSize:14}]}>{quotes[(Math.floor(Math.random()*10))]}</Text>
                    <View style={[styles.section]}>
                        <Text style={[styles.title,{color:theme.mode.fifth}]}>Starred Todo's</Text>
                        {(todo.length>0)?
                        <List update={update} style={{alignItems:"flex-start"}} horizontal={true} data={todo} numColumns={1} Component={Task}/>
                        :
                        <Text style={[styles.records,{color:theme.mode.fifth}]}>
                            No Records!
                        </Text>
                        }
                        <RoundIconBtn style={styles.btn} onPress={()=>{navigation.navigate("Todo")}} antIconName={"rightcircleo"}/>
                    </View>
        
                    <View style={[styles.section,{flex:2,minHeight:400}]}>
                        <Text style={[styles.title,{color:theme.mode.fifth}]}>Upcoming Assignment's</Text>
                        {(assignment.length>0)?
                        <List update={update}  horizontal={true} data={assignment} numColumns={1} Component={AssignmentCard}/>:
                        <Text style={[styles.records,{color:theme.mode.fifth}]}>
                            No Records!
                        </Text>
                        }
                        <RoundIconBtn style={styles.btn} antIconName={"rightcircleo"} onPress={()=>{navigation.navigate("Assignment")}}/>
                    </View>
                    <View style={[styles.section]}>
                        <Text style={[styles.title,{color:theme.mode.fifth}]}>Scheduled events's</Text>
                        {(schedule.length>0)?
                        <List update={update} style={{alignItems:"center"}} horizontal={true} data={schedule} numColumns={1} Component={SchedulerCard}/>:
                        <Text style={[styles.records,{color:theme.mode.fifth}]}>
                            No Records
                        </Text>
                        }
                        <RoundIconBtn style={styles.btn} antIconName={"rightcircleo"} onPress={()=>{navigation.navigate("Scheduler")}}/>
                    </View> */}
                    <Text style={[styles.header,{color:theme.mode.fifth}]}>{`Good ${greet} ${username}`}</Text>
                    <Text style={[{color:theme.mode.fifth,marginTop:10,marginBottom:30,fontSize:14}]}>{quotes[(Math.floor(Math.random()*10))]}</Text>
                    <View style={styles.section}>
                        <Text style={[styles.title,{color:theme.mode.fifth}]}>Starred Todo's</Text>
                        {(todo.length>0)?
                            <List update={update} style={{alignItems:"flex-start"}} horizontal={true} data={todo} numColumns={1} Component={Task}/>
                            :
                            <Text style={[styles.records,{color:theme.mode.fifth}]}>
                                No Records!
                            </Text>
                        }
                        <RoundIconBtn style={styles.btn} onPress={()=>{navigation.navigate("Todo")}} antIconName={"rightcircleo"}/>
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.title,{color:theme.mode.fifth}]}>Upcoming Assignment's</Text>
                        {(assignment.length>0)?
                            <List update={update}  horizontal={true} data={assignment} numColumns={1} Component={AssignmentCard}/>:
                            <Text style={[styles.records,{color:theme.mode.fifth}]}>
                                No Records!
                            </Text>
                        }
                        <RoundIconBtn style={styles.btn} antIconName={"rightcircleo"} onPress={()=>{navigation.navigate("Assignment")}}/>
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.title,{color:theme.mode.fifth}]}>Scheduled events's</Text>
                        {(schedule.length>0)?
                            <List update={update} style={{alignItems:"center"}} horizontal={true} data={schedule} numColumns={1} Component={SchedulerCard}/>:
                            <Text style={[styles.records,{color:theme.mode.fifth}]}>
                                No Records
                            </Text>
                        }
                        <RoundIconBtn style={styles.btn} antIconName={"rightcircleo"} onPress={()=>{navigation.navigate("Scheduler")}}/>
                    </View>
            </ScrollView>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    root:{
        flex:1
    },
    scroll:{
        padding:10,
    },
    section:{
        flex:1,
        minHeight:300,
        alignItems:"center",
    },
    title:{
        fontSize:20,
        fontWeight:"bold",
        marginBottom:20
    },
    records:{
        fontSize:25,
        marginTop:20
    },
    btn:{
        position:"absolute",
        bottom:20,
        right:20,
        maxWidth:55
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
    },

})

export default Home