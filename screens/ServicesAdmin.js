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

import LinearGradient from 'react-native-linear-gradient';
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
        elevation: 10,
        backgroundColor: '#fff',
        shadowColor: '#383E44',
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      }} // Add your custom styles here
    />
  );
};

const ServicesAdmin = () => {
  const [Services, setServices] = useState([]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceImage, setNewServiceImage] = useState({});
  const [selectedService, setSelectedService] = useState({
    title: '',
    discription: '',
    image: {url: ''},
    likes: [],
    price: 0,
    _id: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalDeleteService, setModalDeleteService] = useState(false);
  const [modalEditService, setModalEditService] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [Current, setCurrent] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());

  const addService = async () => {
    if (
      newServiceTitle &&
      newServiceDescription &&
      newServiceImage &&
      newServicePrice
    ) {
      const newService = {
        title: newServiceTitle,
        price: newServicePrice,
        discription: newServiceDescription,
        image: newServiceImage,
      };

      await createService(newService);
      setNewServiceTitle('');

      setNewServicePrice(0);
      setNewServiceDescription('');
      setNewServiceImage({});
      await getServices();
      setModalVisible(false);
    }
  };

  const createService = async newService => {
    try {
      await axios.post(`${url}/api/services/`, newService);
      console.log(newService);
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
        setNewServiceImage(response.data.image);
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getServices();
    console.log(Services);
  }, []);
  const uploadImageToUpdate = async image => {
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
        return response.data.image;
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };
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

  const getServices = async () => {
    try {
      let ServiceData = await axios.get(`${url}/api/services/`);
      setServices(ServiceData.data.ServiceList);
    } catch (error) {
      console.log(error);
    }
  };
  const DeleteService = async id => {
    try {
      await axios.delete(`${url}/api/services/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  const updateService = async id => {
    try {
      await axios.put(`${url}/api/services/${id}`, {
        ...selectedService,
        title: newServiceTitle,
        discription: newServiceDescription,
        price: Number(newServicePrice),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handelDeleteService = async id => {
    await DeleteService(id);
    await getServices();
    setSelectedService({
      title: '',
      discription: '',
      image: {url: ''},
      likes: [],
      price: 0,
      _id: '',
    });
    setModalDeleteService(false);
    setModalInfoVisible(false);
  };

  const handelUpdate = async id => {
    await updateService(id);
    await getServices();
    setSelectedService({
      ...selectedService,
      title: newServiceTitle,
      discription: newServiceDescription,
      price: Number(newServicePrice),
    });
    setModalEditService(false);
    setModalInfoVisible(true);
  };
  const handleUpdateImage = async id => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      let newImage = await uploadImageToUpdate(image);
      setSelectedService({
        ...selectedService,
        image: newImage,
      });
      await axios.put(`${url}/api/services/${id}`, {
        ...selectedService,
        image: newImage,
      });
      setNewServiceImage({});
      await getServices();
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Activities</Text>
      <ScrollView
        style={{
          maxHeight: windowHeight * 0.75,
          marginBottom: windowHeight * 0.12,
        }}>
        {Services &&
          Services.map(post => (
            <View key={post._id} style={styles.postCard}>
              <View style={styles.Content}>
                <View style={styles.postHeader}>
                  <Text style={styles.cardTitle}>{post.title}</Text>

                  <Text style={styles.price}>{post.price} DT</Text>
                </View>

                <Text style={[styles.cardDescription, {padding: 20}]}>
                  {post.discription.length > 30
                    ? post.discription.slice(0, 29).concat('...')
                    : post.discription}
                </Text>
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => {
                    setSelectedService(post);
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
        onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={['#0094B4', '#00DAF8']}
          start={{x: 0, y: 0.5}}
          end={{x: 0.5, y: 1}}
          style={{
            justifyContent: 'center',
            backgroundColor: '#5AC2E3',
          }}>
          <Text style={styles.addPostText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Service</Text>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={newServiceTitle}
            onChangeText={setNewServiceTitle}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              {height: windowHeight * 0.2, textAlignVertical: 'top'},
            ]}
            value={newServiceDescription}
            onChangeText={setNewServiceDescription}
            multiline
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={newServicePrice.toString()}
            onChangeText={setNewServicePrice}
            keyboardType="numeric"
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
          {newServiceImage && (
            <Image
              source={{uri: `${url}${newServiceImage.url}`}}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'cover',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          )}

          <TouchableOpacity style={styles.reserveButton} onPress={addService}>
            <LinearGradient
              colors={['#0094B4', '#00DaF8']}
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 0.9}}
              style={[styles.RadialEffect, {backgroundColor: '#5ac2e3'}]}>
              <Text style={styles.buttonText}>Add Service</Text>
            </LinearGradient>
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
          <Text style={styles.modalTitle}>{selectedService.title}</Text>

          <View style={styles.ServiceHeader}>
            <View style={styles.informationService}>
              <Text style={styles.price}>{selectedService.price} DT</Text>

              <Text style={styles.cardDescription}>
                {selectedService.discription}
              </Text>
            </View>
            <View style={styles.deleteEditButton}>
              <TouchableOpacity
                onPress={() => {
                  setModalEditService(true);
                  setModalInfoVisible(false);
                  setNewServicePrice(selectedService.price);
                  setNewServiceDescription(selectedService.discription);
                  setNewServiceTitle(selectedService.title);
                }}>
                <Image
                  style={{width: 22, height: 40, resizeMode: 'contain'}}
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
          </View>
          <TouchableOpacity
            style={[styles.uploadButtonUpdate]}
            onPress={() => handleUpdateImage(selectedService._id)}>
            <Image
              source={require('../assets/icons/aploadImagePostIcon.png')}
            />
          </TouchableOpacity>
          <Image
            source={{uri: `${url}${selectedService.image.url}`}}
            style={[
              styles.cardImage,
              {
                borderRadius: 20,
                width: '100%',
                height: 400,
                marginBottom: 100,
              },
            ]}
            resizeMode="cover"
          />
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
              Are you sure you want to{'\n'}Delete this Service?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.exitModalButton,
                  styles.cancelButton,
                  {borderColor: '#F68A72'},
                ]}
                onPress={() => {
                  setModalDeleteService(false);
                  setModalInfoVisible(true);
                }}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handelDeleteService(selectedService._id)}
                style={[styles.exitModalButton, {borderColor: '#0080B2'}]}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditService}
        onRequestClose={() => setModalEditService(false)}>
        <View style={styles.AlertmodalContainer}>
          <View
            style={[
              styles.AlertmodalContent,
              {height: windowHeight * 0.6, justifyContent: 'space-evenly'},
            ]}>
            <Text style={styles.AlertmodalTitle}>Edit</Text>
            <TextInput
              style={styles.inputModal}
              value={newServiceTitle}
              onChangeText={setNewServiceTitle}
            />
            <TextInput
              style={styles.inputModal}
              value={newServicePrice.toString()}
              onChangeText={setNewServicePrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.inputModal}
              value={newServiceDescription}
              onChangeText={setNewServiceDescription}
              multiline={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => {
                  setModalEditService(false);
                  setModalInfoVisible(true);
                }}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handelUpdate(selectedService._id)}
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
    fontFamily: 'Poppins-Bold',
    fontSize: 46,
    alignSelf: 'center',
    marginHorizontal: 20,
    marginTop: windowHeight * 0.07,
    marginBottom: 20,
  },
  postCard: {
    alignSelf: 'center',
    height: windowHeight * 0.37,
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
  },
  cardImage: {
    width: '100%',
    height: '65%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  Content: {height: '40%', justifyContent: 'space-between'},
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  seeMoreButton: {position: 'absolute', right: 10, bottom: 13},
  seeMoreButtonText: {
    color: '#3C84AC',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#383E44',
    marginBottom: 5,
  },
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
    fontFamily: 'Poppins-Bold',
    color: '#383E44',
    fontSize: 26,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    color: '#000',
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.07,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    color: '#383E44',
    fontSize: 26,
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
    textAlign: 'center',
    paddingTop: 5,
  },
  close: {position: 'absolute', top: 25, left: 0},
  arrowIcon: {width: 40, resizeMode: 'contain'},
  aploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
  },
  reserveButton: {
    borderRadius: 15,
    width: '50%',
    height: windowHeight * 0.07,
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
    fontSize: 25,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  infoServicecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '75%',
  },
  infoService: {
    alignItems: 'center',
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
  price: {
    color: '#FFD466',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1.5,
    fontFamily: 'Poppins-Bold',
  },
  informationService: {
    padding: 10,
    maxWidth: '80%',
  },
  AlertmodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    height: windowHeight * 0.34,
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
  ServiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputModal: {
    width: windowWidth * 0.6,
    paddingVertical: windowHeight * 0.025,
    paddingHorizontal: 30,
    borderRadius: 16,
    elevation: 6,
    backgroundColor: 'white',
    shadowColor: 'rgba(56, 62, 68, 1)',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 3,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  exitModalButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 2,
  },
  Row: {flexDirection: 'row', alignItems: 'center'},
  uploadButtonUpdate: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: windowHeight * 0.33,
    zIndex: 100,
  },
  uploadButton: {},
});

export default ServicesAdmin;
