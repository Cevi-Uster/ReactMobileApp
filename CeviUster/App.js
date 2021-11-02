import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import AgendaScreen from './Screens/AgendaScreen';
import AgendaEntryScreen from './Screens/AgendaEntryScreen';
import StufenScreen from './Screens/StufenScreen';
import InfoBoxScreen from './Screens/InfoBoxScreen';
import DropOutScreen from './Screens/DropOutScreen';
import AgendaEntrySaveScreen from './Screens/AgendaEntrySaveScreen';
import ContactScreen from './Screens/ContactScreen';
import PrivacyStatementScreen from './Screens/PrivacyStatementScreen';


const TabNavigator = createBottomTabNavigator();
const WelcomeStack = createStackNavigator();
const AgendaStack = createStackNavigator();
const InfoBoxStack = createStackNavigator();
const ContactStack = createStackNavigator();
const PrivacyStatementStack = createStackNavigator();

function WelcomeStackScreen() {
  return (
    <WelcomeStack.Navigator>
      <WelcomeStack.Screen
        name='Welcome'
        component={WelcomeScreen}
        options={{ tabBarLabel: 'Willkommen'}}
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
        options={{ tabBarLabel: 'Agenda' }}
      />
      <AgendaStack.Screen
        name='AgendaEntry'
        component={AgendaEntryScreen}
        options={{ tabBarLabel: 'Agenda' }}
      />
      <AgendaStack.Screen
        name='AgendaEntrySave'
        component={AgendaEntrySaveScreen}
        options={{ tabBarLabel: 'Agenda' }}
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
        options={{ tabBarLabel: 'Chäschtli' }}
      />
       <InfoBoxStack.Screen
        name='InfoBox'
        component={InfoBoxScreen}
        options={{ tabBarLabel: 'Chäschtli' }}
      />
       <InfoBoxStack.Screen
        name='DropOut'
        component={DropOutScreen}
        options={{ tabBarLabel: 'Chäschtli' }}
      />
    </InfoBoxStack.Navigator>
  );
}

function ContactStackScreen() {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen
        name='Contact'
        component={ContactScreen}
        options={{ tabBarLabel: 'Kontakt' }}
      />
    </ContactStack.Navigator>
  );
}

function PrivacyStatementStackScreen() {
  return (
    <PrivacyStatementStack.Navigator>
      <PrivacyStatementStack.Screen
        name='Privacy'
        component={PrivacyStatementScreen}
        options={{ tabBarLabel: 'Datenschutz' }}
      />
    </PrivacyStatementStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            console.log('route.name: ' + route.name);
            let iconName = 'warning-outline';
            if (route.name === 'Welcome') {
              //iconName = `ios-information-circle${focused ? '' : '-outline'}`;
              return <Image 
                source={require('./Ressources/Home_Icon.png')} 
                style={[{resizeMode: 'contain'}, {tintColor: color}]} 
                />;
            }  else if (route.name === 'Agenda') {
              iconName = `ios-calendar${focused ? '' : '-outline'}`;
            } else if (route.name === 'Infobox') {
              iconName = `ios-bonfire${focused ? '' : '-outline'}`;
            } else if (route.name === 'Contact') {
              iconName = `ios-at${focused ? '' : '-outline'}`;
            }else if (route.name === 'Privacy') {
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
        <TabNavigator.Screen name="Welcome" component={WelcomeStackScreen} options={{title: 'Willkommen' }} />
        <TabNavigator.Screen name="Agenda" component={AgendaStackScreen} options={{title: 'Agenda' }} />
        <TabNavigator.Screen name="Infobox" component={InfoboxStackScreen} options={{title: 'Chäschtli' }} />
        <TabNavigator.Screen name="Contact" component={ContactStackScreen} options={{title: 'Kontakt' }} />
        <TabNavigator.Screen name="Privacy" component={PrivacyStatementStackScreen} options={{title: 'Datenschutz' } }/>
      </TabNavigator.Navigator>
    </NavigationContainer>
  );
}