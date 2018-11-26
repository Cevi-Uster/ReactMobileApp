import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import WelcomeScreen from './Screens/WelcomeScreen';
import AgendaScreen from './Screens/AgendaScreen';
import AgendaEntryScreen from './Screens/AgendaEntryScreen';
import StufenScreen from './Screens/StufenScreen';
import AgendaEntrySaveScreen from './Screens/AgendaEntrySaveScreen';
import ContactScreen from './Screens/ContactScreen';
import PrivacyStatementScreen from './Screens/PrivacyStatementScreen';


const WelcomeStack = StackNavigator({
  Welcome: {screen: WelcomeScreen},
  }, {
    navigationOptions: {
      headerTitle: 'Willkommen',
    }
});

const AgendaStack = StackNavigator({
    Agenda: {screen: AgendaScreen},
    AgendaEntry: {screen: AgendaEntryScreen},
    AgendaEntrySave: {screen: AgendaEntrySaveScreen},
  }, {
    navigationOptions: {
  }
});

const InfoBoxStack = StackNavigator({
    Stufen: {screen: StufenScreen},
    //InfoBox: {screen: InfoBoxScreen},
  }, {
    navigationOptions: {
  }
});

const ContactStack = StackNavigator({
  Contact: {screen: ContactScreen},
}, {
  navigationOptions: {
    headerTitle: 'Kontakt',
  }
});

const PrivacyStatementStack = StackNavigator({
  Contact: {screen: PrivacyStatementScreen},
}, {
  navigationOptions: {
    headerTitle: 'Datenschutz',
  }
});

export default TabNavigator(
  {
    Willkommen: { screen: WelcomeStack, navigationOptions: { tabBarLabel: 'Willkommen' } },
    Agenda: { screen: AgendaStack, navigationOptions: { tabBarLabel: 'Agenda' } },
    InfoBox: { screen: InfoBoxStack, navigationOptions: { tabBarLabel: 'Chäschtli' } },
    Kontakt: { screen: ContactStack, navigationOptions: { tabBarLabel: 'Kontakt' } },
    Datenschutz: { screen: PrivacyStatementStack, navigationOptions: { tabBarLabel: 'Datenschutz' } },
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
        if (routeName === 'Willkommen') {
          //iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          return <Image source={require('./Ressources/Home_Icon.png')} style={[styles.PNGImageStyle, {tintColor: tintColor}]} />;
        } else if (routeName === 'Kontakt') {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        } else if (routeName === 'Agenda') {
          iconName = `ios-calendar${focused ? '' : '-outline'}`;
        } else if (routeName === 'InfoBox') {
          iconName = `ios-bonfire${focused ? '' : '-outline'}`;
        } else if (routeName === 'Datenschutz') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
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
