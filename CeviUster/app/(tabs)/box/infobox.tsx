import React from "react";
import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import moment from "moment";
import { decode } from "html-entities";
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { COLOR_PRIMARY, BORDER_RADIUS } from "../../../constants/Colors";
import URLs from "../../../constants/URLs";

type Info = {
  stufe: string;
  aktuell: boolean;
  von?: Date;
  bis?: Date;
  wo?: string;
  infos?: string;
  mitnehmen?: string;
  email?: string;
};

async function getInfo(stufenId: string, stufenName: string) {
  var promise = new Promise(function(resolve, reject) {
    const url = `${URLs.INFOBOX_BASE_URL}chaeschtlizettel/${stufenId}`;
    console.log(`Try to load info from URL: ${url}`);
    const load = async () => {
      const chaeschliResponse = await fetch(url, {
        headers: {
          Accept: "application/json"
        }
      });
      console.log("Fetch finished");
      const json = await chaeschliResponse.json();
      if (json !== undefined && json !== null) {
        var expiryMoment = moment(Date.parse(json.bis)).endOf('day');
        let isActual: boolean = moment().diff(expiryMoment) < 0;
        const info: Info = {
          stufe: stufenName,
          aktuell: isActual,
          infos: isActual ? decode(json.infos) : 'Keine aktuelle Informationen verfügbar. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.',
          von: isActual ? new Date(Date.parse(json.von)) : null,
          bis: isActual ? new Date(Date.parse(json.bis)) : null,
          wo: isActual ? decode(json.wo) : null,
        }
        console.log(info.von);
        resolve(info);
      } else {
        const info: Info = {
          stufe: stufenName,
          aktuell: isActual,
          infos: 'Bei der Dateabfrage ist ein Fehler aufgetreten. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.',
        }
        resolve(info);
      }
    }
    load(); 
  });
  
  return promise;   
}


export default function InfoBox(props) {
	const param = ({
		// ID der Stufe
		parentStufe,
		// Name der Stufe für die Anzeige im Titel
		title,
	} = useLocalSearchParams<{ parentStufe: string; title: string }>());

  const [info, setInfo] = useState([])

	console.log(param.title);
	console.log(param.parentStufe);

	const navigation = useNavigation();
	useLayoutEffect(() => {
		navigation.setOptions({
			title: param.title,
		});
	}, [navigation]);

  useEffect(
    () => {
      getInfo(param.parentStufe, param.title).then(
        res => {
          console.log(res);
          setInfo(res)
        }
     )
   }, [getInfo]
  )
  console.log('info', info)
  let dateTime = "";
  if (info.von !== undefined && info.von !== null) {
    let fromDay = ("0" + info.von.getDate()).slice(-2);
    let fromMonth = ("0" + (info.von.getMonth() + 1)).slice(-2);
    let fromHours = ("0" + info.von.getHours()).slice(-2);
    let fromMinutes = ("0" + info.von.getMinutes()).slice(-2);
    dateTime = `${fromDay}.${fromMonth}.${info.von.getFullYear()} ${fromHours}:${fromMinutes}`;
  }

  if (info.bis !== undefined && info.bis !== null) {
    let toHours = ("0" + info.bis.getHours()).slice(-2);
    let toMinutes = ("0" + info.bis.getMinutes()).slice(-2);
    dateTime = `${dateTime} - ${toHours}:${toMinutes}`;
  }

	if (info.aktuell) {
		return (
			<ScrollView>
				<View style={styles.container}>
					<Image
						style={styles.icon}
						source={require("../../../assets/images/CeviLogoTransparent.png")}
					/>
					<View style={styles.content}>
						<Text style={styles.title}>{info.stufe}</Text>
						<Text style={styles.header}>{"\n"}Treffpunkt:</Text>
						<Text style={styles.date}>{dateTime}</Text>
						<Text style={styles.ort}>{info.wo}</Text>
						<Text style={styles.header}>{"\n"}Infos:</Text>
						<Text style={styles.info}>{info.infos}</Text>
						<Text style={styles.header}>{"\n"}Mitnehmen:</Text>
						<Text style={styles.mitnehmen}>{info.mitnehmen}</Text>
					</View>
					<View style={styles.buttonview}>
						<Button
							style={styles.dropOutButton}
							onPress={() => {
								dropOutButtonClicked();
							}}
							buttonStyle={{
								backgroundColor: COLOR_PRIMARY,
								width: 140,
								height: 50,
								borderColor: "transparent",
								borderWidth: 0,
								borderRadius: BORDER_RADIUS,
							}}
							title="Abmelden"
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
						source={require("../../../assets/images/CeviLogoTransparent.png")}
					/>
					<View style={styles.content}>
						<Text style={styles.title}>{info.stufe}</Text>
						<Text style={styles.header}>{"\n"}Infos:</Text>
						<Text style={styles.info}>{info.infos}</Text>
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

const styles = StyleSheet.create({
	container: {
		margin: 10,
	},
	icon: {
		width: 60,
		height: 60,
	},
	content: {
		marginTop: 5,
		marginLeft: 38,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
	},
	header: {
		fontSize: 16,
		fontWeight: "bold",
	},
	date: {
		marginTop: 10,
		fontSize: 14,
		fontWeight: "bold",
		color: 0x023eff,
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
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	dropOutButton: {
		marginTop: 10,
	},
});
