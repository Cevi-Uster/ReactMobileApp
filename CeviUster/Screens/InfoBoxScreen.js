import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import {observable, observe, computed, action, decorate } from "mobx"
import {observer} from "mobx-react"
import {COLOR_PRIMARY, COLOR_SECONDARY, BORDER_RADIUS} from '../styles/common.js'

export default class InfoBoxScreen extends React.Component {

  containerMargin = 10;
  contentMarginLeft = 38;

  state = observable({
    stufe: null,
    von: null,
    bis: null,
    wo: null,
    infos: null,
    mitnehmen: null,
  });
  
  disposer = observe(this.state, (change) => {
    console.log(change.type, change.name, "from", change.oldValue, "to", change.object[change.name]);
  });

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
  });

  constructor(props){
     super(props);
     console.log(props);
     if (this.props.navigation.state.params && this.props.navigation.state.params.parentStufe){
       this.state.stufe = this.props.navigation.state.params.parentStufe;
       this.props.navigation.setParams({ title: this.props.navigation.state.params.parentStufe.name });
     } else {
       this.props.navigation.setParams({ title: "Unknown" });
     }
  }

  componentWillMount(){
    this.fetchData();
  }

  fetchData = () => {
    this.fetchChaeschtli();
  }

  fetchChaeschtli = async () => {
    const url = `${Config.INFOBOX_BASE_URL}chaeschtlizettel/${this.state.stufe.stufen_id}`;
    console.log(`Try to load chaeschtli from URL: ${url}`);
    const chaeschliResponse = await fetch(url);
    const json = await chaeschliResponse.json();
    if (json !== undefined && json !== null){
      this.state.von= json.von;
      this.state.bis = json.bis;
      this.state.wo = json.wo;
      this.state.infos = json.infos;
      this.state.mitnehmen = json.mitnehmen;
      console.log(this.state);
    } 
    
  }

  render2() {
    return (
      <Text
      style={styles.title}>
      {this.state.wo}
    </Text>
    );
  }

  render() {
    let dateTime = '';
    if (this.state.von !== undefined && this.state.von !== null) {
      dateTime = `${this.state.von}`;
    }
    
    if (this.state.bis!== undefined && this.state.bis !== null) {
      dateTime= `${dateTime} - ${this.state.bis}`
    }
  
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
              {this.state.stufe.name}
            </Text>
            <Text
              style={styles.date}>
              {dateTime}
            </Text>
            <Text
              style={styles.ort}>
              {this.state.wo}
            </Text>
            <Text
              style={styles.info}>
              {this.state.infos}
            </Text>
            <Text
              style={styles.mitnehmen}>
              {this.state.mitnehmen}
            </Text>
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
  ort: {
    marginTop: 5,
    fontSize: 14,
  },
  info: {
    marginTop: 5,
    fontSize: 14,
  },
  mitnehmen: {
    marginTop: 5,
    fontSize: 14,
  },
});
