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
import {url} from '../url';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

const Confirmation = ({card, close, getBookings}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleExit = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleExitConfirm = () => {};

  const cancelTheReservation = async () => {
    try {
      await axios.put(`${url}/api/booking/${card._id}`, {
        ...card,
        status: 'Refused',
      });
      await sendNotification(
        'Reservation order',
        'Your Reservation Is Refused',
      );

      await getBookings();
      close();
    } catch (error) {
      console.log(error);
    }
  };
  const AccepteTheReservation = async () => {
    try {
      await axios.put(`${url}/api/booking/${card._id}`, {
        ...card,
        status: 'Confirmed',
      });
      await sendNotification(
        'Reservation order',
        'Your Reservation Is Confirmed',
      );
      await getBookings();

      close();
    } catch (error) {
      console.log(error);
    }
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
  useEffect(() => {
    console.log(card.client.fcmtoken[card.client.fcmtoken.length - 1]);
  }, []);
  const sendNotification = async (title, body) => {
    const deviceToken = card.client.fcmtoken[card.client.fcmtoken.length - 1];
    try {
      await axios.post(`${url}/send-notification`, {deviceToken, title, body});
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <LinearGradient
      colors={['#0094B4', '#00DaF8']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{height: windowHeight * 0.7, backgroundColor: '#3C84AC'}}
      // colors={['#3C84AC', '#5AC2E3', '#3C84AC']}
    >
      <TouchableOpacity style={styles.return} onPress={close}>
        <Image
          style={styles.arrowIcon}
          source={require('../assets/icons/fleche.png')}
        />
      </TouchableOpacity>

      <Text style={styles.heading}>Reservation details</Text>

      <View style={styles.activitie}>
        <Image
          style={styles.imageStyle}
          resizeMode="cover"
          source={{
            uri: `${url}${card.client.avatar && card.client.avatar.url}`,
          }}
        />
        <Text style={styles.activityName}>{card.client.fullName}</Text>
        <Text style={styles.activityName}>{card.client.Number}</Text>
      </View>
      <View style={styles.activitiesInfo}>
        <ImageBackground
          source={require('../assets/images/detailsBox.png')}
          style={styles.line}>
          <Text style={styles.label}>Guest</Text>
          <Text style={styles.value}>{card.people}</Text>
        </ImageBackground>
        <ImageBackground
          source={require('../assets/images/detailsBox.png')}
          style={styles.line}>
          <Text style={styles.label}>Day</Text>
          <Text style={styles.value}>{formatMonthAndDay(card.date)}</Text>
        </ImageBackground>
        <ImageBackground
          source={require('../assets/images/detailsBox.png')}
          style={styles.line}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{card.time.slice(0, 4)}</Text>
        </ImageBackground>
      </View>

      <View style={styles.btnBox}>
        <TouchableOpacity
          style={[styles.exitButton, {borderColor: '#5AC2E3'}]}
          onPress={handleExit}>
          <Text style={[styles.buttonText, {color: '#5AC2E3'}]}>Refuse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={AccepteTheReservation}>
          <LinearGradient
            colors={['#00DaF8', '#0094B4']}
            start={{x: 0, y: 0}}
            end={{x: 0.9, y: 0.9}}
            style={[styles.RadialEffect, {backgroundColor: '#FFC444'}]}
            // colors={['#FFC444', '#FEE6C2', '#FFC444']}
          >
            <Text style={[styles.buttonText, {color: '#fff'}]}>Accepte</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../assets/icons/warning.png')} // Replace with your image source
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>Alert</Text>
            <Text style={styles.modalText}>
              Are you sure you want to{'\n'}refuse the reservation?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.confirmButton]}
                onPress={cancelTheReservation}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  arrowIcon: {width: 40, resizeMode: 'contain', tintColor: '#fff'},
  heading: {
    alignSelf: 'center',
    fontSize: 32,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    marginTop: windowHeight * 0.106,
  },
  subheading: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'normal',
    color: '#000000',
  },
  imageStyle: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
    borderRadius: 100,
  },
  activitie: {
    marginTop: windowHeight * 0.05,
    alignItems: 'center',
  },
  activityName: {
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
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

  buttonText: {
    fontSize: 25,
    color: '#F68A72',
    fontFamily: 'Poppins-Bold',
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
  return: {padding: 10, position: 'absolute', marginTop: 40, marginLeft: 0},
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
    height: windowHeight * 0.35,
    width: windowWidth * 0.75,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
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
  btnBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reserveButton: {
    borderRadius: 12,
    width: '40%',
    height: windowHeight * 0.07,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Confirmation;
