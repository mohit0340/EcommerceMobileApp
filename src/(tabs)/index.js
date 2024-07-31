import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Product from './Product';
import Cart from './Cart';
import Profile from './Profile';




const Tabs=createBottomTabNavigator()

const Index = () => {
    return (
        <Tabs.Navigator>
            <Tabs.Screen name='poduct' component={Product}></Tabs.Screen>
            <Tabs.Screen name='cart' component={Cart}></Tabs.Screen>
            <Tabs.Screen name='profile' component={Profile}></Tabs.Screen>

           
        </Tabs.Navigator>
    );
}

const styles = StyleSheet.create({})

export default Index;
