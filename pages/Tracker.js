import { useContext, useEffect, useState ,useCallback} from "react"
import { Image, ScrollView, StyleSheet, View,Text,RefreshControl } from "react-native"
import LoadingOverlay from "../components/LoadingOverlay";
import { getTracker, updateTracker } from "../database/sqlite/tracker";
import { ProgressBar } from 'react-native-paper';
import { themeContext } from "../config/themeContext";
import Modal from "../components/Modal";
import Button from "../components/Button"

function Tracker(){
    
    const [tracker,setTracker] = useState("");
    const theme = useContext(themeContext);
    const [modal,setModal] = useState(false)
    const [refreshing,setRefreshing] = useState(false)


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getTracker(setTracker);
        setRefreshing(false)
    }, []);

    useEffect(()=>{
        getTracker(setTracker)
    },[])

    if(typeof tracker==="string"){
        setTimeout(()=>{getTracker(setTracker)},2000)
        return <LoadingOverlay />
    }

    function handleTracker(){
        let score = tracker.score;
        if(tracker.first===0 || tracker.first<score){
            updateTracker("first",score);
            updateTracker("firstweek",new Date().toString());
            if(tracker.first!==0){
                updateTracker("second",tracker.first);
                updateTracker("secondweek",tracker.firstweek.toString());
                if(tracker.second!==0){
                    updateTracker("third",tracker.second);
                    updateTracker("thirdweek",tracker.secondweek.toString());
                }
            }
            getTracker(setTracker)
            return
        }
        if(tracker.second===0 || tracker.second<score){
            updateTracker("second",score);
            updateTracker("secondweek",new Date().toString());
            if(tracker.second!==0){
                updateTracker("third",tracker.second);
                updateTracker("thirdweek",tracker.secondweek.toString());
            }
            getTracker(setTracker)
            return
        }
        if(tracker.third===0 || tracker.third<score){
            updateTracker("third",score);
            updateTracker("thirdweek",new Date().toString());
            getTracker(setTracker)
            return
        }
        updateTracker("score",0);
        
    }

    return(
        <ScrollView contentContainerStyle={[styles.root,{backgroundColor:theme.mode.primary}]} 
        refreshControl = {
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }>
            {(tracker.score<25) && 
            <View style={{alignItems:"center"}}>
                <Image style={[styles.rewardImg]} source={require("../assets/hard-work.png")}/>
                <Text style={[styles.points,{color:theme.mode.fifth}]}>Try hard! You can do it</Text>
            </View>
            }
            {(tracker.score>24 && tracker.score<50) && 
             <View style={{alignItems:"center"}}>
                <Image style={[styles.rewardImg]} source={require("../assets/medal.png")}/>
                <Text style={[styles.points,{color:theme.mode.fifth}]}>You are there! Just a little further</Text>
            </View>
            }
            {(tracker.score>49 && tracker.score<75) && 
             <View style={{alignItems:"center"}}>
                <Image style={[styles.rewardImg]} source={require("../assets/trophy.png")}/>
                <Text style={[styles.points,{color:theme.mode.fifth}]}>Well done! you are almost there</Text>
            </View>
            }
            {(tracker.score>74) && 
             <View style={{alignItems:"center"}}>
                <Image style={[styles.rewardImg]} source={require("../assets/diamond.png")}/>
                <Text style={[styles.points,{color:theme.mode.fifth}]}>Congrats!</Text>
            </View>
            }
            <View style={{alignItems:"center"}}>
                <Text style={[styles.score,{color:theme.mode.fifth}]}>{`Score : ${tracker.score}`}</Text>
                <ProgressBar style={[styles.progress,{borderColor:theme.mode.third}]} progress={(tracker.score/100)} color={theme.mode.third} />
            </View>
            <View>
                <Button customStyle={[{paddingHorizontal:20,paddingVertical:10,backgroundColor:theme.mode.fourth}]} onClick={handleTracker}>Calculate</Button>
                <Button customStyle={[{paddingHorizontal:20,paddingVertical:10,backgroundColor:theme.mode.fourth}]} onClick={()=>{setModal(true)}}>Hall of Fame</Button>
            </View>
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                {(tracker.first!==0) ?
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={[styles.rewards]}>
                    <Text style={[styles.position,{color:theme.mode.fiftht}]}>First</Text>
                        <View style={[styles.section,{backgroundColor:"#FFD700"}]}>
                        {(tracker.score<25) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/hard-work.png")}/>
                        }
                        {(tracker.first>24 && tracker.first<50) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/medal.png")}/>
                        }
                        {(tracker.first>49 && tracker.first<75) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/trophy.png")}/>
                        }
                        {(tracker.first>74) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/diamond.png")}/>
                        }
                        <Text style={[styles.points,{color:theme.mode.fifth}]}>{`${tracker.firstweek.toLocaleDateString()} : ${tracker.first}`}</Text>
                        </View>
                    </View>
                    {(tracker.second!==0) &&
                    <View style={[styles.rewards]}>
                         <Text style={[styles.position,{color:theme.mode.fifth}]}>Second</Text>
                         <View style={[styles.section,{backgroundColor:"#C0C0C0"}]}>
                        {(tracker.score<25) && 
                            <Image style={[styles.rewardImg]} source={require("../assets/hard-work.png")}/>
                        }
                        {(tracker.second>24 && tracker.second<50) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/medal.png")}/>
                        }
                        {(tracker.second>49 && tracker.second<75) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/trophy.png")}/>
                        }
                        {(tracker.second>74) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/diamond.png")}/>
                        }
                        <Text style={[styles.points,{color:theme.mode.fifth}]}>{`${tracker.secondweek.toLocaleDateString()} : ${tracker.second}`}</Text>
                        </View>
                    </View>
                    }
                    {(tracker.third!==0) &&
                    <View style={[styles.rewards]}>
                         <Text style={[styles.position,{color:theme.mode.fifth}]}>Third</Text>
                         <View style={[styles.section,{backgroundColor:"#CD7F32"}]}>
                        {(tracker.score<25) && 
                            <Image style={[styles.rewardImg]} source={require("../assets/hard-work.png")}/>
                        }
                        {(tracker.third>24 && tracker.third<50) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/medal.png")}/>
                        }
                        {(tracker.third>49 && tracker.third<75) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/trophy.png")}/>
                        }
                        {(tracker.third>74) && 
                        <Image style={[styles.rewardImg]} source={require("../assets/diamond.png")}/>
                        }
                        <Text style={[styles.points,{color:theme.mode.fifth}]}>{`${tracker.thirdweek.toLocaleDateString()} : ${tracker.third}`}</Text>
                        </View>
                    </View>
                }
                <Button customStyle={[{paddingHorizontal:20,paddingVertical:10,backgroundColor:theme.mode.fourth}]} customStyleRoot={{marginTop:40}} onClick={()=>{setModal(false)}}>Close</Button>

                </ScrollView>:
                <View>
                    <Text style={{color:theme.mode.fifth}}>No Records</Text>
                    <View>
                        <Button customStyle={[{paddingHorizontal:20,paddingVertical:10,backgroundColor:theme.mode.fourth}]} onClick={()=>{setModal(false)}}>Close</Button>
                    </View>
                </View>
                }
            </Modal>
        </ScrollView>
)}

const styles = StyleSheet.create({
    root:{
        flex:1,
        justifyContent:"space-evenly",
        alignItems:"center"
    },
    scroll:{
        flex:1,
        justifyContent:"center"
    },
    rewardImg:{
        width:150,
        height:150
    },
    position:{
        fontSize:20,
        fontWeight:"bold"
    },
    points:{
        fontSize:15,
        fontWeight:"bold"
    },
    progress:{
        maxWidth:"90%",
        borderWidth:1,
        marginTop:10,
        padding:7,
        borderRadius:10
    },
    score:{
        fontSize:20,
        fontWeight:"bold"
    },
    rewards:{
        alignItems:"center",
        justifyContent:"center",
        padding:15,
    },
    section:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        minWidth:"82%",
        maxWidth:"99%",
        elevation:7,
        padding:10,
        borderRadius:7
    }
    
})

export default Tracker