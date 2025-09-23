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
import { Info } from "../../types/info";
import getInfo from "../../service/getInfo";

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
        setInfo(res);
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
  router.push({ pathname: `/box/dropout`, params: info });
}

const lightstyles = StyleSheet.create({
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
    color: "black",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#0097fe",
  },
  ort: {
    marginTop: 5,
    fontSize: 14,
    color: "black",
  },
  info: {
    marginTop: 5,
    fontSize: 14,
    color: "black",
  },
  mitnehmen: {
    marginTop: 5,
    fontSize: 14,
    color: "black",
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

const darkstyles = StyleSheet.create({
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
    color: "white",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#0097fe",
  },
  ort: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
  },
  info: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
  },
  mitnehmen: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
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
