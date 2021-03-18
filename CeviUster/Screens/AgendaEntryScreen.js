import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import {COLOR_PRIMARY, COLOR_SECONDARY, BORDER_RADIUS} from '../styles/common.js'
import {decode} from 'html-entities';
import LocalCalendarModalComponent from '../Components/LocalCalendarModalComponent';
import {addCalendarEvent} from '../Services/LocalCalendarService';

export default class AgendaEntryScreen extends React.Component {

  containerMargin = 10;
  contentMarginLeft = 38;

  state = {
    event: null,
    isVisibleCalendars: false,
  };

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
  });


  constructor(props){
     super(props);
     //console.log(props);
     if (this.props.route.params && this.props.route.params.selectedEvent){
       this.state.event = this.props.route.params.selectedEvent;
       this.props.navigation.setParams({ title: this.props.route.params.selectedEvent.title });
     } else {
       this.props.navigation.setParams({ title: "Agenda" });
     }

  }

  componentDidMount(){
  }

  saveButtonClicked(){
    //this.props.navigation.navigate('AgendaEntrySave', {selectedEvent: this.state.event});
    this.setState({ isVisibleCalendars: true });
  }

  closeLocalCalendarModal(){
    this.setState({ isVisibleCalendars: false });
  }

  saveEvent = async (calendar) => { 
    console.log('saveEvent: ' + this.state.event + ' to calendar: ' + calendar );
    
    addCalendarEvent(this.state.event, calendar, () => {
      Alert.alert(
        "Gespeichert",
        "Der Kalendereintrag wurde gespeichert.",
        [
          { text: "OK", onPress: () => this.closeLocalCalendarModal() }
        ]
      );
    }, (e) => {
      Alert.alert(
        "Fehler",
        "Fehler beim Speichern im Kalender: " + e,
        [
          { text: "OK", onPress: () => this.closeLocalCalendarModal(); }
        ]
      );
    });
  };

  render() {
    const event = this.state.event;
    let dateTime = '';
    dateTime = `${event.start_date_details.day}.${event.start_date_details.month}.${event.start_date_details.year}`;
    if (!event.all_day){
      dateTime = `${dateTime} ${event.start_date_details.hour}:${event.start_date_details.minutes}`;
    }
    if (event.end_date_details !== undefined) {
      dateTime= `${dateTime} - ${event.end_date_details.day}.${event.end_date_details.month}.${event.end_date_details.year}`
    }
    if (!event.all_day){
      dateTime = `${dateTime} ${event.end_date_details.hour}:${event.end_date_details.minutes}`;
    }

    if (event.description == ''){
      styles.description.display = 'none';
    }

    const dimensions = Dimensions.get('window');
    let imageScaledWidth = dimensions.width - (2 * this.containerMargin) - this.contentMarginLeft;
    let imageScaledHeight = 0;
    console.log(`event.image ${event.image}`);
    if (event.image == false){
      styles.image.display = 'none';
    } else {
      imageScaledHeight = Math.round(event.image.height * (imageScaledWidth  / event.image.width));
    }
    console.log(`containerMargin ${this.containerMargin}`);
    console.log(`contentMarginLeft ${this.contentMarginLeft}`);
    console.log(`event.image.height ${event.image.height}`);
    console.log(`imageScaledWidth ${imageScaledWidth}`);
    console.log(`event.image.width ${event.image.width}`);
    console.log(`ìmageScaledHeight ${imageScaledHeight}`);

    let description = decode(event.description.replace(/<(.|\n)*?>/g, ''));

    return (
      <ScrollView>
        <LocalCalendarModalComponent
          isVisible={this.state.isVisibleCalendars}
          closeModal={() => this.closeLocalCalendarModal()}
          handleCalendarSelected={(calendar) => this.saveEvent(calendar)}
          label={'Kalender wählen'}
        />
        <View style={styles.container}>
          <Image
            style={styles.icon}
            source={require('../Ressources/CeviLogoTransparent.png')}
          />
          <View style={styles.content}>
            <Text
              style={styles.title}>
              {decode(event.title)}
            </Text>
            <Text
              style={styles.date}>
              {dateTime}
            </Text>
            <Text
              style={styles.venue}>
              {decode(event.venue.venue)}
            </Text>
          <Text
            style={styles.description}>
            {description}
          </Text>
          <Image
            style={styles.image}
            source={{uri: event.image.url}}
            resizeMode='contain'
            width={imageScaledWidth}
            height={imageScaledHeight}
            >
          </Image>
          </View>
          <View style={styles.buttonview}>
            <Button
              style={styles.savebutton}
              onPress={() => {this.saveButtonClicked()}}
              icon={{
                name: 'save',
                size: 20,
                color: 'white'
              }}
              buttonStyle={{
                backgroundColor: COLOR_PRIMARY,
                width: 140,
                height: 50,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: BORDER_RADIUS
              }}
              title='Speichern'
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
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 0x023EFF,
  },
  venue: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
  },
  image: {
    marginTop:5,
  },
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  savebutton: {
    marginTop:10,
  }
});
