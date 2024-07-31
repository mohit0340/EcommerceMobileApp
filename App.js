import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Index from './src';
import Register from './src/auth/register';
import Login from './src/auth/login';
import Context from './src/Service/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabIndex from "./src/(tabs)/index"

const Stack = createNativeStackNavigator();

const Layout = () => {
  console.log("Layout component rendered");
 const Token= AsyncStorage.getItem('token')
  return (
    <Context>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="auth"
          component={Index}
          options={{ headerShown: false, title: "Welcome" }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: true, title: "Login" }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{ headerShown: false, title: "Welcome" }}
        />
         <Stack.Screen
          name="protected"
          component={Token==null?Login:TabIndex}
          options={{ headerShown: false, title: "Welcome" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Context>
  );
};

export default Layout;
