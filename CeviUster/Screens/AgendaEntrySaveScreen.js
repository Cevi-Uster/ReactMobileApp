import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import RNCalendarEvents from 'react-native-calendar-events';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';
import {COLOR_PRIMARY, COLOR_SECONDARY, COLOR_HIGHLIGHT, BORDER_RADIUS} from '../styles/common.js'

export default class AgendaEntrySaveScreen extends React.Component {

  containerMargin = 10;
  contentMarginLeft = 38;

  state = {
    event: null,
    auth: null,
    calendars: [],
    selectedCalendarId: null,
    okVisible: false,
  };

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
  });


  constructor(props){
     super(props);
     //console.log(props);

     if (this.props.navigation.state.params && this.props.navigation.state.params.selectedEvent){
       this.state.event = this.props.navigation.state.params.selectedEvent;
       this.props.navigation.setParams({ title: `${this.props.navigation.state.params.selectedEvent.title } speichern` });
     } else {
        this.props.navigation.setParams({ title: 'Eintrag speichern' });
     }
  }

  componentWillMount() {
    RNCalendarEvents.authorizationStatus()
      .then((status) => {
        this.setState({ auth: status });
        if (status === 'undetermined') {
          RNCalendarEvents.authorizeEventStore().then((out) => {
            if (out == 'authorized') {
              this.setState({ auth: out });
              this.loadCalendars();
            }
          });
        } else if (status === 'authorized') {
          this.loadCalendars();
        }
      })
      .catch(error => console.warn('Auth Error: ', error));
  }

  loadCalendars(){
    RNCalendarEvents.findCalendars()
      .then(c => {this.calendarLoadingFinished(c)})
      .catch(e => console.log(e));
  }

  calendarLoadingFinished(calendars){
    console.log(calendars);
    /*
    { id: '1CFEAAAB-91F7-4BA5-877B-FB447CE06B97',
        allowsModifications: true,
        source: 'Default',
        allowedAvailabilities: [],
        title: 'Calendar' },

    */
    calendars = calendars.filter((calendar) => calendar.allowsModifications === true)
      .map(({id, allowsModifications, source, allowedAvailabilities, title}) => ({id, allowsModifications, source, allowedAvailabilities, title}));
    calendars.sort(function(a, b) {
      var nameA = a !== undefined && a.title != undefined ? a.title.toUpperCase() : ""; // ignore upper and lowercase
      var nameB = b !== undefined && b.title != undefined ? b.title.toUpperCase() : "";// ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // namen müssen gleich sein
      return 0;
    });
    this.setState({calendars: calendars});
    console.log(this.state.calendars);
  }

  okButtonClicked(){
    if (RNCalendarEvents.authorizationStatus() !== 'denied'){
      console.log("okButtonClicked");
      var dateFormat = 'YYYY-MM-DD HH:mm:ssZ';
      var startDate = moment(`${this.state.event.utc_start_date}Z`, dateFormat);
      var endDate = moment(`${this.state.event.utc_end_date}Z`, dateFormat);
      console.log(`Calender Id: ${this.state.selectedCalendarId}`);
      console.log(`Event title: ${this.state.event.title}`);
      console.log(`Original startDate: ${this.state.event.utc_start_date}Z`);
      console.log(`Original endDate: ${this.state.event.utc_end_date}Z`);
      console.log(`Parsed startDate: ${startDate}`);
      console.log(`Parsed endDate: ${endDate}`);
      RNCalendarEvents.saveEvent(this.state.event.title, {
        calendarId: this.state.selectedCalendarId,
        startDate: startDate,
        endDate: endDate,
        location: this.state.event.venue.venue,
        notes: this.state.event.description
      });
      this.props.navigation.goBack();
    }
  }

  calendarSelected(index, value){

    if (value !== undefined && value !== null){
      this.setState({okVisible: true});
      console.log(`Selected calendar id: ${value.id} and index ${index}`);
      this.setState({selectedCalendarId: value.id});
    } else {
      this.setState({okVisible: false});
      console.log(`No calendar selected`);
      this.setState({selectedCalendarId: null});
    }

  }

  calendarDropdownRenderButtonText(rowData){
    const {id, allowsModifications, allowedAvailabilities, source, title} = rowData;
    return `${title}`;
  }

  calendarDropdownRenderRow(rowData, rowID, highlighted) {

    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={[styles.calendarDropdown_row, {backgroundColor: evenRow ? COLOR_SECONDARY : 'white'}]}>
          <Text style={[styles.calendarDropdown_row_text, highlighted && {color: COLOR_HIGHLIGHT}]}>
            {`${rowData.title}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  calendarDropdownRenderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == this.state.calendars.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={styles.calendarDropdown_separator}
                  key={key}
    />);
  }

  renderOkButton() {
    if (this.state.okVisible){
      return (
        <Button
          style={styles.okbutton}
          onPress={() => {this.okButtonClicked()}}
          icon={{
            name: 'check',
            size: 20,
            color: 'white'
          }}
          buttonStyle={{
            backgroundColor: COLOR_PRIMARY,
            width: 140,
            height: 40,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: BORDER_RADIUS
          }}
          title='Ok'
        />
      )
    }
    return null;
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
          <View style={styles.titleview}>
            <Text
              style={styles.title}>
              {'Kalender wählen'}
            </Text>
          </View>
          <View style={styles.dropdownview}>
              <ModalDropdown ref="calendarDropdown"
                style={styles.calendarDropdown}
                textStyle={styles.calendarDropdown_text}
                dropdownStyle={styles.calendarDropdown_dropdown}
                defaultValue="Kalender wählen"
                options={this.state.calendars}
                renderButtonText={(rowData) => this.calendarDropdownRenderButtonText(rowData)}
                renderRow={this.calendarDropdownRenderRow.bind(this)}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.calendarDropdownRenderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                onSelect={(index, value) => {this.calendarSelected(index, value)}}
              />
              </View>
          <View style={styles.buttonview}>
            {this.renderOkButton()}
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
  titleview: {
    marginTop: 5,
    marginLeft: 38,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dropdownview: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarDropdown: {
    width: 200,
    marginTop: 15,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: COLOR_PRIMARY,
  },
  calendarDropdown_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  calendarDropdown_dropdown: {
    width: 200,
    height: 300,
    borderColor: COLOR_PRIMARY,
    borderWidth: 2,
    borderRadius: 3,
  },
  calendarDropdown_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  calendarDropdown_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  calendarDropdown_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'black',
    textAlignVertical: 'center',
  },
  calendarDropdown_separator: {
    height: 1,
    backgroundColor: COLOR_PRIMARY,
},
buttonview: {
  marginTop: 10,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
},  
okbutton: {
    marginTop:20,
  }
});
