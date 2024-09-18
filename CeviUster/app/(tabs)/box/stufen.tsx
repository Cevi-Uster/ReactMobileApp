import React from 'react';
import { FlatList, StyleSheet,  Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { Avatar, List, ListItem, Icon} from 'react-native-elements';
import { router, useLocalSearchParams, Link } from 'expo-router';
import { decode } from 'html-entities';
import URLs from '../../../constants/URLs';

export default class Stufen extends React.Component {

  state = {
    stufen: [],
    currentParentStufenId: -1,
  };

  constructor(props) {
    super(props);
    this.onStufePressed = this.onStufePressed.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchStufen();
  }

  fetchStufen = async () => {
    const stufenResponse = await fetch(`${URLs.INFOBOX_BASE_URL}stufen/`, {
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
    router.push('/infobox?parentStufe=' + item.id + '&title=' + item.name); //this.props.navigation.navigate('InfoBox', { parentStufe: item, title: item.name });
    //this.props.navigation.navigate('InfoBox', { parentStufe: item, title: item.name });
  }
  
  renderListItem = ({ item, index, separators }) => {
    if (typeof item.name !== 'undefined') {
      return (<TouchableOpacity>
        <ListItem 
          bottomDivider
          onPress={ () => this.onStufePressed(item)}>
          <Avatar source={require('../../../assets/images/Home_Icon.png')} />
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
      <View style={styles.container}>
        <FlatList
          data={this.state.stufen}
          renderItem={this.renderListItem.bind(this)}
          keyExtractor={(item, index) => ''+ index}
          extraData={this.state}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});