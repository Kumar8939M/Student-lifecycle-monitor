import Button from './Button';
import { StyleSheet, View } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';

function TimeDatePicker({value,setValue,mode}){
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setText(`Picked ${currentDate.toLocaleString()}`)
        setValue(currentDate);
    };

    const [text,setText] = useState("Pick "+mode)
    
    const showPicker = () => {
        DateTimePickerAndroid.open({
          value: (value)?value:new Date(),
          onChange,
          mode: mode,
          is24Hour: false,
        });
    };

    return(
        <View>
            <Button customStyleText={{color:"#000"}} customStyle={{backgroundColor:"#fff"}} customStyleRoot={styles.btn} onClick={showPicker}>{text}</Button>
        </View>
        
    )
}

const styles = StyleSheet.create({
    btn:{
        minWidth:"95%",
        marginVertical:10
    }
})

export default TimeDatePicker;