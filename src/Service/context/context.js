import React, {createContext, useEffect, useState} from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {measure} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export const MainContext = createContext();

const Context = ({children}) => {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, SetCart] = useState(null);
  const [category, setCategory] = useState(null);
  const navigation=useNavigation()


  
  const localpath = 'https://mean-steaks-taste.loca.lt';
  const GetUserData = async () => {
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${localpath}/api/users/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status == 200) {
        console.log(res.data);
        setUser(res.data.user);

        return true;
      } else {
        console.log(res);
        return false;
      }
    } catch (err) {
      console.log(err.response.data.message);
      return false;
    }
  };

  const UserLogin = async values => {
    try {
      const res = await axios.post(`${localpath}/api/users/login`, values);

      if (res.status == 200) {
        console.log(res.data);
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
       await GetUserData(res.data.token);
        await AsyncStorage.setItem('token', res.data.token);
        let tkn=await AsyncStorage.getItem('token')
        console.log(tkn)
        
        return true;
      } else {
        ToastAndroid.show('Login failed', ToastAndroid.SHORT);
        console.log('Login failed');
        return false;
      }
    } catch (err) {
      console.log(err.response.data.message);
      ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
      return false;
    }
  };

  const RegisterUser = async formData => {
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
        },
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
      console.log(
        'Registration error:',
        err.response?.data?.message || err.message,
      );
      ToastAndroid.show(
        `Registration failed: ${err.response?.data?.message || err.message}`,
        ToastAndroid.SHORT,
      );
      return false;
    }
  };

  // const getProducts = async (categoryval = '', searchterm = '') => {
  //   try {
  //     const res = await axios.get(`${localpath}/api/products`, {
  //       params: {
  //         category: categoryval !== 'all' ? categoryval : '', // Default to empty if 'all'
  //         searchTerm: searchterm,
  //       },
  //     });

  //     if (res.status == 200) {
  //       setProduct(res.data.products);
  //       console.log(res);
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (err) {
  //     console.log(err);

  //     return false;
  //   }
  // };


  const getProducts = async (categories = [], searchterm = '') => {
    try {
      const res = await axios.get(`${localpath}/api/products`, {
        params: {
          category: categories.length > 0 ? categories.join(',') : '', // Join categories if there are multiple
          searchTerm: searchterm,
        },
      });
  
      if (res.status === 200) {
        setProduct(res.data.products);
        console.log(res);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  


  const UpdateUser = async (id, formData) => {
    console.log(id,formData)
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await axios.put(
        `${localpath}/api/users/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status == 200) {
      ToastAndroid.show('Profile updated Successfully', ToastAndroid.SHORT);
       GetUserData()
       return true;
        
      } else {
        console.log('Error in update profile', res.status);
        ToastAndroid.show('Error in update profile', ToastAndroid.SHORT);
        return false;
      }
    } catch (err) {
      console.log(
        'update profile error:',
        err.response?.data?.message || err.message,
      );
      ToastAndroid.show(
        `update profile error: ${err.response?.data?.message || err.message}`,
        ToastAndroid.SHORT,
      );
      return false;
    }

  };

  const CartData=async(id)=>{
    
    if(user?.role=="user"){
  try {
      let res = await axios.get(`${localpath}/api/cart/${id}`
      //   {
      //   headers:{
      //     'Content-Type': 'application/json',
      //     "Authorization": `Bearer ${token}`
      //   }
      // }
      )

      console.log(res)
      if (res.status == 200) {
        SetCart(res.data.cart.products)
        console.log(res.data.cart.products)
        
        return true;
      }else{
        console.log(res);
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }}
 
}

  const CartUpdate = async (data) => {
   
    try {
      let token = await AsyncStorage.getItem('token');
      let res = await axios.post(
        `${localpath}/api/cart/update`,
        {
          userId: data.userId,
          productId: data.productId,
          quantity: data.quantity,
          action: data.action,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status == 200) {
       
      await  CartData(user._id)
      ToastAndroid.show(data.message, ToastAndroid.SHORT);
        
        console.log(res);
        return true;
      } else {
        console.log('oprartion failed with status:', res.status);
        ToastAndroid.show('oprartion Failed', ToastAndroid.SHORT);
        return false;
      }
    } catch (err) {
      console.log(
        'oprartion  Error:',
        // err.response?.data?.message || err.message,
        err
      );
      ToastAndroid.show(
        `oprartion Failed: ${err.response?.data?.message || err.message}`,
        ToastAndroid.SHORT,
      );
      return false;
    }
  };

  const CategoryGet = async () => {
    try {
      const res = await axios.get(`${localpath}/api/products/category`);
      if (res.status == 200) {
        setCategory(res.data);
        console.log(res);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };


  

  return (
    <MainContext.Provider
      value={{
        product,
        localpath,
        category,
        cart,
        CartData,
        getProducts,
        setUser,
        user,
        UserLogin,
        RegisterUser,
        GetUserData,
       
        CartUpdate,
        CategoryGet,
        UpdateUser
      }}>
      {children}
    </MainContext.Provider>
  );
};

export default Context;
