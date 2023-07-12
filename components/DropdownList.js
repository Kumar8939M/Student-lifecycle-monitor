import { useContext, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {View,StyleSheet, Text} from "react-native"
import { themeContext } from '../config/themeContext';

function DropdownList({data,value,setValue,label}){

    const theme = useContext(themeContext);
    function handleChange(item){
        setValue(item.value)
    }

    return(
        <View style={styles.root}>
            <Text style={[styles.label,{color:theme.mode.fifth}]}>{label}</Text>
            <Dropdown placeholderStyle={{color:theme.mode.fifth}} selectedTextStyle={{color:theme.mode.fifth}} containerStyle={styles.listContainer} style={[styles.dropdown,{borderColor:theme.mode.fourth,color:theme.mode.fifth}]} data={data} onChange={handleChange} value={value} maxHeight={200} labelField={"label"} valueField={"value"} placeholder={"Select"}/>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        width:"30%",
        justifyContent:"center",
        alignItems:"center",
        marginBottom:10
    },
    dropdown:{
        width:"95%",
        padding:5,
        borderRadius:7,
        borderWidth:2,
    },
    listContainer:{
        borderColor:"#989898",
        borderRadius:8,
        borderWidth:0.5,
    },
    label:{
        alignSelf:"flex-start",
        left:10
    }
})

export default DropdownList;