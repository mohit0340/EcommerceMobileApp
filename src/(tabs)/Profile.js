import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {Formik, replace} from 'formik';
import * as Yup from 'yup';
import {MainContext} from '../Service/context/context';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object({
  firstname: Yup.string()
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid First Name')
    .min(3, 'Add at least 3 Characters for First Name')
    .required('First Name is Required'),
  lastname: Yup.string()
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid Last Name')
    .min(3, 'Add at least 3 Characters for Last Name')
    .required('Last Name is Required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is Required'),
  mobile: Yup.string()
    .matches(/^\d+$/, 'Mobile number must be digits only')
    .min(10, 'Mobile Number Must be 10 digits')
    .max(10, 'Mobile Number Must be 10 digits')
    .required('Mobile Number is Required'),
});

const Profile = ({navigation}) => {
  const {user,setUser, GetUserData, UpdateUser, localpath} = useContext(MainContext);
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  

  useEffect(() => {
    if (!user) {
      GetUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(false);
      setImageUri(`${localpath}/${user?.avatar}`);
    }
  }, [user, localpath]);

  const pickImage = async setFieldValue => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const pickedImage = result.assets[0];
        const imageUri = pickedImage.uri;
        console.log(pickedImage);

        setImageUri(imageUri);
        setFieldValue('avatar', {
          uri: pickedImage.uri,
          name: pickedImage.fileName,
          type: pickedImage.type,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSubmit = async values => {
    const formData = new FormData();
    formData.append('firstname', values.firstname);
    formData.append('lastname', values.lastname);
    formData.append('email', values.email);
    formData.append('mobile', values.mobile);
    if (values.avatar) {
      formData.append('avatar', {
        uri: values.avatar.uri,
        name: values.avatar.name,
        type: values.avatar.type,
      });
    }

    await UpdateUser(user._id, formData);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.loadingIndicator}
      />
    );
  }



  const HandleLogout = async () => {
    try {
      setUser(null)
      await AsyncStorage.removeItem('token');
      // Reset the navigation stack and navigate to the login screen
      navigation.navigate('Auth',{screen:'auth'})
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
         <TouchableOpacity style={{marginTop:10 }} onPress={()=>{HandleLogout()}}><Icon style={{fontSize:33,color:"black"}} name="logout"></Icon></TouchableOpacity>
      <Text style={[styles.title, {marginTop: 15}]}>Edit Profile</Text>
     
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageUri || `${localpath}/${user?.avatar}`}}
          style={styles.image}
        />
        {/* <TouchableOpacity style={styles.updateIcon} onPress={() => pickImage()}>
                    <Icon name="camera" size={30} color="#fff" />
                </TouchableOpacity> */}
      </View>
      <Formik
        initialValues={{
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
          email: user?.email || '',
          mobile: user?.mobile?.toString() || '', // Convert number to string
          avatar: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <>
            <TouchableOpacity
              style={styles.updateIcon}
              onPress={() => pickImage(setFieldValue)}>
              <Icon name="camera" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={values.firstname}
                onChangeText={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
              />
              {touched.firstname && errors.firstname && (
                <Text style={styles.errorText}>{errors.firstname}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={values.lastname}
                onChangeText={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
              />
              {touched.lastname && errors.lastname && (
                <Text style={styles.errorText}>{errors.lastname}</Text>
              )}
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
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
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
              {touched.mobile && errors.mobile && (
                <Text style={styles.errorText}>{errors.mobile}</Text>
              )}
            </View>

            <Button
              title="Update Profile"
              onPress={handleSubmit}
              color="#007BFF"
            />
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#f7f7f7',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#ddd',
    borderWidth: 3,
  },
  updateIcon: {
    position: 'absolute',
    top: '18%',
    right: '35%',
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 8,
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
});

export default Profile;
