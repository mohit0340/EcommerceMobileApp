import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, ToastAndroid, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { MainContext } from '../Service/context/context';
import OTPInputView from 'react-native-otp-textinput';

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const input = useRef(null);

  const { localpath } = useContext(MainContext);

  const sendOTP = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${localpath}/api/users/forgot-password`, { email: values.email });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        setEmail(values.email);
        setSubmitting(false);
        setStep(1);
      } else {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      setSubmitting(false);
      ToastAndroid.show(error?.response?.data?.message || 'Error in Sending OTP', ToastAndroid.SHORT);
      setErrors({ email: error.response?.data?.message || 'Error sending OTP' });
    }
  };

  const verifyOTPAndChangePassword = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${localpath}/api/users/update-password`, { email, otp: values.otp, newPassword: values.newpassword });
      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        setSubmitting(false);
        navigation.navigate('login');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error verifying OTP');
      setSubmitting(false);
      setErrors({ otp: error.response?.data?.message || 'Error verifying OTP' });
    }
  };







  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={[styles.container, { marginTop: 30 }]}>
      
      <Image source={require('../images/forgot.png')} style={styles.image} />
      {step === 0 ? (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
          })}
          onSubmit={sendOTP}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={'#aaa'}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <Button title="Send OTP" onPress={handleSubmit} disabled={isSubmitting} color="#007BFF" />
            </View>
          )}
        </Formik>
      ) : (
       
          <Formik
            initialValues={{ otp: '', newpassword: '', confirmnewpassword: '' }}
            validationSchema={Yup.object({
              otp: Yup.string().length(4,"OTP is Required").required('OTP is Required'),
              newpassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is Required'),
              confirmnewpassword: Yup.string().oneOf([Yup.ref('newpassword'), null], 'Passwords must match').required('Confirm Password is Required'),
            })}
            onSubmit={verifyOTPAndChangePassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting,setFieldValue }) => (
              <View style={styles.formContainer}>
                <OTPInputView
  ref={input}
  style={styles.otpInput}
  inputCount={4}
  autoFocusOnLoad
handleTextChange={(data)=>setFieldValue('otp',data)}
/>
                
                {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  onChangeText={handleChange('newpassword')}
                  onBlur={handleBlur('newpassword')}
                  value={values.newpassword}
                  placeholderTextColor={'#aaa'}
                />
                {errors.newpassword && <Text style={styles.errorText}>{errors.newpassword}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  onChangeText={handleChange('confirmnewpassword')}
                  onBlur={handleBlur('confirmnewpassword')}
                  value={values.confirmnewpassword}
                  placeholderTextColor={'#aaa'}
                />
                {errors.confirmnewpassword && <Text style={styles.errorText}>{errors.confirmnewpassword}</Text>}
                <View style={styles.buttonContainer}>
                  <Button title="Change Password" onPress={handleSubmit} disabled={isSubmitting} color="#007BFF" />
                  <TouchableOpacity onPress={() => {}} style={styles.resetButton}>
                    <Text style={styles.resetButtonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
       
      )}
     
    </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    height: 250,
    width: '100%',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  otpInput: {
    width: 50,
    height: 60, // Increase height if needed
    flex:1,
    justifyContent:"space-between",
    alignItems:"center",
    fontSize:25,
    textDecorationLine:"underline",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    textAlign:"center",
    marginBottom:15


    
  },
  otpInputField: {
    // width: 60, // Adjust width if needed
    // height: 60, // Adjust height if needed

  },
  otpInputHighlight: {
    borderColor: '#007BFF',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default ForgotPassword;
