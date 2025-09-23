import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { CheckBox, Button } from "react-native-elements";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import AlertAsync from "react-native-alert-async";
import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  BORDER_RADIUS,
} from "../../../constants/Colors";
import { Info } from "../../types/info";
import URLs from "../../../constants/URLs";
import validator from "validator";

export default function DropOut() {
  const {
    stufe,
    aktuell,
    infos,
    von,
    bis,
    wo,
    mit,
    email,
  } = useLocalSearchParams<{
    stufe: string;
    aktuell: boolean;
    infos: string;
    von: string;
    bis: string;
    wo: string;
    mit: string;
    email: string;
  }>();

  const info: Info = {
    stufe,
    aktuell,
    infos,
    von: von ? new Date(Date.parse(von)) : null,
    bis: bis ? new Date(Date.parse(bis)) : null,
    wo,
    mitnehmen: mit,
    email,
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (stufe) {
      navigation.setOptions({ title: stufe });
    }
  }, [navigation, stufe]);

  const content = dropOutImpl(info);

  return Platform.OS === "ios" ? (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      behavior="padding"
      enabled
      keyboardVerticalOffset={100}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    <KeyboardAvoidingView>{content}</KeyboardAvoidingView>
  );
}

function dropOutImpl(info: Info) {
  const [isSending, setIsSending] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState(
    "ich möchte mich für das nächste Programm abmelden"
  );
  const [message, setMessage] = useState("");
  const [acceptance, setAcceptance] = useState(false);

  const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;

  function validateData() {
    if (!senderName) {
      Alert.alert("Bitte gib deinen Namen ein.");
      return false;
    } else if (!validator.isEmail(senderEmail)) {
      Alert.alert("Bitte gib eine gültige E-Mailadresse ein.");
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
    formData.append("destination-email", info.email);
    formData.append("your-name", senderName);
    formData.append("your-email", senderEmail.toLowerCase());
    formData.append("your-subject", subject);
    formData.append("your-message", message);
    formData.append("acceptance", acceptance);

    fetch(URLs.DROP_OFF_FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        handleSuccess(json);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Fehler beim Senden!", error.message);
      });
  }

  async function handleSuccess(json) {
    const message =
      json.status !== "mail_sent"
        ? `Nachricht: ${json.message}`
        : "Vielen Dank für deine Abmeldung.";

    const title = json.status !== "mail_sent" ? "Senden fehlgeschlagen" : "Gesendet";

    const choice = await AlertAsync(title, message, [{ text: "Ok", onPress: () => "ok" }], {
      cancelable: true,
      onDismiss: () => "ok",
    });

    if (json.status === "mail_sent" && choice === "ok") {
      router.back();
    }
  }

  async function handleSubmit() {
    if (validateData()) {
      setIsSending(true);
      sendData();
    }
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
          onChangeText={setSenderName}
          onBlur={Keyboard.dismiss}
          value={senderName}
        />
        <Text style={styles.text}>Deine E-Mailadresse*</Text>
        <TextInput
          style={styles.text_input}
          keyboardType="email-address"
          onChangeText={setSenderEmail}
          value={senderEmail}
          autoCorrect={false}
        />
        <Text style={styles.text}>Deine Nachricht</Text>
        <TextInput
          style={styles.multiline_text_input}
          onChangeText={setMessage}
          onBlur={Keyboard.dismiss}
          value={message}
          multiline
        />
        <CheckBox
          containerStyle={styles.checkbox}
          textStyle={styles.checkbox}
          checked={acceptance}
          onPress={() => setAcceptance(!acceptance)}
          title="Ich stimme der Datenverwendung für diese Nachricht zu"
        />
      </View>
      <View style={styles.buttonView}>
        <Button
          style={styles.sendButton}
          onPress={handleSubmit}
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
      {isSending && (
        <ActivityIndicator
          size="large"
          color={COLOR_PRIMARY}
          style={styles.waitOverlay}
        />
      )}
    </ScrollView>
  );
}

const lightstyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
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

const darkstyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
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
    color: 'white',
	},
	subtitle: {
		fontSize: 20,
    color: 'white',
	},
	text: {
		paddingTop: 15,
		fontSize: 18,
		fontWeight: "bold",
    color: 'white',
	},
  centerText:{
      textAlign: 'center',
      color: 'white',
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
  checkbox:{
    backgroundColor: 'black',
    color: 'white',
    borderColor: 'black',
  },
    waitOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
     },
});