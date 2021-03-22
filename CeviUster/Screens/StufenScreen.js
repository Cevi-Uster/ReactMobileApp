import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { Avatar, List, ListItem, Icon} from 'react-native-elements';
import { decode } from 'html-entities';
import GLOBALS from '../Global';

export default class StufenScreen extends React.Component {

  state = {
    stufen: [],
    currentParentStufenId: -1,
  };

  constructor(props) {
    super(props);
    //console.log(props);
    if (this.props.route.params && this.props.route.params.parentStufe) {
      this.state.currentParentStufenId = this.props.route.params.parentStufe.id;
      this.props.navigation.setOptions({ title: this.props.route.params.parentStufe.name });
    } else {
      this.props.navigation.setOptions({ title: "Chäschtli" });
    }
    this.onStufePressed = this.onStufePressed.bind(this);
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchStufen();
  }

  fetchStufen = async () => {
    const stufenResponse = await fetch(`${GLOBALS.INFOBOX_BASE_URL}stufen/`, {
        headers: {
          Accept: "application/json"
        }
    } );
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
  renderListItem = ({ item, index, separators }) => {
    if (typeof item.name !== 'undefined') {
      return (<TouchableOpacity>
        <ListItem 
          bottomDivider
          onPress={ () => this.onStufePressed(item)}>
          <Avatar source={require('../Ressources/Home_Icon.png')} />
          <ListItem.Content>
            <ListItem.Title>{decode(item.name)}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>)
    }
    return null;
  }

  render() {
    console.log('render stufen = ' + this.state.stufen);
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.stufen}
          renderItem={this.renderListItem.bind(this)}
          keyExtractor={(item, index) => ''+ index}
          extraData={this.state}
        />
      </SafeAreaView>
    )
  }

  /*
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
  */
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});