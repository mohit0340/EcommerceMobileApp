import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const MainContext = createContext();

const Context = ({ children }) => {
  const [product, setProduct] = useState('');
  const [user, setUser] = useState('');
  const localpath = 'https://upset-rabbits-remain.loca.lt';




    
 
  
 


const GetUserData=async(Token)=>{
  console.log(Token)
  try{
    const res = await axios.get(`${localpath}/api/users/protected`,{
      headers: {
        Authorization: `${Token}`,
      },
    });

      if (res.status == 200) {
        console.log(res.data);
        setUser(res.data)

        return true;
      } else {
        
        console.log(res);
        return false;
      }

  }
  catch(err){
    console.log(err.response.data.message );
    return false;

  }


}





  const UserLogin = async (values) => {
    try {
      const res = await axios.post(`${localpath}/api/users/login`, values);

      if (res.status == 200) {
        console.log(res.data);
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);

        await AsyncStorage.setItem('token', res.data.token);

       
        const token = await AsyncStorage.getItem('token');
        console.log('token', token);

        return true;
      } else {
        ToastAndroid.show('Login failed', ToastAndroid.SHORT);
        console.log('Login failed');
        return false;
      }
    } catch (err) {
      console.log(err.response.data.message );
      ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
      return false;
    }
  };

  const RegisterUser = async (formData) => {
    try {
      // Log form data for debugging
      console.log('Registering user with form data:', formData);
  
      const res = await axios.post(
        `${localpath}/api/users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (res.status === 200) {
        ToastAndroid.show('Registered Successfully', ToastAndroid.SHORT);
        return true;
      } else {
        console.log('Registration failed with status:', res.status);
        ToastAndroid.show('Registration Failed', ToastAndroid.SHORT);
        return false;
      }
    } catch (err) {
      console.log('Registration error:', err.response?.data?.message || err.message);
      ToastAndroid.show(`Registration failed: ${err.response?.data?.message || err.message}`, ToastAndroid.SHORT);
      return false;
    }
  };

  const getProducts = async (categoryval = '', searchterm = '') => {
    setProgress(true);

    try {
      const res = await axios.get(`${localpath}/api/products/`, {
        params: {
          category: categoryval !== 'all' ? categoryval : '', // Default to empty if 'all'
          searchTerm: searchterm
        }
      });

      if (res.status == 200) {
        setProgress(false);
        setProduct(res.data.products);
        console.log(res);
        return true;
      } else {
        setProgress(false);
        return false;
      }
    } catch (err) {
      console.log(err);
      setProgress(false);
      return false;
    }
  };

  return (
    <MainContext.Provider value={{ product, getProducts, user, UserLogin, RegisterUser,GetUserData }}>
      {children}
    </MainContext.Provider>
  );
};

const styles = StyleSheet.create({});

export default Context;
