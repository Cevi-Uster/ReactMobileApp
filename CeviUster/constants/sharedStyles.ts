import { StyleSheet } from 'react-native';
import { Colors, ThemeColors } from './Colors';

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
  subtitle: {
    fontSize: 20,
  },
  text: {
    paddingTop: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
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
    flex: 1,
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
  avatar: {
  },
});

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    ...sharedStyles,
    tableContainer: { ...sharedStyles.tableContainer, backgroundColor: colors.background },
    tableItem: { ...sharedStyles.tableItem, backgroundColor: colors.background },
    title: { ...sharedStyles.title, color: colors.text },
    subtitle: { ...sharedStyles.subtitle, color: colors.text },
    text: { ...sharedStyles.text, color: colors.text },
    date: { ...sharedStyles.date, color: colors.accent },
    venue: { ...sharedStyles.venue, color: colors.text },
    description: { ...sharedStyles.description, color: colors.text },
    listItemTitle: { ...sharedStyles.listItemTitle, color: colors.text },
    listItemSubtitle: { ...sharedStyles.listItemSubtitle, color: colors.subtle },
    avatar: { ...sharedStyles.avatar, tintColor: colors.text },
  });
}

const lightStyles = createStyles(Colors.light);
const darkStyles = createStyles(Colors.dark);

export { sharedStyles, lightStyles, darkStyles };
