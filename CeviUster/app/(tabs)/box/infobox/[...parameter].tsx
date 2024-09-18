import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import moment from 'moment';
import {decode} from 'html-entities';
<<<<<<<< HEAD:CeviUster/app/(tabs)/box/infobox.tsx
import { COLOR_PRIMARY, BORDER_RADIUS } from '../../../constants/Colors';
import URLs from '../../../constants/URLs';
import { useLocalSearchParams } from 'expo-router';
========
import { router, useLocalSearchParams, Link } from 'expo-router';
import { COLOR_PRIMARY, BORDER_RADIUS } from '../../../../constants/Colors';
import URLs from '../../../../constants/URLs';
>>>>>>>> 26aff910368bb3649f247e9572265274564a8659:CeviUster/app/(tabs)/box/infobox/[...parameter].tsx



  export default function InfoBox (props) {
  
    const param = {
      // The route parameter
      parentStufe,
      // An optional search parameter.
      title
    } = useLocalSearchParams<{ parentStufe: string; title: string }>();

    console.log(param.title);
    console.log(param.parentStufe);

    state = {
      stufe: {name: param.title},
      aktuell: false,
      von: null,
      bis: null,
      wo: null,
      infos: null,
      mitnehmen: null,
      email: null,
    };
    
    containerMargin = 10;
    contentMarginLeft = 38;

    /*if (this.props.route.params && this.props.route.params.parentStufe) {
      this.state.stufe = this.props.route.params.parentStufe;
      this.props.navigation.setOptions({ title: this.props.route.params.parentStufe.name });
    } else {
      this.props.navigation.setOptions({ title: "Unknown" });
    }*/

    let dateTime = '';
    if (state.von !== undefined && state.von !== null) {
      let fromDay = ('0' + state.von.getDate()).slice(-2);
      let fromMonth = ('0' + (state.von.getMonth() + 1)).slice(-2);
      let fromHours = ('0' + state.von.getHours()).slice(-2);
      let fromMinutes = ('0' + state.von.getMinutes()).slice(-2);
      dateTime = `${fromDay}.${fromMonth}.${state.von.getFullYear()} ${fromHours}:${fromMinutes}`;
    }

    if (state.bis !== undefined && state.bis !== null) {
      let toHours = ('0' + state.bis.getHours()).slice(-2);
      let toMinutes = ('0' + state.bis.getMinutes()).slice(-2);
      dateTime = `${dateTime} - ${toHours}:${toMinutes}`;
    }

    if (state.aktuell) {
      return (
        <ScrollView>
          <View style={styles.container}>
            <Image
              style={styles.icon}
              source={require('../../../assets/images/CeviLogoTransparent.png')}
            />
            <View style={styles.content}>
              <Text
                style={styles.title}>
                {state.stufe.name}
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
                {state.wo}
              </Text>
              <Text
                style={styles.header}>
                {"\n"}Infos:
              </Text>
              <Text
                style={styles.info}>
                {state.infos}
              </Text>
              <Text
                style={styles.header}>
                {"\n"}Mitnehmen:
              </Text>
              <Text
                style={styles.mitnehmen}>
                {state.mitnehmen}
              </Text>
            </View>
            <View style={styles.buttonview}>
                <Button
                  style={styles.dropOutButton}
                  onPress={() => { dropOutButtonClicked() }}
                  buttonStyle={{
                    backgroundColor: COLOR_PRIMARY,
                    width: 140,
                    height: 50,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: BORDER_RADIUS
                  }}
                  title='Abmelden'
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
              source={require('../../../assets/images/CeviLogoTransparent.png')}
            />
            <View style={styles.content}>
              <Text
                style={styles.title}>
                {state.stufe.name}
              </Text>
              <Text
                style={styles.header}>
                {"\n"}Infos:
              </Text>
              <Text
                style={styles.info}>
                {state.infos}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
  }

  /*componentDidMount() {
    fetchData();
  }*/

  /*fetchData = () => {
    fetchChaeschtli();
  }*/

  /*fetchChaeschtli = async () => {
    const url = `${URLs.INFOBOX_BASE_URL}chaeschtlizettel/${this.state.stufe.stufen_id}`;
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
        this.setState({von: null});
        this.setState({bis: null});
        this.setState({wo: null});
        this.setState({infos: 'Keine aktuelle Informationen verfügbar. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.'});
        this.setState({mitnehmen: null});
        this.setState({email: null});
      } else {
        this.setState({von: new Date(Date.parse(json.von))});
        this.setState({bis: new Date(Date.parse(json.bis))});
        this.setState({wo: decode(json.wo)});
        this.setState({infos: decode(json.infos)});
        this.setState({mitnehmen: decode(json.mitnehmen)});
        this.setState({email: decode(json.email)});
      }
      console.log(this.state.von);
    }
  }*/

  function dropOutButtonClicked() {
    console.log("dropOutButtonClicked");
    //this.props.navigation.navigate('DropOut', { parentStufe: this.state.stufe, destinationEmail: this.state.email });
  }

<<<<<<<< HEAD:CeviUster/app/(tabs)/box/infobox.tsx
  
========
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
              source={require('../../../../assets/images/CeviLogoTransparent.png')}
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
                  title='Abmelden'
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
              source={require('../../../../assets/images/CeviLogoTransparent.png')}
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
>>>>>>>> 26aff910368bb3649f247e9572265274564a8659:CeviUster/app/(tabs)/box/infobox/[...parameter].tsx

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
