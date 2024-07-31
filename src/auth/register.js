import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { MainContext } from '../Service/context/context';

const validationSchema = Yup.object().shape({
  firstname: Yup.string().min(3, 'First name must be at least 3 characters').required('First name is required'),
  lastname: Yup.string().min(3, 'Last name must be at least 3 characters').required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#\$%\^&\*]/, 'Password must contain at least one special character')
    .required('Password is required'),
  mobile: Yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  image: Yup.mixed().required('Image is required'),
});

const Register = () => {
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { RegisterUser } = useContext(MainContext);

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      setImage(pickedImage.uri);
      setFieldValue('image', {
        uri: pickedImage.uri,
        name: pickedImage.fileName ,
        type: pickedImage.type ,
      });  
    }
  };

  const handleRegister = async (values) => {
    const formData = new FormData();
    formData.append('firstname', values.firstname);
    formData.append('lastname', values.lastname);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('mobile', values.mobile);

    // Append image correctly
    formData.append('image', {
      uri: values.image.uri,
      name: values.image.name,
      type: values.image.type,
    });

    const response = await RegisterUser(formData);

    if (response) {
      navigation.replace('login');
    } else {
      Alert.alert('Registration failed', 'Please try again');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          mobile: '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={values.firstname}
                onChangeText={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
              />
              {touched.firstname && errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={values.lastname}
                onChangeText={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
              />
              {touched.lastname && errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}
            </View>

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
              <View>
                <TextInput
                  style={styles.input}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePassword}>
                  <Text>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={values.mobile}
                onChangeText={handleChange('mobile')}
                onBlur={handleBlur('mobile')}
                keyboardType="phone-pad"
              />
              {touched.mobile && errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profile Image</Text>
              <Button title="Pick an image" onPress={() => pickImage(setFieldValue)} />
              {image && <Image source={{ uri: image }} style={styles.image} />}
              {touched.image && errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
            </View>

            <Button title="Register" onPress={handleSubmit} />
            <TouchableOpacity onPress={() => navigation.replace('login')} style={styles.loginLink}>
              <Text>Already have an account? Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 12,
    alignSelf: 'center',
    borderRadius: 50,
  },
  togglePassword: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  loginLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Register;
