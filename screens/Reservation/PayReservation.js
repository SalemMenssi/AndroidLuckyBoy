import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
} from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import {url} from '../../url';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

const PayReservation = ({card, close, getBookings}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const cancelTheReservation = async () => {
    try {
      await axios.put(`${url}/api/booking/${card._id}`, {
        ...card,
        status: 'Cancelled',
      });
      await getBookings();
      close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleExit = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const formatMonthAndDay = dateString => {
    console.log(dateString);
    const dateParts = String(dateString).slice(0, 10).split('-');

    if (dateParts.length === 3) {
      const day = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10);
      return `${day} ${getMonthName(month)}`;
    }
    return 'Invalid Date';
  };

  const getMonthName = month => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month - 1] || 'Unknown';
  };

  return (
    <View>
      <LinearGradient
        colors={['#0094B4', '#00DaF8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{height: windowHeight * 0.7, justifyContent: 'center'}}>
        <TouchableOpacity style={styles.return} onPress={close}>
          <Image
            style={styles.arrowIcon}
            source={require('../../assets/icons/fleche.png')}
          />
        </TouchableOpacity>

        <Image
          style={styles.imageStyle}
          source={require('../../assets/images/friends.png')}
        />
        <Text style={styles.heading}>Well Done!</Text>
        <Text style={styles.sub}>
          Hope you will have good time{'\n'}with Lucky boy!{'\n'}Thank you for
          being a valued{'\n'}customer!
        </Text>
      </LinearGradient>
      <TouchableOpacity style={styles.reserveButton}>
        <LinearGradient
          colors={['#00DaF8', '#0094B4']}
          start={{x: 0, y: 0}}
          end={{x: 0.9, y: 0.9}}
          style={[styles.RadialEffect, {backgroundColor: '#FFC444'}]}
          // colors={['#FFC444', '#FEE6C2', '#FFC444']}
        >
          <Text style={styles.buttonText}>Payment</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  arrowIcon: {width: 40, resizeMode: 'contain', tintColor: '#fff'},
  heading: {
    alignSelf: 'center',
    fontSize: 36,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    marginTop: 20,
  },
  sub: {
    alignSelf: 'center',
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',

    fontFamily: 'Poppins-Medium',

    marginTop: windowHeight * 0.05,
    fontWeight: '500',
    lineHeight: windowHeight * 0.03,
  },
  subheading: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'normal',
    color: '#000000',
  },
  imageStyle: {
    width: windowWidth * 0.5,
    height: windowWidth * 0.5,
    alignSelf: 'center',
    marginTop: windowHeight * 0.1,
  },
  activitie: {
    marginTop: windowHeight * 0.05,
    alignItems: 'center',
  },
  activityName: {
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    fontSize: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'normal',
  },
  value: {
    left: 0,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },

  exitButton: {
    borderRadius: 15,
    width: windowWidth * 0.4,
    height: windowHeight * 0.07,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: windowHeight * 0.1,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#F68A72',
  },

  reserveButton: {
    borderRadius: 12,
    width: '40%',
    height: windowHeight * 0.07,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
    marginTop: windowHeight * 0.1,
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  activitiesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  line: {
    alignItems: 'center',
    width: windowWidth * 0.23,
    height: windowHeight * 0.15,
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  return: {padding: 10, position: 'absolute', top: 40, marginLeft: 0},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height: windowHeight * 0.4,
    width: windowWidth * 0.75,
  },
  modalImage: {
    width: 41,
    height: 41,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#303030',
  },
  modalText: {
    fontSize: 20,
    marginVertical: '8%',
    color: '#000',
    lineHeight: windowHeight * 0.04,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  exitModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {},
  confirmButton: {},
});

export default PayReservation;
