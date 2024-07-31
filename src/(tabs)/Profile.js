import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MainContext } from '../Service/context/context';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this package is installed

const validationSchema = Yup.object({
    firstname: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid First Name")
      .min(3, "Add at least 3 Character First Name")
      .required("First Name is Required"),
    lastname: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid Last Name")
      .min(3, "Add at least 3 Character Last Name")
      .required("Last Name is Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    mobile: Yup.string()
      .matches(/^\d+$/, "Mobile number must be digits only")
      .min(10, "Mobile Number Must be 10 digits")
      .max(10, "Mobile Number Must be 10 digits")
      .required("Mobile Number is Required"),
});

const Profile = () => {
    const { user, GetUserData, UpdateUserProfile, localpath } = useContext(MainContext);
    const [loading, setLoading] = useState(true);
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await GetUserData();
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [!user]);

  

    useEffect(() => {
        if (user) {
            // If user is available, stop loading
            setLoading(false);
        }
    }, [user]);

    const pickImage = async (setFieldValue) => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.didCancel && result.assets && result.assets.length > 0) {
            const pickedImage = result.assets[0];
            setImageUri(pickedImage.uri);
            setFieldValue('image', pickedImage);
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('firstname', values.firstname);
        formData.append('lastname', values.lastname);
        formData.append('email', values.email);
        formData.append('mobile', values.mobile);
        if (values.image) {
            formData.append('image', {
                uri: values.image.uri,
                name: values.image.fileName,
                type: values.image.type,
            });
        }

        try {
            await UpdateUserProfile(user._id,formData);
           
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.title, { marginTop: 15 }]}>Edit Profile</Text>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri || `${localpath}/${user?.avatar}` }} style={styles.image} />
                <TouchableOpacity style={styles.updateIcon} onPress={() => pickImage()}>
                    <Icon name="camera" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <Formik
                initialValues={{
                    firstname: user?.firstname || '',
                    lastname: user?.lastname || '',
                    email: user?.email || '',
                    mobile: user?.mobile || '',
                    image: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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

                        <Button title="Update Profile" onPress={handleSubmit} color="#007BFF" />
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
        bottom: "10%",
        right: "32%",
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
