import RadioButtonRN from 'radio-buttons-react-native';
import { View } from 'react-native';

function RadioButton({data,value,setValue}){

    var initial = 1
    if("Date"===value){
        initial =2
    }
    function handle(e){
        console.log(e.label);
        setValue(e.label)
    }
    return(
        <View>
            <RadioButtonRN data={data} selectedBtn={handle} initial={initial}/>
        </View>
    )
}

export default RadioButton