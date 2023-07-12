import Checkbox from 'expo-checkbox';
import { useContext, useState } from 'react';
import { StyleSheet,View ,Text} from 'react-native';
import { themeContext } from '../../config/themeContext';

function PickDay({value,setValue}){
    const [monday,setMonday] = useState(((value)&&(value.includes("Monday"))?true:false))
    const [tuesday,setTuesday] = useState(((value)&&(value.includes("Tuesday"))?true:false))
    const [wednesday,setWednesday] = useState(((value)&&(value.includes("Wednesday"))?true:false))
    const [thursday,setThursday] = useState(((value)&&(value.includes("Thursday"))?true:false))
    const [friday,setFriday] = useState(((value)&&(value.includes("Friday"))?true:false))
    const [saturday,setSaturday] = useState(((value)&&(value.includes("Saturday"))?true:false))
    const [sunday,setSunday] = useState(((value)&&(value.includes("Sunday"))?true:false))
    const theme = useContext(themeContext)

    function onValueChange(selected,state){
        var arr = []
        if(monday==true || (selected==="Monday" && state==true))
            arr.push("Monday")
        if(tuesday==true|| (selected==="Tuesday" && state==true))
            arr.push("Tuesday")
        if(wednesday==true|| (selected==="Wednesday" && state==true))
            arr.push("Wednesday")
        if(thursday==true|| (selected==="Thursday" && state==true))
            arr.push("Thursday")
        if(friday==true|| (selected==="Friday" && state==true))
            arr.push("Friday")
        if(saturday==true|| (selected==="Saturday" && state==true))
            arr.push("Saturday")
        if(sunday==true|| (selected==="Sunday" && state==true))
            arr.push("Sunday")
        
        setValue(arr);
    }

    return(
        <View style = {[styles.root]}>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={monday} onValueChange={(e)=>{setMonday(e);onValueChange("Monday",e)}}/>
                <Text style={{color:theme.mode.fourth}}>  Mon</Text>
            </View>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={tuesday} onValueChange={(e)=>{setTuesday(e);onValueChange("Tuesday",e)}}/>
                <Text style={{color:theme.mode.fourth}} >  Tue</Text>
            </View>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={wednesday} onValueChange={(e)=>{setWednesday(e);onValueChange("Wednesday",e)}}/>
                <Text style={{color:theme.mode.fourth}}>  Wed</Text>
            </View>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={thursday} onValueChange={(e)=>{setThursday(e);onValueChange("Thursday",e)}}/>
                <Text style={{color:theme.mode.fourth}}>  Thu</Text>
            </View>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={friday} onValueChange={(e)=>{setFriday(e);onValueChange("Friday",e)}}/>
                <Text style={{color:theme.mode.fourth}}>  Fri</Text>
            </View>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={saturday} onValueChange={(e)=>{setSaturday(e);onValueChange("Saturday",e)}}/>
                <Text style={{color:theme.mode.fourth}}>  Sat</Text>
            </View>
            <View style = {[styles.btn,{backgroundColor:theme.mode.secondary}]}>
                <Checkbox color={theme.mode.third} value={sunday} onValueChange={(e)=>{setSunday(e);onValueChange("Sunday",e)}}/>
                <Text style={{color:theme.mode.fourth}}>  Sun</Text>
            </View>    
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        flexDirection:"row",
        flexWrap:"wrap",
        alignItems:'center',
        justifyContent:"center",
        margin:20
    },
    btn:{
        flexDirection:"row",
        flexWrap:"wrap",
        padding:10,
        borderWidth:0.5
    }
})

export default PickDay