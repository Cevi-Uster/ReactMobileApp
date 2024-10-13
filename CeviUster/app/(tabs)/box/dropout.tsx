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
import URLs from "../../../constants/URLs";
import validator from "validator";

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
  const [subject, setSubject] = useState("ich möchte mich für das nächste Programm abmelden");
  const [message, setMessage] = useState("");
  const [acceptance, setAcceptance] = useState(false);

  function validateData() {
		if (!senderName) {
			Alert.alert("Bitte gibt deinen Namen ein. ");
			return false;
		} else if (!validator.isEmail(senderEmail)) {
			Alert.alert("Bitte gibt deine E-Mailadresse ein.");
			return false;
		}
		if (!acceptance) {
			Alert.alert("Bitte stimme der Datenverwendung zu.");
			return false;
		}
		return true;
	}

  function sendData() {
		let formData = new FormData();
		formData.append("_wpcf7", "1510");
		formData.append("_wpcf7_unit_tag", "wpcf7-f1510-p286-o2");
	  //formData.append('destination-email', this.state.destinationEmail);
		//formData.append("destination-email", "marc@mabaka.ch");
    formData.append("destination-email", "matthias@kunz.family");
		formData.append("your-name", senderName);
		formData.append("your-email", senderEmail.toLowerCase());
		formData.append("your-subject", subject);
		formData.append("your-message", message);
		formData.append("acceptance", acceptance);

		const url = `${URLs.DROP_OFF_FORM_URL}`;
		console.log("FormData: " + JSON.stringify(formData, null, 4));
		
    fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			body: formData,
		})
			.then((response) => response.json())
			.then((json) => {
        console.log("Message sent");
				handleSuccess(json);
			})
			.catch((error) => {
				console.error(error);
				Alert.alert("Fehler beim Senden!", error);
			});
	}

	function handleSuccess(json) {
		console.log("Response: " + JSON.stringify(json, null, 4));
		const showSuccessMessageAndGoBack = async () => {
            if ('mail_sent' !== json.status){
                const choice = await AlertAsync(
                    "Senden fehlgeschlagen",
                    "Nachricht: " + json.message,
                    [{ text: "Ok", onPress: () => "ok" }],
                    {
                        cancelable: true,
                        onDismiss: () => "ok",
                    }
                );
            } else {
                const choice = await AlertAsync(
                    "Gesendet",
                    "Vielen Dank für deine Abmeldung.",
                    [{ text: "Ok", onPress: () => "ok" }],
                    {
                        cancelable: true,
                        onDismiss: () => "ok",
                    }
                );
    
                if (choice === "ok") {
                  router.back();
                }
            }
			
		};
		showSuccessMessageAndGoBack();
	}

  async function handleSubmit() {
    console.log("dropOutButtonClicked");
    if (validateData()) {
      sendData();
    }
    //await router.back();
  }
  
  
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