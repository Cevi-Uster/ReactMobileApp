import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {listCalendars} from '../services/agenda/localCalendarService';

function LocalCalendarModalComponent({
  isVisible = false,
  closeModal = () => {},
  handleCalendarSelected = () => {},
  label = 'Select a calendar',
  modalTestID = 'localCalendarModal',
}) {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    const loadCalendars = async () => {
      const calendarsTmp = await listCalendars();
      setCalendars(calendarsTmp);
    };
    if (isVisible) {
      loadCalendars();
    }
  }, [isVisible]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
      animationType="slide">
      <TouchableWithoutFeedback
        accessible={false}
        onPress={closeModal}
        style={styles.container}>
        <View style={styles.backdrop}>
          <View style={styles.agendaModalBody}>
            <Text style={styles.title}>{label} :</Text>
            <View style={styles.agendaList}>
              <ScrollView>
                {calendars.map((calendar, i) =>
                  calendar.allowsModifications ? (
                    <View key={i} style={styles.agendaListEntry}>
                      <View style={[
                          styles.circle,
                          {backgroundColor: calendar.color},
                        ]}/>
                      <TouchableOpacity
                        onPress={() => handleCalendarSelected(calendar)}
                        style={[
                          styles.calendarOption
                        ]}>
                        <Text key={i} style={[styles.defaultText]}>
                          {calendar.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null,
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  agendaModalBody: {
    flexShrink: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  agendaList: {
    marginTop: 10,
  },
  calendarOption: {
    padding: 10,
  },
  agendaListEntry: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',

  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
  },
});

export default LocalCalendarModalComponent;