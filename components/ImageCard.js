
import { Pressable, StyleSheet, View } from "react-native"
import { Image } from "react-native";
import { Alert } from "react-native";

export default function ImageCard({url,deleteImage,viewOnly}){


    function longHandler(){
        console.log(url);
        if(viewOnly===false){
                Alert.alert("Warning","You are trying to delete this Document are you Sure",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "Yes", onPress: () => {deleteImage(url)}}
            ]
            )
        }
        
    }
    return(
        <View style={styles.root}>
            <Pressable  onLongPress={longHandler}>
                <Image
                    source={{ uri: url }}
                    style={[{width: "100%", height: 250},styles.image]}
                />
            </Pressable>
        </View>
        
    )
}



const styles = StyleSheet.create({
    root:{
        flex:1,
        padding:10
    },
    image:{
        borderRadius:7,
        backgroundColor:"#000",
        overflow:"hidden"
    }
})