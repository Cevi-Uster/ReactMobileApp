import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import WelcomeScreen from './Screens/WelcomeScreen';
import ContactScreen from './Screens/ContactScreen';

export default TabNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Contact: { screen: ContactScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        var styles = StyleSheet.create({
        PNGImageStyle: {
          width: 25,
          height: 25
        }});
        if (routeName === 'Welcome') {
          //iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          return <Image source={require('./Ressources/Home_Icon.png')} style={[styles.PNGImageStyle, {tintColor: tintColor}]} />;
        } else if (routeName === 'Contact') {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'navy',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
