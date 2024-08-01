import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { MainContext } from '../Service/context/context';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

  const { localpath, darkMode } = useContext(MainContext);

  const sendOTP = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${localpath}/api/users/forgot-password`, { email: values.email });
      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        setEmail(values.email);
        setSubmitting(false);
        setStep(1);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      setSubmitting(false);
      Alert.alert('Error', error.response?.data?.message || 'Error sending OTP');
      setErrors({ email: error.response?.data?.message || 'Error sending OTP' });
    }
  };

  const verifyOTPAndChangePassword = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${localpath}/api/users/update-password`, { email, otp: values.otp, newPassword: values.newpassword });
      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        setSubmitting(false);
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error verifying OTP');
      setSubmitting(false);
      setErrors({ otp: error.response?.data?.message || 'Error verifying OTP' });
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.darkMode]}>
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
                style={[styles.input, darkMode && styles.darkInput]}
                placeholder="Email Address"
                placeholderTextColor={darkMode ? '#E2DFD0' : '#aaa'}
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
            otp: Yup.string().required('OTP is Required'),
            newpassword: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is Required'),
            confirmnewpassword: Yup.string().oneOf([Yup.ref('newpassword'), null], 'Passwords must match').required('Confirm Password is Required'),
          })}
          onSubmit={verifyOTPAndChangePassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
            <View style={styles.formContainer}>
              <OTPInputView
                style={styles.otpInput}
                pinCount={4}
                code={values.otp}
                onCodeChanged={(code) => handleChange('otp')(code)}
                autoFocusOnLoad
                codeInputFieldStyle={[styles.otpInputField, darkMode && styles.darkInput]}
                codeInputHighlightStyle={styles.otpInputHighlight}
                placeholderTextColor={darkMode ? '#E2DFD0' : '#aaa'}
              />
              {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
              <TextInput
                style={[styles.input, darkMode && styles.darkInput]}
                placeholder="New Password"
                secureTextEntry
                onChangeText={handleChange('newpassword')}
                onBlur={handleBlur('newpassword')}
                value={values.newpassword}
                placeholderTextColor={darkMode ? '#E2DFD0' : '#aaa'}
              />
              {errors.newpassword && <Text style={styles.errorText}>{errors.newpassword}</Text>}
              <TextInput
                style={[styles.input, darkMode && styles.darkInput]}
                placeholder="Confirm New Password"
                secureTextEntry
                onChangeText={handleChange('confirmnewpassword')}
                onBlur={handleBlur('confirmnewpassword')}
                value={values.confirmnewpassword}
                placeholderTextColor={darkMode ? '#E2DFD0' : '#aaa'}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  darkMode: {
    backgroundColor: '#181818',
  },
  image: {
    height: 200,
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
  darkInput: {
    borderColor: '#E2DFD0',
    color: '#E2DFD0',
  },
  otpInput: {
    width: '100%',
    height: 50,
    marginBottom: 15,
  },
  otpInputField: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
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
});

export default ForgotPassword;
