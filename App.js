import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigator/AppNavigator';
import { theme } from './config/Theme';
import { useReducer } from 'react';
import { themeContext,authContext } from './config/themeContext';
import NoteProvider from './config/NoteProvider';

export default function App() {

  function reducer(state,action){
    switch (action.type){
      case "Toggle":
        if(state.theme==="dark")
          return theme.light
        else
          return theme.dark
      case "Auth":
        return action.state
    }
  }

  function toggle(){
    themeDispatch({type:"Toggle"})
  }

  function setAuth(state){
    authDispatch({type:"Auth",state:state})
  }

  const [mode,themeDispatch] = useReducer(reducer,theme.light) 
  const [auth,authDispatch] = useReducer(reducer,false)
  const value = {mode,toggle:toggle};
  const authValue = {auth,set:setAuth};
  return (
    <>
      <StatusBar style="auto" />
      <NoteProvider>
        <themeContext.Provider value={value}>
          <authContext.Provider value={authValue}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </authContext.Provider>
        </themeContext.Provider>
      </NoteProvider>
    </>
  );
}
