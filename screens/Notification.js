import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const retrieveNotificationData = async () => {
    try {
      const notificationData = await AsyncStorage.getItem('notifs');
      if (notificationData !== null) {
        setNotifications(JSON.parse(notificationData));
        // Process the notification data as needed
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(
        'Error retrieving notification data from AsyncStorage:',
        error,
      );
    }
  };
  useEffect(() => {
    retrieveNotificationData();
  }, [Notification]);

  return (
    <View style={styles.notifbox}>
      <View style={styles.notifHeader}>
        <Text style={styles.notifHeaderTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.close}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="close" size={25} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {notifications.map((item, index) => (
          <View key={index} style={styles.notifitem}>
            <Text style={styles.notiftitle}>{item.title}</Text>
            <Text style={styles.notifbody}>{item.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notification;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  notifbox: {
    position: 'absolute',
    paddingBottom: 20,
    width: windowWidth,
    backgroundColor: '#fff',
    zIndex: 10000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 40,
    maxHeight: windowHeight,
    minHeight: windowHeight,
  },
  close: {marginRight: 10},
  notifitem: {
    marginBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    height: windowHeight * 0.1,
    width: '100%',
  },

  notifHeaderTitle: {
    fontSize: 23,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    alignSelf: 'center',
  },
  notiftitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notifbody: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
