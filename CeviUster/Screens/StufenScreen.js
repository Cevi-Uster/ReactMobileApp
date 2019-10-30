import React from 'react';
import { Image, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { List, ListItem } from 'react-native-elements';

export default class StufenScreen extends React.Component {

  state = {
    stufen: [],
    currentParentStufenId: -1,
  };

  static navigationOptions = ({ navigation }) => ({
    title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'find' : navigation.state.params.title,
  });


  constructor(props) {
    super(props);
    //console.log(props);
    if (this.props.navigation.state.params && this.props.navigation.state.params.parentStufe) {
      this.state.currentParentStufenId = this.props.navigation.state.params.parentStufe.id;
      this.props.navigation.setParams({ title: this.props.navigation.state.params.parentStufe.name });
    } else {
      this.props.navigation.setParams({ title: "Chäschtli" });
    }
    this.onStufePressed = this.onStufePressed.bind(this);
  }


  componentWillMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchStufen();
  }

  fetchStufen = async () => {
    const stufenResponse = await fetch(`${Config.INFOBOX_BASE_URL}stufen/`);
    const json = await stufenResponse.json();
    if (json !== undefined && json !== null && json.length > 0) {
      this.setState({ stufen: json });
    } else {
      this.setState({ stufen: new Array(0) });
    }
  }

  onStufePressed(item) {
    console.log(item);
    this.props.navigation.navigate('InfoBox', { parentStufe: item, title: item.name });
  }

  render() {
    var styles = StyleSheet.create({
      PNGImageStyle: {
        width: 25,
        height: 25,
        marginRight: 20
      }
    });
    return (
      <View>
        <List
          containerStyle={{
            marginTop: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0
          }}
        >
          <SectionList
            sections={[
              {
                title: "Stufen",
                data: this.state.stufen,
                keyExtractor: (x, i) => i,
                renderItem: ({ item }) => (
                  <TouchableOpacity>
                    <ListItem
                      title={`${item.name}`}
                      onPress={() => this.onStufePressed(item)}
                      //leftIcon={<Icon name="ios-bonfire" color="#ccc" size={30} />}
                      leftIcon={
                        <Image
                          source={require("../Ressources/Home_Icon.png")}
                          style={[styles.PNGImageStyle]}
                        />
                      }
                    //pad={`200`}
                    />
                  </TouchableOpacity>
                )
              }
            ]}
          />
        </List>
      </View>
    );
  }
}
