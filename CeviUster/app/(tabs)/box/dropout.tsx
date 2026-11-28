import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import validator from 'validator';
import Checkbox from '@/components/ui/Checkbox';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useThemeColors } from '@/hooks/use-theme-colors';
import URLs from '../../../constants/URLs';
import { sharedStyles } from '../../../constants/sharedStyles';
import { fetchWithTimeout } from '../../../services/http';

const SUBJECT = 'ich möchte mich für das nächste Programm abmelden';

export default function DropOut() {
  const { stufe, email } = useLocalSearchParams<Record<string, string>>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (stufe) {
      navigation.setOptions({ title: stufe });
    }
  }, [navigation, stufe]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <DropOutForm stufe={stufe} destinationEmail={email} />
    </KeyboardAvoidingView>
  );
}

function DropOutForm({ stufe, destinationEmail }: { stufe?: string; destinationEmail?: string }) {
  const colors = useThemeColors();
  const [isSending, setIsSending] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [acceptance, setAcceptance] = useState(false);

  const inputStyle = [styles.input, { color: colors.text, borderColor: colors.inputBorder }];
  const labelStyle = [sharedStyles.text, { color: colors.text }];

  function validateData() {
    if (!senderName.trim()) {
      Alert.alert('Bitte gib deinen Namen ein.');
      return false;
    }
    if (!validator.isEmail(senderEmail.trim())) {
      Alert.alert('Bitte gib eine gültige E-Mailadresse ein.');
      return false;
    }
    if (!acceptance) {
      Alert.alert('Bitte stimme der Datenverwendung zu.');
      return false;
    }
    return true;
  }

  async function sendData() {
    const formData = new FormData();
    formData.append('_wpcf7', '1510');
    formData.append('_wpcf7_unit_tag', 'wpcf7-f1510-p286-o2');
    formData.append('destination-email', destinationEmail || '');
    formData.append('your-name', senderName.trim());
    formData.append('your-email', senderEmail.trim().toLowerCase());
    formData.append('your-subject', SUBJECT);
    formData.append('your-message', message);
    formData.append('acceptance', acceptance.toString());

    // Kein Content-Type setzen: fetch ergänzt die multipart-Boundary selbst.
    const response = await fetchWithTimeout(URLs.DROP_OFF_FORM_URL, { method: 'POST', body: formData });
    if (!response.ok) {
      throw new Error(`Serverfehler (${response.status})`);
    }
    return (await response.json()) as { status: string; message: string };
  }

  async function handleSubmit() {
    if (isSending || !validateData()) {
      return;
    }
    setIsSending(true);
    try {
      const json = await sendData();
      if (json.status === 'mail_sent') {
        Alert.alert('Gesendet', 'Vielen Dank für deine Abmeldung.', [{ text: 'Ok', onPress: () => router.back() }], {
          cancelable: true,
          onDismiss: () => router.back(),
        });
      } else {
        Alert.alert('Senden fehlgeschlagen', `Nachricht: ${json.message}`);
      }
    } catch (error) {
      Alert.alert('Fehler beim Senden!', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={sharedStyles.container}>
        <Text style={[sharedStyles.title, { color: colors.text }]}>Abmeldung</Text>
        <Text style={[sharedStyles.subtitle, { color: colors.text }]}>
          für das nächste Programm der Stufe {stufe}
        </Text>
        <Text style={labelStyle}>Dein Name*</Text>
        <TextInput style={inputStyle} onChangeText={setSenderName} value={senderName} autoComplete="name" />
        <Text style={labelStyle}>Deine E-Mailadresse*</Text>
        <TextInput
          style={inputStyle}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          onChangeText={setSenderEmail}
          value={senderEmail}
        />
        <Text style={labelStyle}>Deine Nachricht</Text>
        <TextInput
          style={[inputStyle, styles.multiline]}
          onChangeText={setMessage}
          onBlur={Keyboard.dismiss}
          value={message}
          multiline
        />
        <Checkbox
          checked={acceptance}
          onToggle={() => setAcceptance(!acceptance)}
          label="Ich stimme der Datenverwendung für diese Nachricht zu"
        />
      </View>
      <View style={sharedStyles.buttonview}>
        <PrimaryButton title="Senden" onPress={handleSubmit} loading={isSending} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  input: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    fontSize: 18,
    paddingHorizontal: 20,
  },
  multiline: { height: 100, textAlignVertical: 'top', paddingTop: 8 },
});
