import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {url} from '../url';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import jwtDecode from 'jwt-decode';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Chart = () => {
  const [Bookings, setBookings] = useState([]);
  const [Current, setCurrent] = useState({fcmtoken: []});
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getBookings();
  }, []);

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const getBookings = async () => {
    try {
      let BookingsData = await axios.get(`${url}/api/booking`);
      setBookings(BookingsData.data.BookingList);
    } catch (error) {
      console.log(error);
    }
  };
  const getToken = async user => {
    try {
      const fcmtoken = await messaging().getToken();
      console.log(user);
      let isSaved = user && user.fcmtoken.includes(fcmtoken);
      console.log(isSaved);
      if (!isSaved) {
        await updateUserFCMToken(fcmtoken);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
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
    requestUserPermission();
    retrieveNotificationData();
    getCurrentUser();
    console.log(data.datasets);
  }, []);
  useEffect(() => {
    retrieveNotificationData();
  }, [notifications]);

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentId = jwtDecode(token).id;

    try {
      let currentUser = await axios.get(`${url}/api/user/${currentId}`);
      setCurrent(currentUser.data.user);
      await getToken(currentUser.data.user);
    } catch (error) {
      console.log('curr', error);
    }
  };
  const updateUserFCMToken = async token => {
    try {
      await axios.put(`${url}/api/user/${Current._id}`, {
        ...Current,
        fcmtoken: [...Current.fcmtoken, token],
      });
      await getCurrentUser();
    } catch (error) {
      console.log('update', error);
    }
  };
  function getLast6Months() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    let currentDate = new Date();
    let monthsArray = [];

    for (let i = 0; i < 6; i++) {
      monthsArray.unshift(months[currentDate.getMonth()]);
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return monthsArray;
  }

  function countLast6MonthsOccurrences(dateArray) {
    const monthCounts = {};
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const month = currentDate.toLocaleString('default', {month: 'short'});

      monthCounts[month] = 0;
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    for (const dateStr of dateArray) {
      const month = new Date(dateStr).toLocaleString('default', {
        month: 'short',
      });
      if (monthCounts.hasOwnProperty(month)) {
        monthCounts[month]++;
      }
    }

    const lastSixMonths = getLast6Months().reverse();
    const resultArray = lastSixMonths.map(e => monthCounts[e]);

    // Sort the resultArray based on the order of lastSixMonths

    return resultArray;
  }

  const data = {
    labels: getLast6Months(),
    datasets: [
      {
        data: countLast6MonthsOccurrences(Bookings.map(e => e.date))
          .slice(0, 6)
          .reverse(),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    barPercentage: 0.6,
    height: 5000,
    fillShadowGradient: `#5AC2E3`,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
    labelColor: (opacity = 1) => `#383E44`,
    propsForBackgroundLines: {
      strokeWidth: 2,
      stroke: '#fff',
      strokeDasharray: '',
    },
  };

  return (
    <ScrollView style={{backgroundColor: '#fafafa'}}>
      <LinearGradient
        colors={['#0094B4', '#00D9F7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header, {backgroundColor: '#28B0DB'}]}
        // colors={['#3C84AC', '#5AC2E3', '#3C84AC']}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
            removeToken();
          }}
          style={styles.logoOutButton}>
          <Image
            style={styles.logoutImage}
            source={require('../assets/icons/logOutIcon.png')}
          />
        </TouchableOpacity>
        <Text style={styles.welcome}>Welcome, Lucky Boy !</Text>
      </LinearGradient>
      <View style={styles.body}>
        <Text style={styles.SubTitle}>Reservations stats</Text>
        <View style={styles.chart}>
          <BarChart
            data={data}
            fromZero={true}
            showBarTops={false}
            xLabelsOffset={10}
            yLabelsOffset={20}
            showValuesOnTopOfBars={true}
            withInnerLines={false}
            segments={2}
            width={screenWidth * 0.8}
            height={screenHeight * 0.35}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={{
              flex: 1,
              borderRadius: 10,
              padding: 10,
              paddingLeft: 0,
              alignSelf: 'center',
              borderWidth: 3,
              borderColor: 'rgba(56, 62, 68, 0.49)',
              backgroundColor: '#fff',
            }}
          />
        </View>
        <Text style={styles.SubTitle}>Check recent requests </Text>
        <View style={styles.activityContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Services')}>
            <LinearGradient
              colors={['#0094B4', '#00D9F7']}
              start={{x: 1, y: 0}}
              end={{x: 1, y: 1}}
              style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
              <Image
                style={styles.activityIcon}
                source={require('../assets/icons/PayIcon.png')}
              />
              <Text style={styles.activityText}>Services</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Reservation-Stat')}>
            <LinearGradient
              colors={['#0094B4', '#00D9F7']}
              start={{x: 1, y: 0}}
              end={{x: 1.1, y: 1}}
              style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
              <Image
                style={styles.activityIcon}
                source={require('../assets/icons/reservationIcon.png')}
              />
              <Text style={styles.activityText}>Reservation</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
            <LinearGradient
              colors={['#0094B4', '#00D9F7']}
              start={{x: 1, y: 0}}
              end={{x: 1.1, y: 1}}
              style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
              <Image
                style={styles.activityIcon}
                source={require('../assets/icons/BlogIcon.png')}
              />
              <Text style={styles.activityText}>Blogs</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Store')}>
            <LinearGradient
              colors={['#0094B4', '#00D9F7']}
              start={{x: 1, y: 0}}
              end={{x: 1.1, y: 1}}
              style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
              <Image
                style={styles.activityIcon}
                source={require('../assets/icons/CarteIcon.png')}
              />
              <Text style={styles.activityText}>Purchased</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Chart;

const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    height: screenHeight * 0.35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  welcome: {
    fontFamily: 'OriginalSurfer-Regular',
    fontSize: 30,
    color: '#fff',
    textShadowColor: 'rgba(56, 62, 68, 0.60)',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 1,
    alignSelf: 'center',
    marginBottom: 0,
  },
  body: {
    backgroundColor: '#fafafa',
    borderRadius: 60,
    top: screenHeight * -0.1,
    width: screenWidth,
    paddingTop: 40,
    marginBottom: 10,
  },
  chart: {
    width: screenWidth,
    paddingVertical: 25,
  },
  SubTitle: {
    fontSize: 32,
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontFamily: 'Poppins-Regular',

    color: '#383E44',
    textShadowColor: 'rgba(56, 62, 68, 0.50)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  activityContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    height: '8%',
    justifyContent: 'space-evenly',
  },
  activityItem: {
    width: 155,
    height: 75,
    backgroundColor: '#A2D9FF',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
  },
  activityIcon: {},
  activityText: {
    fontSize: 18,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#fff',
    marginLeft: -8,
  },
  logoOutButton: {
    position: 'absolute',
    top: screenHeight * 0.05,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutImage: {
    width: 30,
    resizeMode: 'contain',
  },
});
