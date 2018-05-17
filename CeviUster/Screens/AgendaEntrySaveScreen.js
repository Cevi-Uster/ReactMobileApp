import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import RNCalendarEvents from 'react-native-calendar-events';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';

export default class AgendaEntrySaveScreen extends React.Component {

  containerMargin = 10;
  contentMarginLeft = 38;

  state = {
    event: null,
    calendars: [],
  };

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
  });


  constructor(props){
     super(props);
     //console.log(props);
     this.props.navigation.setParams({ title: 'Eintrag Speichern' });
  }

  componentWillMount(){
    RNCalendarEvents.findCalendars().then(c => {this.state.calendars = c});
  }

  okButtonClicked(){
    if (RNCalendarEvents.authorizationStatus() !== 'denied'){
      console.log(RNCalendarEvents.authorizationStatus());
    }
  }

  render() {
    const event = this.state.event;



    return (
      <ScrollView>
        <View style={styles.container}>
          <Image
            style={styles.icon}
            source={require('../Ressources/CeviLogoTransparent.png')}
          />
          <View style={styles.content}>
            <Text
              style={styles.title}>
              {'Kalender wählen'}
            </Text>

          </View>
          <View style={styles.buttonview}>
            <Button
              style={styles.okbutton}
              onPress={() => {this.okButtonClicked()}}
              icon={{
                name: 'check',
                size: 20,
                color: 'white'
              }}
              buttonStyle={{
                backgroundColor: "rgba(92, 99, 216, 1)",
                width: 140,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 20
              }}
              title='Ok'
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60
  },
  content: {
    marginTop: 5,
    marginLeft: 38,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonview: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  okbutton: {
    marginTop:10,
  }
});
