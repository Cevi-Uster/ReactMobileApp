import React from "react";
import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { COLOR_PRIMARY, BORDER_RADIUS } from "../../../constants/Colors";
import Info from "../../types/Info"
import getInfo from "../../service/getInfo"

export default function infoBox(props) {
	const param = ({
		// ID der Stufe
		parentStufe,
		// Name der Stufe für die Anzeige im Titel
		title,
	} = useLocalSearchParams<{ parentStufe: string; title: string }>());

  let [info, setInfo] = useState([]);

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

	if (/*info.aktuell*/true) {
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
								dropOutButtonClicked(info);
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

function dropOutButtonClicked(info: Info) {
	console.log("dropOutButtonClicked");
	//this.props.navigation.navigate('DropOut', { parentStufe: this.state.stufe, destinationEmail: this.state.email });
	//router.push('/box/dropout?info=' + info);
	router.push({ pathname: `/box/dropout`, params: info });
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
