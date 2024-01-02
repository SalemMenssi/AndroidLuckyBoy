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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Chart = () => {
  const [Bookings, setBookings] = useState([]);
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

  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const lastSixMonthsBookings = Bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const bookingYear = bookingDate.getUTCFullYear();
    const bookingMonth = bookingDate.getUTCMonth();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth();
    const sixMonthsAgoYear = sixMonthsAgo.getUTCFullYear();
    const sixMonthsAgoMonth = sixMonthsAgo.getUTCMonth();

    return (
      (bookingYear > sixMonthsAgoYear ||
        (bookingYear === sixMonthsAgoYear &&
          bookingMonth >= sixMonthsAgoMonth)) &&
      (bookingYear < currentYear ||
        (bookingYear === currentYear && bookingMonth <= currentMonth))
    );
  });

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

  const monthReservations = new Array(12).fill(0);

  lastSixMonthsBookings.forEach(booking => {
    const monthIndex = new Date(booking.date).getMonth();
    monthReservations[monthIndex]++;
  });

  const data = {
    labels: months.slice(
      currentDate.getMonth() - 5,
      currentDate.getMonth() + 1,
    ),
    datasets: [
      {
        data: monthReservations.slice(
          currentDate.getMonth() - 5,
          currentDate.getMonth() + 1,
        ),
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
      <View
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
      </View>
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
          <TouchableOpacity
            // colors={['#3C84AC', '#5AC2E3']}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/PayIcon.png')}
            />
            <Text style={styles.activityText}>Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // colors={['#3C84AC', '#5AC2E3']}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/reservationIcon.png')}
            />
            <Text style={styles.activityText}>Reservation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <TouchableOpacity
            // colors={['#3C84AC', '#5AC2E3']}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/BlogIcon.png')}
            />
            <Text style={styles.activityText}>Blogs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // colors={['#3C84AC', '#5AC2E3']}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/CarteIcon.png')}
            />
            <Text style={styles.activityText}>Purchased</Text>
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
    height: screenHeight * 0.3,
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
    marginBottom: 40,
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
    fontFamily: 'OriginalSurfer-Regular',
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
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
