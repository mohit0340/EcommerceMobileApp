import React, {createContext, useEffect, useState} from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {measure} from 'react-native-reanimated';

export const MainContext = createContext();

const Context = ({children}) => {
  const [product, setProduct] = useState('');
  const [user, setUser] = useState('');
  const [cart, SetCart] = useState('');
  const [category, setCategory] = useState('');
  const localpath = 'https://eleven-seals-chew.loca.lt';

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
        GetUserData(res.data.token);
        await AsyncStorage.setItem('token', res.data.token);

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

  const getProducts = async (categoryval = '', searchterm = '') => {
    try {
      const res = await axios.get(`${localpath}/api/products`, {
        params: {
          category: categoryval !== 'all' ? categoryval : '', // Default to empty if 'all'
          searchTerm: searchterm,
        },
      });

      if (res.status == 200) {
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
        toast.success(res.data.message);
        GetUserData();
        console.log('user updated successfully');
        return true;
      } else {
        console.log('User update with status:', res.status);
        ToastAndroid.show('Update Failed', ToastAndroid.SHORT);
        return false;
      }
    } catch (err) {
      console.log(
        'Update User Error:',
        err.response?.data?.message || err.message,
      );
      ToastAndroid.show(
        `Update failed: ${err.response?.data?.message || err.message}`,
        ToastAndroid.SHORT,
      );

      return false;
    }
  };

  const CartUpdate = async ({userId, productId, quantity, action, message}) => {
   
    try {
      let token = await AsyncStorage.getItem('token');
      let res = await axios.post(
        `${localpath}/api/cart/update`,
        {
          userId: userId,
          productId: productId,
          quantity: quantity,
          action: action,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status == 200) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
        
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


  const CartData=async(id)=>{
    setProgress(true)
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
          console.log(res)
          
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

  return (
    <MainContext.Provider
      value={{
        product,
        localpath,
        category,
        cart,
        getProducts,
        user,
        UserLogin,
        RegisterUser,
        GetUserData,
        UpdateUser,
        CartUpdate,
        CategoryGet,
        UpdateUser
      }}>
      {children}
    </MainContext.Provider>
  );
};

export default Context;
