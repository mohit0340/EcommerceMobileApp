import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../Service/context/context';

const Profile = () => {
    const { user, GetUserData } = useContext(MainContext);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    await GetUserData(`${token}`);
                } else {
                    setError('No token found');
                }
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [GetUserData]); // Add dependency on GetUserData

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            {user ? (
                <Text>{user.firstname}</Text>
            ) : (
                <Text>No user data available</Text>
            )}
            <Text>Profile</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        margin: 10,
    },
});

export default Profile;
