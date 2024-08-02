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
import ForgotPassword from './src/auth/forgot-password';

const Stack = createNativeStackNavigator();

const Layout = () => {
  console.log("Layout component rendered");

 let  Token=async()=>await AsyncStorage.getItem('token')
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
          component={TabIndex}
          options={{ headerShown: false, title: "Welcome" }}
        />
         <Stack.Screen
          name="forgotpassword"
          component={ForgotPassword}
          options={{ headerShown: true, title: "Forgot Password" }}
        />
    
  
      
    
    </Stack.Navigator>
    </NavigationContainer>
    </Context>
  );
};

export default Layout;


// import React, { useState, useEffect } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import Index from './src';
// import Register from './src/auth/register';
// import Login from './src/auth/login';
// import Context from './src/Service/context/context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import TabIndex from "./src/(tabs)/index";
// import ForgotPassword from './src/auth/forgot-password';

// const Stack = createNativeStackNavigator();





// const StackNavigation=()=>{
//   return(
//     <Stack.Navigator>
         
            
//               <Stack.Screen
//                 name="auth"
//                 component={Index}
//                 options={{ headerShown: false, title: "Welcome" }}
//               />
//               <Stack.Screen
//                 name="login"
//                 component={Login}
//                 options={{ headerShown: true, title: "Login" }}
//               />
//               <Stack.Screen
//                 name="register"
//                 component={Register}
//                 options={{ headerShown: false, title: "Welcome" }}
//               />
//               <Stack.Screen
//                 name="forgotpassword"
//                 component={ForgotPassword}
//                 options={{ headerShown: true, title: "Forgot Password" }}
//               />
            
          
//         </Stack.Navigator>
//   )
// }





// const RootNavigator = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem('token');
//       setIsAuthenticated(!!token);
//     };

//     checkAuth();
//   });

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isAuthenticated ? (
//         <Stack.Screen name="App" component={TabIndex} />
//       ) : (
//         <Stack.Screen name="Auth" component={StackNavigation} />
//       )}
//     </Stack.Navigator>
//   );
// };

// const Layout = () => {







//   return (
//     <Context>
//       <NavigationContainer>
//     <RootNavigator></RootNavigator>
//       </NavigationContainer>
//     </Context>
//   );
// };

// export default Layout;






{/* <NavigationContainer>
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
    </NavigationContainer> */}