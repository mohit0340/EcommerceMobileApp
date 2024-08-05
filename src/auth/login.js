import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ImageBackgroundComponent,Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainContext } from '../Service/context/context';
import Spinner from 'react-native-loading-spinner-overlay';
import { Screen } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Login = ({navigation}) => {
  const { UserLogin } = useContext(MainContext);
  // const navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);


  const router=useRoute()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values) => {
    setSpinner(true);
    const login = await UserLogin(values);
    if (login) {
   
    
        navigation.navigate('App',{screen:'product'})
    
    
    } else {
      setSpinner(false);
    }
  };
  useEffect(()=>{
const ccc=async()=>{await AsyncStorage.removeItem('token')};
ccc();
  })

  return (
    <View style={styles.container}>
      
      <Image source={require('../images/login.png')} style={{height:250,width:"100%"}}/>
        <Spinner
          visible={spinner}
          textContent={'Loging...'}
          textStyle={styles.spinnerTextStyle}
          color='#202020'
        />
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              
              <TextInput
                style={styles.input}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            <TouchableOpacity onPress={() =>navigation.push('forgotpassword')} style={[styles.forgotlink,{}]}>
              <Text>Forgot Password ?</Text>
            </TouchableOpacity>

            <Button title="Login" onPress={handleSubmit} />
            <TouchableOpacity onPress={() => navigation.replace('register')} style={styles.registerLink}>
              <Text>If you are new, Register first</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#202020'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    color:"black"
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  registerLink: {
    marginTop: 20,
    alignSelf: 'center',
    color:"black"
  },
  forgotlink:{
    alignSelf:"flex-end",
    marginBottom:10,
    color:"black"
  }
});

export default Login;
