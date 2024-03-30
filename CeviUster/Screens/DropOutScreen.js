import React from "react";
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
import { CheckBox } from "react-native-elements";
import {
	COLOR_PRIMARY,
	COLOR_SECONDARY,
	BORDER_RADIUS,
} from "../styles/common.js";
import { Button } from "react-native-elements";
import AlertAsync from "react-native-alert-async";
import { decode } from "html-entities";
import GLOBALS from "../Global";

export default class DropOutScreen extends React.Component {
	state = {
        isLoading: false,
		stufe: null,
		destinationEmail: null,
		your_name: null,
		your_email: null,
		your_subject: 'ich möchte mich für das nächste Programm abmelden',
		your_message: null,
		acceptance: false,
	};

	constructor(props) {
		super(props);
		console.log("DropOutScreen constructor");
		console.log(props);
		if (this.props.route.params && this.props.route.params.parentStufe) {
			console.log("Setting stufe and destinationEmail");
			this.state.stufe = this.props.route.params.parentStufe;
			this.state.destinationEmail = this.props.route.params.destinationEmail;
		}
		this.props.navigation.setOptions({ title: "Abmeldung" });
	}

	renderContent = () => {
		return (
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.title}>Abmeldung</Text>
					<Text style={styles.subtitle}>
						für das nächste Programm der Stufe {decode(this.state.stufe.name)}
					</Text>
					<Text style={styles.text}>Dein Name*</Text>
					<TextInput
						style={styles.text_input}
						onChangeText={(your_name) =>
							this.setState({ your_name: your_name })
						}
						onBlur={Keyboard.dismiss}
						value={this.state.your_name}
					/>
					<Text style={styles.text}>Deine E-Mailadresse*</Text>
					<TextInput
						style={styles.text_input}
						keyboardType="email-address"
						onChangeText={(your_email) =>
							this.setState({ your_email: your_email })
						}
						value={this.state.your_email}
						autoCorrect={false}
					/>
					<Text style={styles.text}>Deine Nachricht</Text>
					<TextInput
						style={styles.multiline_text_input}
						onChangeText={(your_message) =>
							this.setState({ your_message: your_message })
						}
						onBlur={Keyboard.dismiss}
						value={this.state.your_message}
						multiline={true}
					/>
					<CheckBox
						checked={this.state.acceptance}
						onPress={() =>
							this.setState({ acceptance: !this.state.acceptance })
						}
						title="Ich stimme der Datenverwendung für diese Nachricht zu"
					/>
				</View>
				<View style={styles.buttonView}>
					<Button
						style={styles.sendButton}
						onPress={() => {
							this.handleSubmit();
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
				{this.state.isLoading && (<ActivityIndicator size="large"	color={COLOR_PRIMARY} style={styles.waitOverlay}/>)}
			</ScrollView>
		);
	};

	render() {
		if (Platform.OS === "ios") {
			return (
				<KeyboardAvoidingView
					style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
					behavior="padding"
					enabled
					keyboardVerticalOffset={100}
				>
                    {this.renderContent()}
				</KeyboardAvoidingView>
			);
		} else {
			return (
				<KeyboardAvoidingView>
                    {this.renderContent()}
                </KeyboardAvoidingView>
			);
		}
	}

	handleSubmit(values) {
		if (this.validateData()) {
			this.sendData();
		}
	}

	validateData() {
		if (!this.state.your_name) {
			Alert.alert("Bitte gibt deinen Namen ein. ");
			return false;
		} else if (!this.state.your_email) {
			Alert.alert("Bitte gibt deine E-Mailadresse ein.");
			return false;
		}
		if (!this.state.acceptance) {
			Alert.alert("Bitte stimme der Datenverwendung zu.");
			return false;
		}
		return true;
	}

	sendData() {
		let formData = new FormData();
		formData.append("_wpcf7", "1510");
		formData.append("_wpcf7_unit_tag", "wpcf7-f1510-p286-o2");
	    formData.append('destination-email', this.state.destinationEmail);
		//formData.append("destination-email", "marc@mabaka.ch");
		formData.append("your-name", this.state.your_name);
		formData.append("your-email", this.state.your_email.toLowerCase());
		formData.append("your-subject", this.state.your_subject);
		formData.append("your-message", this.state.your_message);
		formData.append("acceptance", this.state.acceptance);

		const url = `${GLOBALS.DROP_OFF_FORM_URL}`;
		console.log("FormData: " + JSON.stringify(formData, null, 4));
        this.setState({ isLoading: true });
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			body: formData,
		})
			.then((response) => response.json())
			.then((json) => {
                this.setState({ isLoading: false });
				this.handleSuccess(json);
			})
			.catch((error) => {
                this.setState({ isLoading: false });
				console.error(error);
				Alert.alert("Fehler beim Senden!", error);
			});
	}

	handleSuccess(json) {
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
                    this.props.navigation.goBack();
                }
            }
			
		};
		showSuccessMessageAndGoBack();
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
        textAlgin: 'center',
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
