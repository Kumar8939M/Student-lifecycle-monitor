import { Pressable, View ,StyleSheet} from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';

function IconButton({name,onClick}){
    return (
        <View style={styles.root}>
            <Pressable onPress={onClick} style={styles.press}>
                <Ionicons name={name} size={30} color={"#923"} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        height:40,
        width:40,
        overflow:"hidden",
        borderRadius:8,
        margin:5,
        elevation:8
    },
    press:{
        flex:1,
        backgroundColor:"white",
        borderColor:"#000",
        borderWidth:3,
        borderRadius:8,
        alignItems:"center",
        justifyContent:"center"
    }
})

export default IconButton