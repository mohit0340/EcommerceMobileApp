import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this package is installed
import Product from './Product';
import Cart from './Cart';
import Profile from './Profile';

const Tabs = createBottomTabNavigator();

const Index = () => {
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          switch (route.name) {
            case 'product':
              iconName = 'home'; // Ensure this icon name is correct
              break;
            case 'cart':
              iconName = 'shopping-cart'; // Corrected icon name
              break;
            case 'profile':
              iconName = 'person'; // Corrected icon name
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tabs.Screen name="product" component={Product} />
      <Tabs.Screen name="cart" component={Cart} />
      <Tabs.Screen name="profile" component={Profile} />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({});

export default Index;
