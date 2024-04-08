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

const ReservationDetails = ({card, close, getBookings}) => {
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
        style={{height: windowHeight * 0.7}}>
        <TouchableOpacity style={styles.return} onPress={close}>
          <Image
            style={styles.arrowIcon}
            source={require('../../assets/icons/fleche.png')}
          />
        </TouchableOpacity>

        <Text style={styles.heading}>Reservation details</Text>

        <View style={styles.activitie}>
          <Image
            style={styles.imageStyle}
            resizeMode="cover"
            source={{uri: `${url}${card.service.image.url}`}}
          />
          <Text style={styles.activityName}>{card.service.title}</Text>
        </View>
        <Text style={styles.motivation}>
          You will live an unforgettable adventure that will last a lifetime.
        </Text>
        <View style={styles.activitiesInfo}>
          <ImageBackground
            source={require('../../assets/images/detailsBox.png')}
            resizeMode="contain"
            style={styles.line}>
            <Text style={styles.label}>Guest</Text>
            <Text style={styles.value}>{card.people}</Text>
          </ImageBackground>
          <ImageBackground
            source={require('../../assets/images/detailsBox.png')}
            resizeMode="contain"
            style={styles.line}>
            <Text style={styles.label}>Day</Text>
            <Text style={styles.value}>{formatMonthAndDay(card.date)}</Text>
          </ImageBackground>
          <ImageBackground
            source={require('../../assets/images/detailsBox.png')}
            resizeMode="contain"
            style={styles.line}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{card.time.slice(0, 4)}</Text>
          </ImageBackground>
        </View>
      </LinearGradient>
      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../assets/icons/warning.png')} // Replace with your image source
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>Alert</Text>
            <Text style={styles.modalText}>
              Are you sure you want to{'\n'}cancel the reservation?
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
    </View>
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
    marginTop: windowHeight * 0.095,
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
    color: '#fff',
    fontSize: 32,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'normal',
    marginBottom: 5,
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
    height: windowHeight * 0.05,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: windowHeight * 0.1,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#5ac2e3',
  },

  buttonText: {
    fontSize: 25,
    color: '#5ac2e3',
    fontFamily: 'Poppins-Medium',
  },
  activitiesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  line: {
    alignItems: 'center',
    width: windowWidth * 0.26,
    height: windowHeight * 0.15,
    justifyContent: 'center',
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
  motivation: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 18,
  },
});

export default ReservationDetails;
