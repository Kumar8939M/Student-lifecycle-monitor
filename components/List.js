import { useContext } from "react";
import { FlatList } from "react-native";
import { themeContext } from "../config/themeContext";
import { StyleSheet,View } from "react-native";


function List({style,horizontal,Component,data,numColumns,update,parentColor}){

    function renderItem({item,index}){
        return(
            <Component {...item} index={index} update={update} parentColor={parentColor}/>
        )
    }

    return(
        <View style={styles.root}>
            <FlatList 
            data={data}
            horizontal={horizontal}
            renderItem={renderItem}
            keyExtractor={(item)=>item.id}
            numColumns={numColumns}
            contentContainerStyle={style}
            nestedScrollEnabled={true}
            />
        </View>
        
    )
}

const styles = StyleSheet.create({
    root:{
        paddingTop:30,
        paddingHorizontal:10,
        flex:1,
    }
})


export default List