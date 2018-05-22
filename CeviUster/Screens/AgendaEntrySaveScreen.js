import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
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
    auth: null,
    calendars: [],
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
    this.setState({calendars: calendars});
    console.log(this.state.calendars);
  }

  okButtonClicked(){
    if (RNCalendarEvents.authorizationStatus() !== 'denied'){
      console.log(RNCalendarEvents.authorizationStatus());
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
        <View style={[styles.calendarDropdown_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
          <Text style={[styles.calendarDropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
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
            <ModalDropdown ref="calendarDropdown"
               style={styles.calendarDropdown}
               textStyle={styles.calendarDropdown_text}
               dropdownStyle={styles.calendarDropdown_dropdown}
               options={this.state.calendars}
               renderButtonText={(rowData) => this.calendarDropdownRenderButtonText(rowData)}
               renderRow={this.calendarDropdownRenderRow.bind(this)}
               renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.calendarDropdownRenderSeparator(sectionID, rowID, adjacentRowHighlighted)}
/>
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
  calendarDropdown: {
    width: 200,
    marginTop: 15,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'cornflowerblue',
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
    borderColor: 'cornflowerblue',
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
    color: 'navy',
    textAlignVertical: 'center',
  },
  calendarDropdown_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
},
  okbutton: {
    marginTop:20,
  }
});
