import { useContext } from "react"
import { Text,Switch as NativeSwitch,View, StyleSheet } from "react-native"
import { color } from "react-native-reanimated"
import { themeContext } from "../config/themeContext"

function Switch({value,setValue,label}){
    const theme = useContext(themeContext)
    return(
        <View style={[styles.root]}>
            <NativeSwitch thumbColor={theme.mode.secondary} trackColor={{ false: theme.mode.fifth, true: theme.mode.third }} style={{ transform:[{ scaleX: 1.2 }, { scaleY: 1.2 }] }} value={value} onChange={()=>setValue((pre)=>!pre)}/>
            <Text style={[{color:theme.mode.fifth}]}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
    }
})

export default Switch