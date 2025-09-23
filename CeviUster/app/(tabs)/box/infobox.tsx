import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  useColorScheme,
} from "react-native";
import { Button } from "react-native-elements";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { COLOR_PRIMARY, BORDER_RADIUS } from "../../../constants/Colors";
import { Info } from "../../../services/info";
import getInfo from "../../../services/getInfo";
import { sharedStyles } from '../../../constants/sharedStyles';

const baseStyles = StyleSheet.create({
  ...sharedStyles,
  header: {
    fontSize: 16,
    fontWeight: "bold",
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
  dropOutButton: {
    marginTop: 10,
  },
});

const lightstyles = StyleSheet.create({
  ...baseStyles,
  title: {
    ...sharedStyles.title,
    color: "black",
  },
  header: {
    ...baseStyles.header,
    color: "black",
  },
  ort: {
    ...baseStyles.ort,
    color: "black",
  },
  info: {
    ...baseStyles.info,
    color: "black",
  },
  mitnehmen: {
    ...baseStyles.mitnehmen,
    color: "black",
  },
});

const darkstyles = StyleSheet.create({
  ...baseStyles,
  title: {
    ...sharedStyles.title,
    color: "white",
  },
  header: {
    ...baseStyles.header,
    color: "white",
  },
  ort: {
    ...baseStyles.ort,
    color: "white",
  },
  info: {
    ...baseStyles.info,
    color: "white",
  },
  mitnehmen: {
    ...baseStyles.mitnehmen,
    color: "white",
  },
});

export default function InfoBox() {
  const { parentStufe, title } = useLocalSearchParams<{
    parentStufe: string;
    title: string;
  }>();

  const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;
  const [info, setInfo] = useState<Info | null>(null);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [navigation, title]);

  useEffect(() => {
    if (parentStufe && title) {
      getInfo(parentStufe, title).then((res) => {
        setInfo(res as Info); // Cast `res` to `Info` to resolve type error
      });
    }
  }, [parentStufe, title]);

  if (!info) return null;

  let dateTime = "";
  if (info.von instanceof Date) {
    const fromDay = ("0" + info.von.getDate()).slice(-2);
    const fromMonth = ("0" + (info.von.getMonth() + 1)).slice(-2);
    const fromHours = ("0" + info.von.getHours()).slice(-2);
    const fromMinutes = ("0" + info.von.getMinutes()).slice(-2);
    dateTime = `${fromDay}.${fromMonth}.${info.von.getFullYear()} ${fromHours}:${fromMinutes}`;
  }

  if (info.bis instanceof Date) {
    const toHours = ("0" + info.bis.getHours()).slice(-2);
    const toMinutes = ("0" + info.bis.getMinutes()).slice(-2);
    dateTime = `${dateTime} - ${toHours}:${toMinutes}`;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={require("../../../assets/images/CeviLogoTransparent.png")}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{info.stufe}</Text>
          {info.aktuell && (
            <>
              <Text style={styles.header}>{"\n"}Treffpunkt:</Text>
              <Text style={styles.date}>{dateTime}</Text>
              <Text style={styles.ort}>{info.wo}</Text>
              <Text style={styles.header}>{"\n"}Infos:</Text>
              <Text style={styles.info}>{info.infos}</Text>
              <Text style={styles.header}>{"\n"}Mitnehmen:</Text>
              <Text style={styles.mitnehmen}>{info.mitnehmen}</Text>
              <View style={styles.buttonview}>
                <Button
                  style={styles.dropOutButton}
                  onPress={() => dropOutButtonClicked(info)}
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
            </>
          )}
          {!info.aktuell && (
            <>
              <Text style={styles.header}>{"\n"}Infos:</Text>
              <Text style={styles.info}>{info.infos}</Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function dropOutButtonClicked(info: Info) {
  router.push({
    pathname: `/box/dropout`,
    params: {
      ...info,
      aktuell: info.aktuell.toString(), // Convert boolean to string
      von: info.von ? info.von.toISOString() : undefined, // Format Date to ISO string
      bis: info.bis ? info.bis.toISOString() : undefined, // Format Date to ISO string
    },
  });
}
