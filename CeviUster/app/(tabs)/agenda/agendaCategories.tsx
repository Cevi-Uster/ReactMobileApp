"use client";

import React, { useEffect } from "react";
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import {
	useState,
	useCallback,
	useRef,
	useLayoutEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
	FlatList,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	useColorScheme,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { decode } from "html-entities";
import moment from "moment";
import URLs from "../../../constants/URLs";

export default function AgendaScreen() {
	const param = ({
		// ID der agenda
		agendaId,
		// Name der Stufe für die Anzeige im Titel
		title,
	} = useLocalSearchParams<{ agendaId: string; title: string }>());

	const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;

	console.log("AgendaScreen ParentId: " + param.agendaId);

	const [currentParentId, setCurrentParentId] = useState(param.agendaId);

	if (currentParentId == undefined) {
		setCurrentParentId("0");
		console.log("AgendaScreen ParentId = 0");
	}
	console.log("AgendaScreen ParentId: " + param.agendaId);
	const navigation = useNavigation();

	// set title using useEffect
	useEffect(() => {
		if (!param.title) {
			navigation.setOptions({
				title: "Agenda",
			});
		} else {
			navigation.setOptions({
				title: param.title,
			});
		}
	}, [param.title, navigation]);

	return (
		<View style={styles.container}>
			<Categories categorieParentId={currentParentId} />
			<Events eventParentId={currentParentId} />
		</View>
	);
} // end of function component

function Categories({ categorieParentId }) {
	const [categories, setCategories] = useState([]);

	const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;

	console.log("Enter Categories: " + JSON.stringify(categorieParentId));
	if (categorieParentId == null) {
		categorieParentId = 0;
	}

  let uri: string = `${URLs.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`

	const {
		data: json,
		isError,
		isPending,
		isFetched,
	} = useQuery({
		queryKey: ["categorieParentId", { categorieParentId }],
		queryFn: async () => {
			const response = await fetch(uri);
			return await response.json();
		},
	});

	function onCategoryPressed(item) {
		console.log(
			"onCategoryPressed: selectedItem: " + item.id + ", " + item.name
		);
		router.push(
			"/agenda/agendaCategories?agendaId=" + item.id + "&title=" + item.name
		);
	}

	renderListItem = ({ item, index, separators }) => {
		// console.log('renderListItem: ' + JSON.stringify(item));
		if (typeof item.name !== "undefined") {
			console.log("render category");
			// Handle category
			return (
				<TouchableOpacity>
					<ListItem
						containerStyle={styles.item}
						bottomDivider
						onPress={() => onCategoryPressed(item)}
					>
						<Icon color={styles.icon.color} name={"folder"} />
						<ListItem.Content>
							<ListItem.Title style={styles.title}>
								{decode(item.name)}
							</ListItem.Title>
						</ListItem.Content>
						<ListItem.Chevron />
					</ListItem>
				</TouchableOpacity>
			);
		} else {
			console.log("render unknown item " + item);
		}
	};
	if (isFetched && !isError) {
		// console.log("categorie json: " + JSON.stringify(json));
		const filteredCategories = json.categories.filter(
			(category) => category.parent == categorieParentId
		);
		console.log(filteredCategories);
		console.log("filteredCategories = " + filteredCategories);

		if (filteredCategories != "") {
			return (
				<FlatList
					style={styles.container}
					data={filteredCategories}
					renderItem={renderListItem.bind(filteredCategories)}
					keyExtractor={(item, index) => "" + index}
				/>
			);
		}
	}
}

function Events({ eventParentId }) {
	const [events, setEvents] = useState([]);

	const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;

	console.log("Enter Events: " + eventParentId);

	const startDate = moment().format("YYYY-MM-DD 00:00:00");

	let uri: string = `${URLs.AGENDA_BASE_URL}events?start_date=${startDate}&categories=${eventParentId}&per_page=10000`;
	console.log(uri);

	console.log("Parent id: " + eventParentId);

	const {
		data: json,
		isError,
		isPending,
		isFetched,
	} = useQuery({
		queryKey: ["events", { eventParentId }],
		queryFn: async () => {
			const response = await fetch(uri);
			return await response.json();
		},
	});

	function onEventPressed(item) {
		console.log("onEventPressed: item: " + item.id);
		//this.props.navigation.navigate('AgendaEntry', {selectedEvent: item});
		router.push({
			pathname: "/agenda/[agendaEntry]",
			params: { agendaEntry: item.id },
		});
		//router.push('/agenda/[agendaEntry]/${item.id}');
	}

	renderListItem = ({ item, index, separators }) => {
		//console.log('renderListItem: ' + JSON.stringify(item));
		if (typeof item.title !== "undefined") {
			console.log("render event: " + item.title + " / " + item.id);
			// Handle event
			let dateText = `${item.start_date_details.day}.${item.start_date_details.month}.${item.start_date_details.year}`;
			let timeText = ``;
			if (!item.all_day) {
				timeText += `${item.start_date_details.hour}:${item.start_date_details.minutes}`;
				if (item.end_date_details.hour !== undefined) {
					timeText += ` - ${item.end_date_details.hour}:${item.end_date_details.minutes}`;
				}
			} else {
				timeText += `Ganzer Tag`;
			}
			let agendaEntryTitle = dateText + " " + item.title;
      console.log(timeText);
			return (
				<TouchableOpacity>
					<ListItem
						containerStyle={styles.item}
						bottomDivider
						onPress={() => onEventPressed(item)}
					>
						<ListItem.Content>
							<ListItem.Title style={styles.title}>
								{decode(agendaEntryTitle)}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.subtitle}>
								{decode(timeText)}
							</ListItem.Subtitle>
						</ListItem.Content>
						<ListItem.Chevron />
					</ListItem>
				</TouchableOpacity>
			);
		} else {
			console.log("render unknown item " + item);
		}
	};

	if (isFetched && !isError && json.events != undefined) {
		// console.log("fetchEvents: " + JSON.stringify(json));

		let filteredEvents = new Array(0);
		for (event of json.events) {
			for (category of event.categories) {
				if (category.id == eventParentId) {
					filteredEvents.push(event);
				}
			}
		}
		console.log("filteredEvents = " + filteredEvents);

		return (
			<FlatList
				style={styles.container}
				data={filteredEvents}
				renderItem={renderListItem.bind(filteredEvents)}
				//keyExtractor={(item, index) => ''+ index}
				//extraData={data}
			/>
		);
	}
}

const lightstyles = StyleSheet.create({
	container: {
		flex: 0,
		backgroundColor: "white",
	},
	item: {
		backgroundColor: "white",
		padding: 12,
		paddingBottom: 15,
		paddingTop: 15,
		marginVertical: 0,
		marginHorizontal: 0,
	},
	icon: {
		color: "black",
	},
	title: {
		fontSize: 16,
		color: "black",
		backgroundColor: "white",
	},
	subtitle: {
		fontSize: 14,
		color: "black",
    marginTop: 2,
	},
});

const darkstyles = StyleSheet.create({
	container: {
		flex: 0,
		backgroundColor: "black",
	},
	item: {
		backgroundColor: "black",
		padding: 12,
		paddingBottom: 15,
		paddingTop: 15,
		marginVertical: 0,
		marginHorizontal: 0,
	},
	icon: {
		color: "white",
	},
	title: {
		fontSize: 16,
		color: "white",
	},
	subtitle: {
		fontSize: 14,
		color: "white",
    marginTop: 2,
	},
});
