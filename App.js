// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import { View, Text } from 'react-native';
// import Index from './src';
// import Register from './src/auth/register';
// import Login from './src/auth/login';
// import Context from './src/Service/context/context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import TabIndex from "./src/(tabs)/index"
// import ForgotPassword from './src/auth/forgot-password';

// const Stack = createNativeStackNavigator();

// const Layout = () => {
//   console.log("Layout component rendered");

//  let  Token=async()=>await AsyncStorage.getItem('token')
//   return (
//     <Context>

// <NavigationContainer>

// <Stack.Navigator>

//         <Stack.Screen
//           name="auth"
//           component={Index}
//           options={{ headerShown: false, title: "Welcome" }}
//         />
//         <Stack.Screen
//           name="login"
//           component={Login}
//           options={{ headerShown: true, title: "Login" }}
//         />
//         <Stack.Screen
//           name="register"
//           component={Register}
//           options={{ headerShown: false, title: "Welcome" }}
//         />
//          <Stack.Screen
//           name="protected"
//           component={TabIndex}
//           options={{ headerShown: false, title: "Welcome" }}
//         />
//          <Stack.Screen
//           name="forgotpassword"
//           component={ForgotPassword}
//           options={{ headerShown: true, title: "Forgot Password" }}
//         />

//     </Stack.Navigator>
//     </NavigationContainer>
//     </Context>
//   );
// };

// export default Layout;

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Index from './src';
import Register from './src/auth/register';
import Login from './src/auth/login';
import ForgotPassword from './src/auth/forgot-password';
import TabIndex from './src/(tabs)/index';
import Context from './src/Service/context/context';

const Stack = createNativeStackNavigator();

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Optional: Set background color if needed
  },
});

// Authentication stack navigator
const StackNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="auth"
      component={Index}
      options={{ headerShown: false, title: 'Welcome' }}
    />
    <Stack.Screen
      name="login"
      component={Login}
      options={{ headerShown: true, title: 'Login' }}
    />
    <Stack.Screen
      name="register"
      component={Register}
      options={{ headerShown: false, title: 'Register' }}
    />
    <Stack.Screen
      name="forgotpassword"
      component={ForgotPassword}
      options={{ headerShown: true, title: 'Forgot Password' }}
    />
  </Stack.Navigator>
);

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("token App",token)
      // Here you can add additional checks to validate the token if needed
  await setIsAuthenticated(!!token); // Set authenticated state based on token presence
      setIsLoading(false);
    };

    checkAuth();
  }, []); // Empty dependency array to avoid infinite loop

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Context>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <>
            <Stack.Screen
              name="Auth"
              component={StackNavigation}
              options={{ headerShown: false, title: 'Welcome' }}
            />
            <Stack.Screen
            name="App"
            component={TabIndex}
            options={{ headerShown: false, title: 'Welcome' }}
          />
          </>
          ) : (
            <>
            <Stack.Screen
              name="App"
              component={TabIndex}
              options={{ headerShown: false, title: 'Welcome' }}
            />
            <Stack.Screen
              name="Auth"
              component={StackNavigation}
              options={{ headerShown: false, title: 'Welcome' }}
            />
            </>
          )}
        </Stack.Navigator>
      </Context>
    </NavigationContainer>
  );
};

export default Layout;


{
  /* <NavigationContainer>
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
          component={TabIndex}
          options={{ headerShown: false, title: "Welcome" }}
        />
         <Stack.Screen
          name="forgotpassword"
          component={ForgotPassword}
          options={{ headerShown: true, title: "Forgot Password" }}
        />
      </Stack.Navigator>
    </NavigationContainer>  */
}
