import { StyleSheet } from 'react-native';

const sharedStyles = StyleSheet.create({
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
    fontWeight: 'bold',
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0097fe',
  },
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  venue: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
  },
  image: {
    marginTop: 5,
  },
  savebutton: {
    marginTop: 10,
  },
  tableContainer: {
    flex: 0,
  },
  tableItem: {
    padding: 12,
    paddingBottom: 15,
    paddingTop: 15,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  listItemTitle: {
    fontSize: 16,
    marginTop: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  item: {
    padding: 12,
    paddingBottom: 15,
    paddingTop: 15,
    marginVertical: 0,
    marginHorizontal: 0,
  },
});

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  tableContainer: {
    ...sharedStyles.tableContainer,
    backgroundColor: "white",
  },
  tableItem: {
    ...sharedStyles.tableItem,
    backgroundColor: "white",
  },
  icon: {
    color: "black",
  },
  listItemTitle: {
    ...sharedStyles.listItemTitle,
    color: "black",
  },
  listItemSubtitle: {
    ...sharedStyles.listItemSubtitle,
    color: "black",
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  tableContainer: {
    ...sharedStyles.tableContainer,
    backgroundColor: "black",
  },
  tableItem: {
    ...sharedStyles.tableItem,
    backgroundColor: "black",
  },
  icon: {
    color: "white",
  },
  listItemTitle: {
    ...sharedStyles.listItemTitle,
    color: "white",
  },
  listItemSubtitle: {
    ...sharedStyles.listItemSubtitle,
    color: "white",
  },
});

export { sharedStyles, lightStyles, darkStyles };