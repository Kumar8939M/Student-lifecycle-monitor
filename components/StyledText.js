import { Text } from "react-native";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

const StyledText = ({data,style}) => {
    const arr = data.split(' ');
    const reducer = (acc, cur, index) => {
    let previousVal = acc[acc.length - 1];
    if (
        previousVal &&
        previousVal.startsWith('**') &&
        !previousVal.endsWith('**')
    ) {
        acc[acc.length - 1] = previousVal + ' ' + cur;
    } else {
        acc.push(cur);
    }
       return acc;
    };
   
    const text = arr.reduce(reducer, []);
   
    return (
    <Text style={style}>
        {text.map((text) => {
        if (text.startsWith('**')) {
            return (
            <Text key={uuidv4()} style={{ fontWeight: 'bold' }}>
                {text.replace(/[^a-zA-Z ]/g, "")}{' '}
            </Text>
            );
        }
        return `${text} `;
        })}
    </Text>
    );
};

export default StyledText