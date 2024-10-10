import { React, useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  ActivityIndicator,
	Alert,
  Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { CheckBox, Button } from "react-native-elements";
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import AlertAsync from "react-native-alert-async";
import { COLOR_PRIMARY, COLOR_SECONDARY, BORDER_RADIUS} from  "../../../constants/Colors";
import Info from "../../types/Info"
import DropOutMessage from "../../types/DropOutMessage"

export default function dropOut(props) {  
  
  console.log("Drop out");

  const param = ({
		stufe,
    aktuell,
    infos,
    von,
    bis,
    wo,
    mit,
    email
	} = useLocalSearchParams<{ stufe: string; aktuell: boolean; infos: string; von: string; bis: string; wo: string; mit: string; email: string }>());

  const info: Info = {
    stufe: param.stufe,
    aktuell: param.aktuell,
    infos: param.infos,
    von: param.von ? new Date(Date.parse(param.von)) : null,
    bis: param.bis ? new Date(Date.parse(param.bis)) : null,
    wo: param.wo,
    mitnehmen: param.mit,
    email: param.email,
  }

  const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: param.stufe,
		});
	}, [navigation]);
  
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        {dropOutImpl(info)}
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <KeyboardAvoidingView>
        {dropOutImpl(info)}
      </KeyboardAvoidingView>
    );
  }

}

function dropOutImpl(info: Info){
  console.log("Drop out Impl");
  const [isSending, setIsSending] =  useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("Ich möchte mich für das nächste Programm abmelden");
  const [message, setMessage] = useState("");
  const [acceptance, setAcceptance] = useState(false);
  
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Abmeldung</Text>
        <Text style={styles.subtitle}>
          für das nächste Programm der Stufe {info.stufe}
        </Text>
        <Text style={styles.text}>Dein Name*</Text>
        <TextInput
          style={styles.text_input}
          onChangeText={(senderName) =>
            setSenderName(senderName)
          }
          onBlur={Keyboard.dismiss}
          value={senderName}
        />
        <Text style={styles.text}>Deine E-Mailadresse*</Text>
        <TextInput
          style={styles.text_input}
          keyboardType="email-address"
          onChangeText={(senderEmail) =>
            setSenderEmail(senderEmail)
          }
          value={senderEmail}
          autoCorrect={false}
        />
        <Text style={styles.text}>Deine Nachricht</Text>
        <TextInput
          style={styles.multiline_text_input}
          onChangeText={(message) =>
            setMessage(message)
          }
          onBlur={Keyboard.dismiss}
          value={message}
          multiline={true}
        />
        <CheckBox
          checked={acceptance}
          onPress={() =>
            setAcceptance(!acceptance)
          }
          title="Ich stimme der Datenverwendung für diese Nachricht zu"
        />
      </View>
      <View style={styles.buttonView}>
        <Button
          style={styles.sendButton}
          onPress={() => {
            handleSubmit();
          }}
          buttonStyle={{
            backgroundColor: COLOR_PRIMARY,
            width: 140,
            height: 50,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: BORDER_RADIUS,
          }}
          title="Senden"
        />
      </View>
      {isSending && (<ActivityIndicator size="large"	color={COLOR_PRIMARY} style={styles.waitOverlay}/>)}
    </ScrollView>
  );
}

function validateData(senderName: string, senderEmail: string, acceptance: boolean) {
  if (!senderName) {
    Alert.alert("Bitte gibt deinen Namen ein. ");
    return false;
  } else if (!senderEmail) {
    Alert.alert("Bitte gibt deine E-Mailadresse ein.");
    return false;
  }
  if (!acceptance) {
    Alert.alert("Bitte stimme der Datenverwendung zu.");
    return false;
  }
  return true;
}

function handleSubmit() {
  console.log("dropOutButtonClicked");
  if (validateData){
    router.back();
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 10,
	},
	inputContainer: {
		paddingTop: 15,
	},
	text_input: {
		borderColor: "#CCCCCC",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		height: 36,
		fontSize: 18,
		paddingLeft: 20,
		paddingRight: 20,
	},
	multiline_text_input: {
		borderColor: "#CCCCCC",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		height: 100,
		fontSize: 18,
		paddingLeft: 20,
		paddingRight: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 20,
	},
	text: {
		paddingTop: 15,
		fontSize: 18,
		fontWeight: "bold",
	},
    centerText:{
        textAlign: 'center',
    },
	buttonView: {
		marginTop: 10,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	sendButton: {
		marginTop: 10,
	},
    waitOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
     },
});