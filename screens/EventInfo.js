import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Dimensions,
} from 'react-native';
import HomeReservation from './Reservation/HomeReservation';
import RadialGradient from 'react-native-radial-gradient';
import {url} from '../url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const EventInfo = ({card, close, getEvents}) => {
  const [isparticipate, setisParticipate] = useState(card.participants);
  const [likes, setlikes] = useState(card.likes);
  const [Current, setCurrent] = useState({});

  useEffect(() => {
    getCurrentUser();
    console.log(isparticipate);
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

  const likeEvent = async evnt => {
    try {
      await axios.put(`${url}/api/event/${evnt._id}`, {
        ...evnt,
        likes: [...evnt.likes, Current._id],
      });
      await getEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const UnlikeEvent = async evnt => {
    try {
      await axios.put(`${url}/api/event/${evnt._id}`, {
        ...evnt,
        likes: evnt.likes.filter(e => e !== Current._id),
      });
      await getEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const participate = async () => {
    try {
      await axios.put(`${url}/api/event/${card._id}`, {
        ...card,
        participants: [...card.participants, Current],
      });
      await getEvents();
    } catch (error) {
      console.log(error);
    }
  };
  const unParticipate = async () => {
    try {
      await axios.put(`${url}/api/event/${card._id}`, {
        ...card,
        participants: card.participants.filter(e => e._id !== Current._id),
      });
      await getEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const formatMonthAndDay = dateString => {
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

  const convertTo12HourShortFormat = time24 => {
    const [hours, minutes] = time24.split(':');
    let period = 'AM';

    let hour = parseInt(hours);
    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
        hour -= 12;
      }
    }

    return `${hour}:${minutes} ${period.toLowerCase()}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={close}>
        <Image
          style={styles.arrowIcon}
          source={require('../assets/icons/fleche.png')}
        />
      </TouchableOpacity>

      <ImageBackground
        style={styles.imageContainer}
        source={{uri: `${url}${card.image.url}`}}></ImageBackground>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.LikeAndPriceContainer}>
            <Text style={styles.price}>{card.title}</Text>
            <View style={styles.LikeContainer}>
              <TouchableOpacity
                onPress={() => {
                  card.likes.includes(Current._id)
                    ? (UnlikeEvent(card),
                      setlikes(card.likes.filter(e => e !== Current._id)))
                    : (likeEvent(card), setlikes([...card.likes, Current._id]));
                }}>
                <Image
                  style={styles.likeIcon}
                  source={
                    likes.includes(Current._id)
                      ? require('../assets/icons/FullHeart.png')
                      : require('../assets/icons/heart.png')
                  }
                />
              </TouchableOpacity>
              <Text style={styles.likedValue}>{likes.length}</Text>
            </View>
          </View>

          <Text style={styles.description}>{card.description}</Text>
        </View>
        <View style={styles.infoEventcontainer}>
          <View style={styles.infoEvent}>
            <Image
              style={styles.infoEventImage}
              source={require('../assets/icons/timeIcon.png')}
            />
            <Text style={styles.infoEventText}>
              {convertTo12HourShortFormat(card.time)}
            </Text>
          </View>
          <View style={styles.infoEvent}>
            <Image
              style={styles.infoEventImage}
              source={require('../assets/icons/locationIcon.png')}
            />
            <Text style={styles.infoEventText}>{card.location}</Text>
          </View>
          <View style={styles.infoEvent}>
            <Image
              style={styles.infoEventImage}
              source={require('../assets/icons/dateIcon.png')}
            />
            <Text style={styles.infoEventText}>
              {formatMonthAndDay(card.date.slice(0, 10))}
            </Text>
          </View>
        </View>
        {/* #c73244  */}
        <TouchableOpacity
          style={[
            styles.reserveButton,
            {
              backgroundColor: `${
                !isparticipate.some(e => e._id === Current._id)
                  ? '#FFD466'
                  : '#c73244'
              }`,
            },
          ]}
          onPress={() => {
            isparticipate.some(e => e._id === Current._id)
              ? (unParticipate(),
                setisParticipate(
                  card.participants.filter(e => e._id !== Current._id),
                ))
              : (participate(),
                setisParticipate([...card.participants, Current]));
          }}>
          <Text style={styles.buttonText}>
            {isparticipate.some(e => e._id === Current._id)
              ? 'Cancel'
              : 'Participate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventInfo;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    zIndex: 10,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#0a0a0a',
  },
  imageContainer: {
    width: windowWidth,
    height: windowWidth,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: windowHeight * 0.13,
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: windowHeight * 0.5,
    borderTopLeftRadius: 60,
    justifyContent: 'space-between',
    overflow: 'hidden',
    top: windowHeight * -0.1,
  },
  infoRow: {},
  title: {
    color: '#FFFFFF',
    fontSize: 46,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    fontFamily: 'OriginalSurfer-Regular',
  },
  LikeAndPriceContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  LikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {height: windowWidth * 0.07, width: windowWidth * 0.07},
  likedValue: {
    color: '#F68A72',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  price: {
    color: '#383E44',
    fontSize: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1.5,
    fontFamily: 'OriginalSurfer-Regular',
  },
  description: {
    color: '#000',
    fontSize: 16,
    lineHeight: windowHeight * 0.035,
    fontFamily: 'OriginalSurfer-Regular',
    marginTop: windowHeight * 0.04,
    paddingHorizontal: windowWidth * 0.05,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  reserveButton: {
    paddingHorizontal: 50,
    alignSelf: 'center',
    paddingVertical: 10,
    width: '85%',
    borderRadius: 10,
    elevation: 5,
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 42,
    color: '#383E44',
    fontFamily: 'OriginalSurfer-Regular',
  },
  About: {color: '#7f7e81', fontSize: 20, fontWeight: '500'},
  modalContainer: {},
  modalContent: {},
  infoEventcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 0,
  },
  infoEvent: {alignItems: 'center'},
  infoEventImage: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
  },
  infoEventText: {
    color: '#383E44',
    fontSize: 16,
    marginTop: 5,
  },
});
