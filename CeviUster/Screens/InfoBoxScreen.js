import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Config from 'react-native-config';
import moment from 'moment';
import { observable, observe } from "mobx"
import { COLOR_PRIMARY, BORDER_RADIUS } from '../styles/common.js'

export default class InfoBoxScreen extends React.Component {

  containerMargin = 10;
  contentMarginLeft = 38;

  state = observable({
    stufe: null,
    aktuell: false,
    von: null,
    bis: null,
    wo: null,
    infos: null,
    mitnehmen: null,
    email: null,
  });

  disposer = observe(this.state, (change) => {
    console.log(change.type, change.name, "from", change.oldValue, "to", change.object[change.name]);
  });

  static navigationOptions = ({ navigation }) => ({
    title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'find' : navigation.state.params.title,
  });

  constructor(props) {
    super(props);
    console.log(props);
    if (this.props.navigation.state.params && this.props.navigation.state.params.parentStufe) {
      this.state.stufe = this.props.navigation.state.params.parentStufe;
      this.props.navigation.setParams({ title: this.props.navigation.state.params.parentStufe.name });
    } else {
      this.props.navigation.setParams({ title: "Unknown" });
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchChaeschtli();
  }

  fetchChaeschtli = async () => {
    const url = `${Config.INFOBOX_BASE_URL}chaeschtlizettel/${this.state.stufe.stufen_id}`;
    console.log(`Try to load chaeschtli from URL: ${url}`);
    const chaeschliResponse = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });
    const json = await chaeschliResponse.json();
    if (json !== undefined && json !== null) {
      var expiryMoment = moment(Date.parse(json.bis)).endOf('day');
      this.state.aktuell = moment().diff(expiryMoment) < 0;
      if (!this.state.aktuell) {
        this.state.von = null;
        this.state.bis = null;
        this.state.wo = null;
        this.state.infos = 'Keine aktuelle Informationen verfügbar. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.';
        this.state.mitnehmen = null;
        this.state.email = null;
      } else {
        this.state.von = new Date(Date.parse(json.von));
        this.state.bis = new Date(Date.parse(json.bis));
        this.state.wo = json.wo;
        this.state.infos = json.infos;
        this.state.mitnehmen = json.mitnehmen;
        this.state.email = json.email;
      }
      console.log(this.state.von);
    }
  }

  dropOutButtonClicked() {
    console.log("dropOutButtonClicked");
    this.props.navigation.navigate('DropOut', { parentStufe: this.state.stufe, destinationEmail: this.state.email });
  }

  render() {
    let dateTime = '';
    if (this.state.von !== undefined && this.state.von !== null) {
      let fromDay = ('0' + this.state.von.getDate()).slice(-2);
      let fromMonth = ('0' + (this.state.von.getMonth() + 1)).slice(-2);
      let fromHours = ('0' + this.state.von.getHours()).slice(-2);
      let fromMinutes = ('0' + this.state.von.getMinutes()).slice(-2);
      dateTime = `${fromDay}.${fromMonth}.${this.state.von.getFullYear()} ${fromHours}:${fromMinutes}`;
    }

    if (this.state.bis !== undefined && this.state.bis !== null) {
      let toHours = ('0' + this.state.bis.getHours()).slice(-2);
      let toMinutes = ('0' + this.state.bis.getMinutes()).slice(-2);
      dateTime = `${dateTime} - ${toHours}:${toMinutes}`;
    }

    if (this.state.aktuell) {
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
                style={styles.header}>
                {"\n"}Treffpunkt:
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
                style={styles.header}>
                {"\n"}Infos:
              </Text>
              <Text
                style={styles.info}>
                {this.state.infos}
              </Text>
              <Text
                style={styles.header}>
                {"\n"}Mitnehmen:
              </Text>
              <Text
                style={styles.mitnehmen}>
                {this.state.mitnehmen}
              </Text>
            </View>
            <View style={styles.buttonview}>
                <Button
                  style={styles.dropOutButton}
                  onPress={() => { this.dropOutButtonClicked() }}
                  buttonStyle={{
                    backgroundColor: COLOR_PRIMARY,
                    width: 140,
                    height: 50,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: BORDER_RADIUS
                  }}
                  title='Abmelden!'
                />
            </View>
          </View>
        </ScrollView>
      );
    } else {
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
                style={styles.header}>
                {"\n"}Infos:
              </Text>
              <Text
                style={styles.info}>
                {this.state.infos}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
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
  header: {
    fontSize: 16,
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
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropOutButton: {
    marginTop: 10,
  }
});
