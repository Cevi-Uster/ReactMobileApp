import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import moment from 'moment';
import {decode} from 'html-entities';
import { router, useLocalSearchParams, useNavigation, Link } from 'expo-router';
import { useState, useRef, useLayoutEffect } from 'react';
import { COLOR_PRIMARY, BORDER_RADIUS } from '../../../constants/Colors';
import URLs from '../../../constants/URLs';
import { useEffect } from 'react';

function ChaeschtliInfo( info ){
  console.log("render scrollview");
  console.log(info);

  if (info.aktuell) {
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
              {info.stufe.name}
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
              {info.wo}
            </Text>
            <Text
              style={styles.header}>
              {"\n"}Infos:
            </Text>
            <Text
              style={styles.info}>
              {info.infos}
            </Text>
            <Text
              style={styles.header}>
              {"\n"}Mitnehmen:
            </Text>
            <Text
              style={styles.mitnehmen}>
              {info.mitnehmen}
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
              {info.stufe.name}
            </Text>
            <Text
              style={styles.header}>
              {"\n"}Infos:
            </Text>
            <Text
              style={styles.info}>
              {info.infos}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

  export default function InfoBox (props) {
      
    const param = {
      // The route parameter
      parentStufe,
      // An optional search parameter.
      title
    } = useLocalSearchParams<{ parentStufe: string; title: string }>();

    state = {
      stufe: {name: param.title, stufen_id: param.parentStufe},
      aktuell: false,
      von: null,
      bis: null,
      wo: null,
      infos: null,
      mitnehmen: null,
      email: null,
    };

    const [info, setState] = useState(state);
 
    console.log("Title: " + param.title);
    console.log("Stufen_Id: " + param.parentStufe);

    const navigation = useNavigation();
    useLayoutEffect(() => {
      navigation.setOptions({
        title: param.title,
      });
    }, [navigation]);
    
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

    useEffect(() => {
      // code to run after render goes here
      console.log("fetch called");
      fetchData();
    }, []); // <-- empty array means 'run once'

    fetchData = () => {
      fetchChaeschtli();

    }
  
    fetchChaeschtli = async () => {
      const url = `${URLs.INFOBOX_BASE_URL}chaeschtlizettel/${state.stufe.stufen_id}`;
      console.log(`Try to load chaeschtli from URL: ${url}`);
      const chaeschliResponse = await fetch(url, {
        headers: {
          Accept: "application/json"
        }
      });
      const json = await chaeschliResponse.json();
      if (json !== undefined && json !== null) {
        var expiryMoment = moment(Date.parse(json.bis)).endOf('day');
        state.aktuell = moment().diff(expiryMoment) < 0;
        console.log("aktuell: "+state.aktuell);
        if (!state.aktuell) {
          state.von = null;
          state.bis = null;
          state.wo = null;
          state.infos = 'Keine aktuelle Informationen verfügbar. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.';
          state.mitnehmen = null;
          state.email = null;
        } else {
          state.von = new Date(Date.parse(json.von));
          state.bis = new Date(Date.parse(json.bis));
          state.wo = decode(json.wo);
          state.infos = decode(json.infos);
          state.mitnehmen = decode(json.mitnehmen);
          state.email = decode(json.email);
        }
        console.log(state);
        setState(state);
      }
    }
  
    function dropOutButtonClicked() {
      console.log("dropOutButtonClicked");
      //this.props.navigation.navigate('DropOut', { parentStufe: this.state.stufe, destinationEmail: this.state.email });
    }

    return(
      <ChaeschtliInfo info ={info}/>
    )
  }



  /*componentDidMount() {
    fetchData();
  }*/



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
