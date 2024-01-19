import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import RadialGradient from 'react-native-radial-gradient';
import {url} from '../url';
import axios from 'axios';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';

const DatePickerCostum = props => {
  const [date, setDate] = useState(new Date());

  return (
    <DatePicker
      textColor="#000"
      mode="time"
      date={props.selectedTime}
      onDateChange={props.setSelectedTime}
      style={{
        borderRadius: 10,
        padding: 10,
        alignSelf: 'center',
        // elevation: 10,
        backgroundColor: '#fff',
        // shadowColor: '#383E44',
        // shadowOffset: {
        //   width: 1,
        //   height: 1,
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 5,
      }} // Add your custom styles here
    />
  );
};

const EventAdmin = () => {
  const [Event, setEvent] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventPlace, setNewEventPlace] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventImage, setNewEventImage] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({
    title: '',
    contents: '',
    image: {url: ''},
    likes: [],
    date: '',
    time: '',
    location: '',
    participants: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalDeleteService, setModalDeleteService] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [Current, setCurrent] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());

  const addEvent = async () => {
    if (
      newEventTitle &&
      newEventDescription &&
      newEventImage &&
      newEventPlace
    ) {
      const newEvent = {
        title: newEventTitle,
        date: selectedDate,
        location: newEventPlace,
        time: selectedTime.toLocaleTimeString(),
        description: newEventDescription,
        image: newEventImage,
      };
      isUpdating ? await UpdateService(newEvent) : await createEvent(newEvent);
      setNewEventTitle('');
      setNewEventDescription('');
      setNewEventPlace('');
      setSelectedDate('');
      setNewEventImage({});
      setIsUpdating(false);
      await getEvents();
      setModalVisible(false);
    }
  };

  const createEvent = async newEvent => {
    try {
      await axios.post(`${url}/api/event/`, newEvent);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      await uploadImage(image);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const uploadImage = async image => {
    const newImageUri = 'file:///' + image.path.split('file:/').join('');

    // Function to determine MIME type based on file extension
    const getMimeType = filename => {
      const extension = filename.split('.').pop();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        // Add more cases for other supported image formats
        default:
          return 'application/octet-stream';
      }
    };

    const formData = new FormData();
    formData.append('image', {
      uri: newImageUri,
      type: getMimeType(newImageUri.split('/').pop()),
      name: newImageUri.split('/').pop(),
    });

    try {
      const response = await axios.post(`${url}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Image uploaded successfully', response.data.image);
        setNewEventImage(response.data.image);
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getEvents();
    console.log(Event);
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

  const getEvents = async () => {
    try {
      let EventData = await axios.get(`${url}/api/event/`);
      setEvent(EventData.data.EventList);
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
  const parseTimeToDateTime = timeString => {
    const [hours, minutes, seconds] = timeString.split(':');
    const dateTime = new Date();
    dateTime.setHours(parseInt(hours, 10));
    dateTime.setMinutes(parseInt(minutes, 10));
    dateTime.setSeconds(parseInt(seconds, 10));
    return dateTime;
  };
  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
    console.log('date selected', date);
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#fff',
    },
  };
  const DeleteService = async id => {
    try {
      await axios.delete(`${url}/api/event/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  const UpdateService = async event => {
    try {
      await axios.put(`${url}/api/event/${selectedEvent._id}`, event);
    } catch (error) {
      console.log(error);
    }
  };

  const handelDeleteService = async id => {
    await DeleteService(id);
    await getEvents();
    setSelectedEvent({
      title: '',
      contents: '',
      image: {url: ''},
      likes: [],
      date: '',
      time: '',
      location: '',
    });
    setModalDeleteService(false);
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.heading]}>Events</Text>
      <ScrollView style={{maxHeight: windowHeight * 0.75}}>
        {Event &&
          Event.map(post => (
            <View key={post._id} style={styles.postCard}>
              <View style={styles.Content}>
                <View style={styles.postHeader}>
                  <Text style={styles.cardTitle}>{post.title}</Text>
                  <View style={styles.infoEventcontainer}>
                    <View style={styles.infoEvent}>
                      <Image
                        style={styles.infoEventImage}
                        source={require('../assets/icons/timeIcon.png')}
                      />
                      <Text style={styles.infoEventText}>
                        {convertTo12HourShortFormat(post.time)}
                      </Text>
                    </View>
                    <View style={styles.infoEvent}>
                      <Image
                        style={styles.infoEventImage}
                        source={require('../assets/icons/locationIcon.png')}
                      />
                      <Text style={styles.infoEventText}>{post.location}</Text>
                    </View>
                    <View style={styles.infoEvent}>
                      <Image
                        style={styles.infoEventImage}
                        source={require('../assets/icons/dateIcon.png')}
                      />
                      <Text style={styles.infoEventText}>
                        {formatMonthAndDay(post.date.slice(0, 10))}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.cardDescription}>
                  {post.description.length > 20
                    ? post.description.slice(0, 19).concat('...')
                    : post.description}
                </Text>
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => {
                    setSelectedEvent(post);
                    setModalInfoVisible(true);
                  }}>
                  <Text style={styles.seeMoreButtonText}>see More {'>'}</Text>
                </TouchableOpacity>
              </View>

              <Image
                source={{uri: `${url}${post.image.url}`}}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addPost}
        onPress={() => {
          setNewEventTitle('');
          setNewEventDescription('');
          setNewEventPlace('');
          setSelectedDate('');
          setSelectedTime(new Date());
          setNewEventImage({});
          setIsUpdating(false);
          setModalVisible(true);
        }}>
        <View
          // colors={['#3C84AC', '#5AC2E3', '#3C84AC']}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#5AC2E3',
          }}>
          <Text style={styles.addPostText}>+</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {isUpdating ? 'Updating' : 'Add Event'}
          </Text>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={newEventTitle}
            onChangeText={setNewEventTitle}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              {height: windowHeight * 0.2, textAlignVertical: 'top'},
            ]}
            value={newEventDescription}
            onChangeText={setNewEventDescription}
            multiline
          />
          <Text style={styles.label}>Date </Text>
          <View style={styles.calendarBox}>
            <View
              style={[styles.gradient, {backgroundColor: '#5AC2E3'}]}
              // colors={['#3C84AC', '#5AC2E3', '#3C84AC']}
            >
              <Calendar
                showSixWeeks={true}
                onDayPress={handleDateSelect}
                style={styles.calendar}
                firstDay={1}
                headerStyle={{}}
                date={selectedDate}
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
          <Text style={styles.label}>Time </Text>
          <DatePickerCostum
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
          <Text style={styles.label}>Place</Text>
          <TextInput
            style={styles.input}
            value={newEventPlace}
            onChangeText={setNewEventPlace}
          />
          <View style={styles.aploadContainer}>
            <Text style={styles.label}>Upload Photo</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}>
              <Image
                source={require('../assets/icons/aploadImagePostIcon.png')}
              />
            </TouchableOpacity>
          </View>
          {newEventImage && (
            <Image
              source={{uri: `${url}${newEventImage.url}`}}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'cover',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          )}

          <TouchableOpacity style={styles.reserveButton} onPress={addEvent}>
            <View
              style={[styles.RadialEffect, {backgroundColor: '#4698BD'}]}
              // colors={['#5AC2E3', '#4698BD', '#3C84AC']}
            >
              <Text style={styles.buttonText}>
                {isUpdating ? 'Updating' : 'Add Event'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setModalVisible(false)}>
            <Image
              style={styles.arrowIcon}
              source={require('../assets/icons/fleche.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      <Modal
        visible={modalInfoVisible}
        animationType="slide"
        onRequestClose={() => setModalInfoVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

          <View
            style={[
              styles.infoEventcontainer,
              {alignSelf: 'center', width: '100%'},
            ]}>
            <View style={styles.infoEvent}>
              <Image
                style={styles.infoEventImage}
                source={require('../assets/icons/timeIcon.png')}
              />
              <Text style={styles.infoEventText}>
                {convertTo12HourShortFormat(selectedEvent.time)}
              </Text>
            </View>
            <View style={styles.infoEvent}>
              <Image
                style={styles.infoEventImage}
                source={require('../assets/icons/locationIcon.png')}
              />
              <Text style={styles.infoEventText}>{selectedEvent.location}</Text>
            </View>
            <View style={styles.infoEvent}>
              <Image
                style={styles.infoEventImage}
                source={require('../assets/icons/dateIcon.png')}
              />
              <Text style={styles.infoEventText}>
                {formatMonthAndDay(selectedEvent.date.slice(0, 10))}
              </Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            {selectedEvent.description}
          </Text>
          <View style={styles.deleteEditButton}>
            <TouchableOpacity
              style={{paddingHorizontal: 20}}
              onPress={() => {
                setIsUpdating(true);
                setNewEventTitle(selectedEvent.title);
                setNewEventDescription(selectedEvent.description);
                setNewEventPlace(selectedEvent.location);
                setSelectedDate(selectedEvent.date.slice(0, 10));
                console.log(selectedEvent.date.slice(0, 10));
                setNewEventImage(selectedEvent.image);
                setSelectedTime(parseTimeToDateTime(selectedEvent.time));
                console.log('time', selectedTime);
                setModalVisible(true);
                setModalInfoVisible(false);
              }}>
              <Image
                style={{width: 24, height: 40, resizeMode: 'contain'}}
                source={require('../assets/icons/edit.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalInfoVisible(false);
                setModalDeleteService(true);
              }}>
              <Image
                style={{width: 25, height: 40, resizeMode: 'contain'}}
                source={require('../assets/icons/deleteIcon.png')}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: `${url}${selectedEvent.image.url}`}}
            style={[
              styles.cardImageEdit,
              {
                borderRadius: 20,
                width: '100%',
                height: 400,
              },
            ]}
            resizeMode="cover"
          />
          <View style={styles.participated}>
            {selectedEvent.participants.map((e, i) => (
              <View key={i} style={styles.participant}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: `${url}${e.avatar.url}`,
                  }}
                />
                <Text style={styles.AlertmodalTitle}>{e.fullName}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setModalInfoVisible(false)}>
            <Image
              style={styles.arrowIcon}
              source={require('../assets/icons/fleche.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ScrollView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDeleteService}
        onRequestClose={() => setModalDeleteServic(false)}>
        <View style={styles.AlertmodalContainer}>
          <View style={styles.AlertmodalContent}>
            <Image
              source={require('../assets/icons/warning.png')} // Replace with your image source
              style={styles.AlertmodalImage}
            />
            <Text style={styles.AlertmodalTitle}>Alert</Text>
            <Text style={styles.AlertmodalText}>
              Are you sure you want to{'\n'}Delete this Event?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setModalDeleteService(false)}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handelDeleteService(selectedEvent._id)}
                style={styles.exitModalButton}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>Yes</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  heading: {
    color: '#383E44',
    fontFamily: 'OriginalSurfer-Regular',
    fontSize: 46,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  postCard: {
    alignSelf: 'center',
    height: windowHeight * 0.5,
    width: windowWidth * 0.8,
    borderRadius: 20,
    marginVertical: 20,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {width: '100%', height: '100%'},
  Content: {},
  postHeader: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#383E44',
    fontFamily: 'Poppins-Regular',

    fontSize: 30,
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    lineHeight: 24,
  },
  seeMoreButton: {position: 'absolute', right: 10, bottom: 8},
  seeMoreButtonText: {
    color: '#3C84AC',
    fontFamily: 'OriginalSurfer-Regular',
    fontSize: 14,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    marginBottom: 5,
  },
  cardImageEdit: {width: '100%', height: '100%'},

  Content: {},

  LikeAndPriceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  LikeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  likeIcon: {height: windowWidth * 0.07, width: windowWidth * 0.07},
  likedValue: {
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    fontSize: 26,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontFamily: 'OriginalSurfer-Regular',
    color: '#000',
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: windowHeight * 0.05,
    marginTop: 20,
  },
  label: {
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    fontSize: 30,
    marginRight: 20,
    marginVertical: 10,
  },
  input: {
    width: windowWidth * 0.8,
    alignSelf: 'center',
    height: windowHeight * 0.07,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#383E44',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
    color: '#000',
    marginVertical: 20,
  },
  addPost: {
    width: windowWidth * 0.17,
    height: windowWidth * 0.17,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
    elevation: 10,
    bottom: 90,
    alignSelf: 'center',
  },
  addPostText: {
    color: '#fff',
    height: '100%',
    fontSize: 46,
  },
  close: {position: 'absolute', top: windowHeight * 0.01, left: 0},
  arrowIcon: {width: 20, height: 20},
  aploadContainer: {flexDirection: 'row'},
  reserveButton: {
    borderRadius: 60,
    width: '50%',
    height: windowHeight * 0.09,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.1,
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'OriginalSurfer-Regular',
  },
  infoEventcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    alignSelf: 'center',
    width: '75%',
  },
  infoEvent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendar: {
    width: '85%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  calendarBox: {
    height: windowHeight * 0.5,
    width: windowWidth * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gradient: {
    height: '100%',
    width: '100%',
  },
  deleteEditButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
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
  Row: {flexDirection: 'row', alignItems: 'center'},
  uploadButtonUpdate: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: windowHeight * 0.39,
    zIndex: 100,
  },
  AlertmodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  AlertmodalContent: {
    elevation: 10,
    backgroundColor: 'white',
    shadowColor: '#0a0a0a',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height: windowHeight * 0.4,
    width: windowWidth * 0.75,
  },
  AlertmodalImage: {
    width: 41,
    height: 41,
    marginBottom: 10,
  },
  AlertmodalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#303030',
  },
  AlertmodalText: {
    fontSize: 20,
    marginVertical: '8%',
    color: '#000',
    lineHeight: windowHeight * 0.04,
    textAlign: 'center',
  },
  uploadButton: {},
  participated: {
    marginTop: 10,
    marginBottom: 100,
  },
  profileImage: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    borderRadius: 50,
    marginRight: 10,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

const blogData = [];

export default EventAdmin;
