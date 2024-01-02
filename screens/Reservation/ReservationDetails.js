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
    <View style={{height: windowHeight * 0.7, backgroundColor: '#3C84AC'}}>
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
      <View style={styles.activitiesInfo}>
        <ImageBackground
          source={require('../../assets/images/detailsBox.png')}
          style={styles.line}>
          <Text style={styles.label}>Guest</Text>
          <Text style={styles.value}>{card.people}</Text>
        </ImageBackground>
        <ImageBackground
          source={require('../../assets/images/detailsBox.png')}
          style={styles.line}>
          <Text style={styles.label}>Day</Text>
          <Text style={styles.value}>{formatMonthAndDay(card.date)}</Text>
        </ImageBackground>
        <ImageBackground
          source={require('../../assets/images/detailsBox.png')}
          style={styles.line}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{card.time.slice(0, 5)}</Text>
        </ImageBackground>
      </View>

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
  arrowIcon: {},
  heading: {
    alignSelf: 'center',
    fontSize: 36,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#FFD466',
    marginTop: windowHeight * 0.1,
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

  buttonText: {
    fontSize: 25,
    color: '#F68A72',
    fontFamily: 'OriginalSurfer-Regular',
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
  return: {padding: 10, position: 'absolute', marginTop: 10, marginLeft: 10},
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

export default ReservationDetails;
