import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import WebScreen from './Screens/WebScreen';
import AgendaScreen from './Screens/AgendaScreen';
import AgendaEntryScreen from './Screens/AgendaEntryScreen';
import StufenScreen from './Screens/StufenScreen';
import InfoBoxScreen from './Screens/InfoBoxScreen';
import DropOutScreen from './Screens/DropOutScreen';
import AgendaEntrySaveScreen from './Screens/AgendaEntrySaveScreen';
import GLOBALS from './Global';


const TabNavigator = createBottomTabNavigator();
const WelcomeStack = createStackNavigator();
const AgendaStack = createStackNavigator();
const InfoBoxStack = createStackNavigator();
const ContactStack = createStackNavigator();
const PrivacyStatementStack = createStackNavigator();

const WELCOME_TITLE = 'Willkommen';
const AGENDA_TITLE = 'Agenda';
const INFOBOX_TITLE = 'Chäschtli';
const CONTACT_TITLE= 'Kontakt';
const PRIVACY_TITLE = 'Datenschutz';

function WelcomeStackScreen() {
  return (
    <WelcomeStack.Navigator>
      <WelcomeStack.Screen
        name={WELCOME_TITLE}
        component={WebScreen}
        options={{ tabBarLabel: WELCOME_TITLE}}
        initialParams={{ url: GLOBALS.WELCOME_URL, title: WELCOME_TITLE }}
      />
    </WelcomeStack.Navigator>
  );
} 

function AgendaStackScreen() {
  return (
    <AgendaStack.Navigator>
      <AgendaStack.Screen
        name='Agenda'
        component={AgendaScreen}
        options={{ tabBarLabel: AGENDA_TITLE}}
      />
      <AgendaStack.Screen
        name='AgendaEntry'
        component={AgendaEntryScreen}
        options={{ tabBarLabel: AGENDA_TITLE }}
      />
      <AgendaStack.Screen
        name='AgendaEntrySave'
        component={AgendaEntrySaveScreen}
        options={{ tabBarLabel: AGENDA_TITLE }}
      />
    </AgendaStack.Navigator>
  );
}

function InfoboxStackScreen() {
  return (
    <InfoBoxStack.Navigator>
      <InfoBoxStack.Screen
        name='Stufen'
        component={StufenScreen}
        options={{ tabBarLabel: INFOBOX_TITLE }}
      />
       <InfoBoxStack.Screen
        name='InfoBox'
        component={InfoBoxScreen}
        options={{ tabBarLabel: INFOBOX_TITLE }}
      />
       <InfoBoxStack.Screen
        name='DropOut'
        component={DropOutScreen}
        options={{ tabBarLabel: INFOBOX_TITLE }}
      />
    </InfoBoxStack.Navigator>
  );
}

function ContactStackScreen() {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen
        name={CONTACT_TITLE}
        component={WebScreen}
        options={{ tabBarLabel: CONTACT_TITLE}}
        initialParams={{ url: GLOBALS.CONTACT_URL, title: CONTACT_TITLE }}
      />
    </ContactStack.Navigator>
  );
}

function PrivacyStatementStackScreen() {
  return (
    <PrivacyStatementStack.Navigator>
      <PrivacyStatementStack.Screen
        name={PRIVACY_TITLE}
        component={WebScreen}
        options={{ tabBarLabel: PRIVACY_TITLE}}
        initialParams={{ url: GLOBALS.PRIVACY_STATEMENT_URL, title: PRIVACY_TITLE }}
      />
    </PrivacyStatementStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle='default'/>
      <TabNavigator.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            console.log('route.name: ' + route.name);
            let iconName = 'warning-outline';
            if (route.name === WELCOME_TITLE) {
              //iconName = `ios-information-circle${focused ? '' : '-outline'}`;
              return <Image 
                source={require('./Ressources/Home_Icon.png')} 
                style={[{resizeMode: 'contain'}, {tintColor: color}]} 
                />;
            }  else if (route.name === AGENDA_TITLE) {
              iconName = `ios-calendar${focused ? '' : '-outline'}`;
            } else if (route.name === INFOBOX_TITLE) {
              iconName = `ios-bonfire${focused ? '' : '-outline'}`;
            } else if (route.name === CONTACT_TITLE) {
              iconName = `ios-at${focused ? '' : '-outline'}`;
            }else if (route.name === PRIVACY_TITLE) {
              iconName = `shield${focused ? '' : '-outline'}`;
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'navy',
          inactiveTintColor: 'grey',
        }}>
        <TabNavigator.Screen name={WELCOME_TITLE} component={WelcomeStackScreen} options={{title: WELCOME_TITLE }} />
        <TabNavigator.Screen name={AGENDA_TITLE} component={AgendaStackScreen} options={{title: AGENDA_TITLE }} />
        <TabNavigator.Screen name={INFOBOX_TITLE} component={InfoboxStackScreen} options={{title: INFOBOX_TITLE }} />
        <TabNavigator.Screen name={CONTACT_TITLE} component={ContactStackScreen} options={{title: CONTACT_TITLE }} />
        <TabNavigator.Screen name={PRIVACY_TITLE} component={PrivacyStatementStackScreen} options={{title: PRIVACY_TITLE } }/>
      </TabNavigator.Navigator>
    </NavigationContainer>
   );
}