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

const DatePickerCostum = props => {
  const [date, setDate] = useState(new Date());

  return (
    <DatePicker
      textColor="#fff"
      mode="time"
      date={props.selectedTime}
      onDateChange={props.setSelectedTime}
      style={{backgroundColor: '#3C84AC', borderRadius: 10, padding: 10}} // Add your custom styles here
    />
  );
};

const HomeReservation = ({card, close}) => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [Current, setCurrent] = useState({});

  useEffect(() => {
    getCurrentUser();
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

  const addBooking = async () => {
    try {
      let NewBooking = {
        client: Current,
        service: card,
        people: numberOfPeople,
        time: selectedTime.toLocaleTimeString(),
        date: selectedDate,
      };
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

    navigation.navigate('Reserve');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.returnBtn}>
          <Image
            style={styles.arrowIcon}
            source={require('../../assets/icons/fleche.png')}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Reservation</Text>
        <Text style={styles.subtitle}>Select a date</Text>
        <View style={styles.calendarBox}>
          <View
            style={[styles.gradient, {backgroundColor: '#3C84AC'}]}
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
                textSectionTitleColor: '#fff',
                textMonthFontWeight: 'bold',
                textMonthFontSize: 20,
                arrowColor: '#fff',
                selectedDayTextColor: '#000',
              }}
              markedDates={markedDates}
            />
          </View>
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
              {borderTopLeftRadius: 10, borderBottomLeftRadius: 10},
            ]}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.numberOfPeople}>{numberOfPeople}</Text>
          <TouchableOpacity
            onPress={incrementNumberOfPeople}
            style={[
              styles.button,
              {borderTopRightRadius: 10, borderBottomRightRadius: 10},
            ]}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.reserveButton} onPress={Sabmit}>
          <RadialGradient
            style={styles.RadialEffect}
            colors={['#5AC2E3', '#4698BD', '#3C84AC']}
            stops={[0.2, 0.5, 1]}
            center={[300, 100]}
            radius={300}>
            <Text style={styles.buttonText}>Reserve</Text>
          </RadialGradient>
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
  },
  returnBtn: {position: 'absolute', left: 0},
  arrowIcon: {
    top: 30,
    left: 20,
  },
  title: {
    marginTop: 17,
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '500',
    color: '#0A0A0A',
  },
  subtitle: {
    color: '#FFD466',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1.2,
    fontFamily: 'OriginalSurfer-Regular',
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
    borderRadius: 60,
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
    width: 40,
    height: 40,

    backgroundColor: '#3C85AD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  numberOfPeople: {
    fontSize: 24,
    paddingHorizontal: 30,
    color: '#0A0A0A',
    backgroundColor: '#fff',
    elevation: 5,
  },
  calendarBox: {
    height: windowHeight * 0.5,
    width: windowWidth * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    height: '100%',
    width: '100%',
  },
});
