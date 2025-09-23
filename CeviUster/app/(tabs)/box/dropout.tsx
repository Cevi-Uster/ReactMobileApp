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
import { Info } from "../../../services/infoService.d";
import URLs from "../../../constants/URLs";
import validator from "validator";
import { sharedStyles } from '../../../constants/sharedStyles';

const baseStyles = StyleSheet.create({
  ...sharedStyles,
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

  waitOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});

const lightstyles = StyleSheet.create({
  ...baseStyles,
  checkbox: {
    backgroundColor: "white",
    color: "black",
    borderColor: "white",
  },
});

const darkstyles = StyleSheet.create({
  ...baseStyles,
  checkbox: {
    backgroundColor: "black",
    color: "white",
    borderColor: "black",
  },
});

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
  } = useLocalSearchParams<Record<string, string>>(); // Adjusted type to Record<string, string>

  const info: Info = {
    stufe,
    aktuell: aktuell === "true", // Convert string to boolean
    infos,
    von: von ? new Date(Date.parse(von)) : undefined, // Use undefined instead of null
    bis: bis ? new Date(Date.parse(bis)) : undefined, // Use undefined instead of null
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
    formData.append("destination-email", info.email || ""); // Ensure string value
    formData.append("your-name", senderName);
    formData.append("your-email", senderEmail.toLowerCase());
    formData.append("your-subject", subject);
    formData.append("your-message", message);
    formData.append("acceptance", acceptance.toString()); // Convert boolean to string

    fetch(URLs.DROP_OFF_FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((json: { status: string; message: string }) => {
        handleSuccess(json);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Fehler beim Senden!", error.message);
      });
  }

  async function handleSuccess(json: { status: string; message: string }) {
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
      <View style={styles.buttonview}>
        <Button
          style={styles.savebutton}
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