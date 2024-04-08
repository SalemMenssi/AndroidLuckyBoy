import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';
import RadialGradient from 'react-native-radial-gradient';
import axios from 'axios';
import {url} from '../../url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import LinearGradient from 'react-native-linear-gradient';

const DatePickerCostum = props => {
  const [date, setDate] = useState(new Date());

  return (
    <DatePicker
      textColor="#000"
      mode="time"
      date={props.selectedTime}
      onDateChange={props.setSelectedTime}
      style={{backgroundColor: '#fff', borderRadius: 10, padding: 10}} // Add your custom styles here
    />
  );
};

const HomeReservation = ({card, close, closeParent}) => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [Current, setCurrent] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getCurrentUser();
    getAllUsers();
    console.log('users:', users);
  }, []);

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentId = jwtDecode(token).id;

    try {
      let currentUser = await axios.get(`${url}/api/user/${currentId}`);
      setCurrent(currentUser.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllUsers = async () => {
    try {
      let resualt = await axios.get(`${url}/api/user/`);
      console.log(resualt.data.userList);
      setUsers(resualt.data.userList);
    } catch (error) {
      console.log(error);
    }
  };

  const sendNotification = async (deviceToken, title, body) => {
    try {
      await axios.post(`${url}/send-notification`, {deviceToken, title, body});
    } catch (error) {
      console.log('notif', error);
    }
  };
  const addBooking = async () => {
    try {
      let NewBooking = {
        client: Current,
        service: card,
        people: numberOfPeople,
        time: selectedTime.toLocaleTimeString(),
        date: selectedDate,
      };
      const admins = users.filter(e => e.isAdmin == true);
      admins.map(e => {
        console.log(e);
        const deviceToken = e.fcmtoken[e.fcmtoken.length - 1];
        sendNotification(
          deviceToken,
          'New Reservation',
          `You Recived a New Reservation`,
        );
      });
      await axios.post(`${url}/api/booking`, NewBooking);
      console.log(NewBooking);
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    console.log('showPicker updated:', selectedTime);
  }, [selectedTime]);

  const incrementNumberOfPeople = () => {
    setNumberOfPeople(prevValue => prevValue + 1);
  };

  const decrementNumberOfPeople = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople(prevValue => prevValue - 1);
    }
  };

  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#fff',
    },
  };

  const Sabmit = () => {
    addBooking();
    close();
    navigation.navigate('Reserve');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <TouchableOpacity onPress={close} style={styles.returnBtn}>
          <Image
            style={styles.arrowIcon}
            source={require('../../assets/icons/fleche.png')}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Reservation</Text>
        <Text style={styles.subtitle}>Select a date</Text>
        <View style={styles.calendarBox}>
          <LinearGradient
            colors={['#0094B4', '#00Daf8']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.gradient]}
            // colors={['#3C84AC', '#5AC2E3', '#3C84AC']}
          >
            <Calendar
              showSixWeeks={true}
              onDayPress={handleDateSelect}
              style={styles.calendar}
              firstDay={1}
              headerStyle={{}}
              theme={{
                calendarBackground: 'transparent',
                monthTextColor: '#fff',
                todayTextColor: '#fff',
                textDisabledColor: 'rgba(255, 255, 255, 0.28)',
                dayTextColor: '#fff',
                textDayFontWeight: '500',
                textSectionTitleColor: '#fff',
                textMonthFontWeight: 'bold',
                textMonthFontSize: 20,
                arrowColor: '#fff',
                selectedDayTextColor: '#000',
              }}
              markedDates={markedDates}
            />
          </LinearGradient>
        </View>

        <Text style={styles.subtitle}>Select Time</Text>

        {/* {showPicker && (
          <DateTimePicker
            value={selectedTime}
            mode={'time'}
            is24Hour={true}
            display="spinner"
            testID="dateTimePicker"
            onChange={handleTimeChange}
            themeVariant="dark"
          />
        )} */}
        <DatePickerCostum
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <Text style={styles.subtitle}>Number of People </Text>
        <View style={styles.numberPicker}>
          <TouchableOpacity
            onPress={decrementNumberOfPeople}
            style={[
              styles.button,
              {
                borderRadius: 50,
                borderWidth: 2,
                borderColor: '#5ac2e3',
                backgroundColor: '#fff',
                color: '#5ac2e3',
              },
            ]}>
            <Text style={[styles.buttonText, {color: '#5ac2e3'}]}>-</Text>
          </TouchableOpacity>
          <Text style={styles.numberOfPeople}>{numberOfPeople}</Text>
          <TouchableOpacity
            onPress={incrementNumberOfPeople}
            style={[
              styles.button,
              {
                borderRadius: 50,
                borderWidth: 2,
                borderColor: '#5ac2e3',
                backgroundColor: '#fff',
                color: '#5ac2e3',
              },
            ]}>
            <Text style={[styles.buttonText, {color: '#5ac2e3'}]}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.reserveButton} onPress={Sabmit}>
          <LinearGradient
            colors={['#0094B4', '#00DaF8']}
            start={{x: 0, y: 0}}
            end={{x: 0.9, y: 0.9}}
            style={[styles.RadialEffect, {backgroundColor: '#5ac2e3'}]}
            //colors={['#5AC2E3', '#4698BD', '#3C84AC']}
          >
            <Text style={styles.buttonText}>Reserve</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeReservation;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  returnBtn: {position: 'absolute', left: 0},
  arrowIcon: {
    marginTop: 50,
    marginLeft: 15,
    width: 40,
    resizeMode: 'contain',
    tintColor: '#383e44',
  },
  title: {
    marginTop: windowHeight * 0.045,
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '500',
    color: '#383e44',
  },
  subtitle: {
    color: '#5ac2e3',
    fontSize: 24,

    fontFamily: 'Poppins-Medium',
    marginVertical: windowHeight * 0.03,
  },
  calendar: {
    width: '85%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  timePickerButton: {
    alignItems: 'center',
  },
  selectedTimeText: {
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3C84AC',
    color: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    fontSize: 24,
  },
  reserveButton: {
    borderRadius: 15,
    width: '40%',
    height: windowHeight * 0.06,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
    marginVertical: windowHeight * 0.05,
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 42,
    color: '#fff',
    fontFamily: 'OriginalSurfer-Regular',
  },
  numberPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    width: 35,
    height: 35,

    backgroundColor: '#3C85AD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    top: -1,
  },
  numberOfPeople: {
    fontSize: 24,
    paddingHorizontal: 30,
    color: '#0A0A0A',
    backgroundColor: '#fff',
  },
  calendarBox: {
    height: windowHeight * 0.37,
    width: windowWidth * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    height: '100%',
    width: '100%',
  },
});
