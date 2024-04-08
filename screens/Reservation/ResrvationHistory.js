import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {url} from '../../url';
import FoodInfo from '../FoodInfo';
// import RadialGradient from 'react-native-radial-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon1 from 'react-native-vector-icons/Ionicons';
import EventInfo from '../EventInfo';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

Icon.loadFont();
const ReservationHistory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [Current, setCurrent] = useState({fcmtoken: []});
  const [Services, setServices] = useState([]);
  const [Events, setEvents] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const getToken = async user => {
    try {
      const fcmtoken = await messaging().getToken();
      let isSaved = user && user.fcmtoken.includes(fcmtoken);
      // console.log(fcmtoken);
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
    getServices();
    getEvents();
    requestUserPermission();
    retrieveNotificationData();
    getCurrentUser();
  }, []);
  useEffect(() => {
    retrieveNotificationData();
    getCurrentUser();
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
  const getServices = async () => {
    try {
      let servicesData = await axios.get(`${url}/api/services/`);
      setServices(servicesData.data.ServiceList);
    } catch (error) {
      console.log(error);
    }
  };
  const getEvents = async () => {
    try {
      let eventsData = await axios.get(`${url}/api/event/`);
      setEvents(eventsData.data.EventList);
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
      getEvents();
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
      getEvents();
    } catch (error) {
      console.log(error);
    }
  };
  const likeService = async service => {
    try {
      await axios.put(`${url}/api/services/${service._id}`, {
        ...service,
        Likes: service.likes++,
      });
      getServices();
    } catch (error) {
      console.log(error);
    }
  };
  const UnlikeService = async service => {
    try {
      await axios.put(`${url}/api/services/${service._id}`, {
        ...service,
        Likes: service.likes--,
      });
      getServices();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = text => {
    setSearchText(text);
  };

  const handleSeeMore = card => {
    navigation.navigate('ReservationCard', {
      card: card,
      getServices: () => getServices(),
    });
    // setSelectedCard(card);
    // setModalVisible(true);
  };
  const handleSeeMoreEvent = card => {
    setSelectedEvent(card);
    setEventModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCard(null);
  };
  const closeEventModal = () => {
    setEventModalVisible(false);
    setSelectedEvent(null);
  };
  const filteredCards = Services.filter(card =>
    card.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={!showNotif}>
      <LinearGradient
        colors={['#0094B4', '#00D9F7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => navigation.navigate('Notif')}>
          <Icon name="bell" size={20} color="#000" />
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>
                {notifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.profileContent}>
          <Image
            source={{uri: `${url}${Current.avatar && Current.avatar.url}`}}
            style={styles.profile}
          />
          <Text style={styles.HeaderText}>{`HI, ${Current.username}`}</Text>
        </View>
        <Text style={styles.welcome}>Would you like to enjoy your day ?</Text>
      </LinearGradient>
      <View style={styles.searchBar}>
        <Icon
          name="search"
          size={25}
          color="#383E44"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#A2A2A2"
          onChangeText={handleSearch}
          value={searchText}
        />
        <TouchableOpacity onPress={() => setSearchText('')}>
          {searchText ? (
            <Icon
              name="times-circle"
              size={25}
              color="#383E44"
              style={styles.resetIcon}
            />
          ) : (
            ''
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.SubTitle}>Let's have fun</Text>
        <Animated.View style={[styles.ServicesCard, {opacity: fadeAnim}]}>
          <FlatList
            data={filteredCards}
            keyExtractor={item => item.title}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.servicesCardItem}
                onPress={() => handleSeeMore(item)}>
                <ImageBackground
                  source={{uri: `${url}${item.image.url}`}}
                  style={styles.ServicesCardBackground}
                  resizeMode="cover">
                  <View style={styles.titleContainer}>
                    <Text style={styles.ServicesTitle}>{item.title}</Text>
                    <View style={styles.booking}>
                      <Text style={[styles.bookingText, {marginRight: 5}]}>
                        Book Now
                      </Text>
                      <Image
                        style={[styles.seemoreService]}
                        source={require('../../assets/icons/seemore.png')}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>
        <Text style={[styles.SubTitle, {marginTop: 40}]}>Join our events</Text>
        <View style={styles.recommendationContainer}>
          <FlatList
            data={Events}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.recommendationCard}>
                <Image
                  source={{uri: `${url}${item.image.url}`}}
                  style={styles.recommendationImage}
                />
                <View style={styles.recommendationInfo}>
                  <View
                    style={{justifyContent: 'space-between', height: '100%'}}>
                    <Text
                      style={[styles.ServicesTitle, {top: -10, fontSize: 32}]}>
                      {item.title}
                    </Text>
                    <Text style={styles.bookingText}>
                      {item.date.slice(0, 10)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleSeeMoreEvent(item)}
                    style={styles.consultIconContainer}>
                    <Image
                      style={[
                        styles.seemoreService,
                        {marginTop: 43, marginRight: -10},
                      ]}
                      source={require('../../assets/icons/seemore.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <Image
          style={styles.head}
          source={require('../../assets/icons/anim.png')}
        />
        <Text
          style={[
            {
              alignSelf: 'center',
              color: '#00daf8',
              fontFamily: 'OriginalSurfer-Regular',
              fontSize: 50,
            },
          ]}>
          Follow us !
        </Text>
        <View style={styles.socialMedia}>
          <Image
            source={require('../../assets/icons/facebook.png')}
            style={styles.MediaIcon}
          />
          <Image
            source={require('../../assets/icons/insta.png')}
            style={styles.MediaIcon}
          />
          <Image
            source={require('../../assets/icons/what.png')}
            style={styles.MediaIcon}
          />
        </View>
      </View>

      {/* Cards */}

      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FoodInfo
              card={selectedCard}
              close={closeModal}
              getServices={getServices}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        visible={eventModalVisible}
        onRequestClose={closeEventModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <EventInfo
              card={selectedEvent}
              getEvents={getEvents}
              close={closeEventModal}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ReservationHistory;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fefefe',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: '#fff',
    width: windowWidth * 0.7,
    alignSelf: 'center',
    borderRadius: 50,
    elevation: 5,
    zIndex: 15,
    top: windowHeight * -0.1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  resetIcon: {
    marginLeft: 0,
  },
  searchInput: {
    borderColor: '#383E44',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 0,
    width: '80%',
    color: '#383E44',
    fontSize: 20,
  },
  seemoreService: {
    resizeMode: 'contain',
    width: 30,
    padding: 5,
    marginLeft: 5,
    height: 30,
    borderRadius: 50,

    borderColor: '#3C84AC',
  },
  arrowIcon: {
    resizeMode: 'contain',
    width: 40,
    height: 40,
  },
  title: {
    width: '100%',
    marginLeft: '25%',
    fontSize: 30,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  cards: {
    marginTop: 50,
  },
  card: {
    marginVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    height: 116,
    width: 342,
    borderRadius: 13,
  },
  cardImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 15,
    left: 40,
  },
  information: {
    marginTop: 10,
  },
  cardTitle: {
    fontWeight: '900',
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    top: 10,
    color: '#000',
  },
  ServicesCard: {},
  ServicesCardBackground: {
    width: '100%',
    overflow: 'hidden',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    position: 'relative',
    height: windowHeight * 0.11,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingBottom: 50,
    paddingHorizontal: 10,
  },
  booking: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  bookingText: {fontSize: 20, color: '#0094b4'},
  ServicesTitle: {
    color: '#000',
    fontSize: 36,

    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start',
  },
  modalContainer: {},
  modalContent: {},
  SubTitle: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontFamily: 'Poppins-Regular',
    color: '#383E44',
    textShadowColor: 'rgba(56, 62, 68, 0.50)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  servicesCardItem: {
    width: windowWidth * 0.7,
    height: windowWidth * 0.7,
    marginVertical: 10,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#383e44',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    width: windowWidth,
    height: windowHeight * 0.35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'flex-start',
    backgroundColor: '#28B0DB',
    justifyContent: 'center',
  },
  HeaderText: {
    fontSize: 30,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#fff',
  },
  profile: {width: 50, height: 50, borderRadius: 50, marginRight: 20},
  body: {
    backgroundColor: '#fefefe',
    borderRadius: 60,
    top: windowHeight * -0.15,
    width: windowWidth,
    paddingTop: 50,
    marginBottom: 10,
  },
  recommendationContainer: {
    marginTop: 0,
    paddingHorizontal: 20,
    paddingVertical: 40,
    elevation: 10,
    shadowColor: '#383e44',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  recommendationCard: {
    width: windowWidth * 0.7,
    height: windowWidth * 0.7,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#fff',

    overflow: 'hidden',
  },
  recommendationImage: {
    width: '100%',
    height: '70%',
  },
  recommendationInfo: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '30%',
  },
  recommendationTitle: {
    fontSize: 23,
    fontFamily: 'Poppins-Regular',
    color: '#383E44',

    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: {width: 1, height: 1},
    // textShadowRadius: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    color: '#383E44',
    fontSize: 15,
    fontFamily: 'OriginalSurfer-Regular',
  },
  consultIconContainer: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 50,
  },
  QuoteImage: {
    marginTop: windowHeight * 0.1,
    borderTopWidth: 1,
    paddingVertical: 20,
    alignSelf: 'center',
  },
  QuoteBackground: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    marginHorizontal: 30,
    paddingVertical: windowHeight * 0.1,
    paddingHorizontal: windowWidth * 0.1,
  },

  QuoteText: {
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    top: '-30%',
  },
  head: {alignSelf: 'center'},
  MediaIcon: {width: 60, height: 60},
  socialMedia: {
    width: '65%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    marginTop: windowHeight * 0.05,
  },
  notificationContainer: {
    position: 'absolute',
    top: windowHeight * 0.05,
    right: 40,
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: -10,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileContent: {
    flexDirection: 'row',
  },
  welcome: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
  },
  flow: {
    fontFamily: 'OriginalSurfer-Regular',
    fontSize: 42,
    marginTop: windowHeight * 0.06,
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red', // Change color as needed
  },
  notifbox: {
    position: 'absolute',
    paddingBottom: 20,
    width: windowWidth,
    backgroundColor: '#fff',
    zIndex: 10000,
    borderRadius: 20,
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
  },

  notifHeaderTitle: {
    fontSize: 23,
    fontFamily: 'Poppins-Regular',
    color: '#000',
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
  close: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
  },
});
