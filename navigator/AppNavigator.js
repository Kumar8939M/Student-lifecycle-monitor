import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Assignment from "../pages/Assignment";
import Authentication from "../pages/Authentication";
import Home from "../pages/Home";
import Notepad from "../pages/Notepad";
import Scheduler from "../pages/Scheduler";
import Todo from "../pages/Todo";
import Tracker from "../pages/Tracker";
import NoteDetail from "../components/notepad/NoteDetail";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { logout } from "../database/firebase";
import { Alert } from "react-native";
import { useContext, useState } from "react";
import { theme } from "../config/Theme";
import { useEffect } from "react";
import { checkUser } from "../database/firebase";
import { themeContext,authContext } from "../config/themeContext";
import { StatusBar } from "react-native";
import LoadingOverlay from "../components/LoadingOverlay";
import { useIsFocused } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator()

function AppNavigator(){

    const themectx = useContext(themeContext)
    const authctx = useContext(authContext)
    const [loading,setLoading] = useState(true)
    const [auth,setAuth] = useState(false);

    useEffect(()=>{
        async function check(){
            setLoading(true)
            const res = await checkUser();
            console.log(typeof res);
            console.log("Auth:",res);
            setAuth(res)
            authctx.set(res)
            setLoading(false)
        }
        check()
    },[])

    function update(){
        setAuth(true)
    }

    async function handleLogout(){
        const res = await logout()
        if(res){
            setAuth(false)
            authctx.set(false)
        }else{
            Alert.alert("Warning","Sorry something went wrong try again later")
        }
    }

    function CustomDrawerContent(props){
        return(
            <DrawerContentScrollView {...props}>
                <DrawerItem label={(themectx.mode.theme==="dark")?"Light Mode":"Dark Mode"} onPress={()=>{themectx.toggle()}} labelStyle={{color:themectx.mode.statusbar}} style={{backgroundColor:(themectx.mode.theme==="dark")?theme.light.secondary:theme.dark.secondary}}/>
                <DrawerItemList {...props}/>
                <DrawerItem labelStyle={{color:themectx.mode.fifth}} label={"Logout"} onPress={handleLogout}/>
            </DrawerContentScrollView>
        )
    }

    function RenderNotepad(){
        return(
            <Stack.Navigator screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="NoteView" component={Notepad} />
                <Stack.Screen name="NoteDetail" component={NoteDetail} />
            </Stack.Navigator>
        )
    }

    function RenderAuthentication(props){
        return(
            <Authentication {...props} update={update}/>
        )
    }

    if(loading){
        return <LoadingOverlay />
    }

    if(auth){
        console.log("Drawer");
        console.log(authctx.auth);
        return(
            <>
            <StatusBar
            animated={true}
            backgroundColor={themectx.mode.primary}
            barStyle={(themectx.mode==="light"?"light-content":"dark-content")}
             />
            <Drawer.Navigator screenOptions={{
                drawerStyle:{backgroundColor:themectx.mode.primary},
                drawerInactiveTintColor:themectx.mode.fifth,
                headerStyle:{backgroundColor:themectx.mode.primary},
                headerTintColor:themectx.mode.fifth
            }} drawerContent={(props)=><CustomDrawerContent {...props}/>}>
                <Drawer.Screen options={{title:"Student life tracker"}} name="Home" component={Home} />
                <Drawer.Screen name="Assignment" component={Assignment} />
                <Drawer.Screen name="Scheduler" component={Scheduler} />
                <Drawer.Screen name="Todo" component={Todo} />
                <Drawer.Screen name="Notepad" component={RenderNotepad} />
                <Drawer.Screen name="Tracker" component={Tracker} />
            </Drawer.Navigator>
            </>
        )
    }else{
        console.log("Authentication");
        return(
            <>
            <StatusBar
            animated={true}
            backgroundColor={themectx.mode.primary}/>
            <Stack.Navigator screenOptions={{
                headerShown:false
            }}>
                <Stack.Screen name="Authentication" component={RenderAuthentication} />
            </Stack.Navigator>
            </>
        )
    }

    
}

export default AppNavigator