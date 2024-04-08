import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import {url} from '../url';
import ImagePicker from 'react-native-image-crop-picker';

const Profile = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('New Password');
  const [Username, setUserName] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [rib, setRib] = useState('');
  const [isEditingRib, setIsEditingRib] = useState(false);
  const [Current, setCurrent] = useState({});

  const [Avatar, setAvatar] = useState({
    url: '/uploads/2023-12-26T14-37-39.317Z_ef5da2cc-0937-4ef6-8042-d60f7b86a5e9.jpg',
  });
  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };
  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };
  const handleEditPhoneNumber = () => {
    setIsEditingPhoneNumber(true);
  };

  const handleEditRib = () => {
    setIsEditingRib(true);
  };

  const handleEmailChange = text => {
    setEmail(text);
  };

  const handleNameChange = text => {
    setName(text);
  };
  const handlePasswordChange = text => {
    setPassword(text);
  };
  const handlePhoneNumberChange = text => {
    setPhoneNumber(text);
  };

  const handleRibChange = text => {
    setRib(text);
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
    setEmail(Current.email);
  };
  const handleCancelName = () => {
    setIsEditingName(false);
    setName(Current.fullName);
  };
  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setPassword('New Password');
  };
  const handleCancelRib = () => {
    setIsEditingRib(false);
    setRib(Current.rib);
  };
  const handleCancelPhoneNumber = () => {
    setIsEditingPhoneNumber(false);
    setPhoneNumber(Current.Number);
  };
  const handleConfirmEmail = async () => {
    setIsEditingEmail(false);
    await updateUser();
  };
  const handleConfirmName = async () => {
    setIsEditingName(false);
    await updateUser();
  };
  const handleConfirmPassword = async pass => {
    setIsEditingPassword(false);
    await updateUserPassword(pass);
    setPassword("'New Password'");
  };

  const handleConfirmPhoneNumber = async () => {
    setIsEditingPhoneNumber(false);
    await updateUser();
  };

  const handleConfirmRib = async () => {
    setIsEditingRib(false);
    await updateUser();
  };

  useEffect(() => {
    getCurrentUser();
    if (Current.avatar != null) {
      setAvatar(Current.avatar);
    }
  }, []);

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentId = jwtDecode(token).id;

    try {
      let currentUser = await axios.get(`${url}/api/user/${currentId}`);
      if (currentUser.data.avatar != null) {
        setAvatar(currentUser.data.user.avatar);
      }
      setCurrent(currentUser.data.user);
      setEmail(currentUser.data.user.email);
      setName(currentUser.data.user.fullName);
      setUserName(currentUser.data.user.username);
      setRib(currentUser.data.user.rib);
      setPhoneNumber(currentUser.data.user.Number);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${url}/api/user/${Current._id}`, {
        ...Current,
        email: email,
        fullName: name,
        rib: rib,
        Number: phoneNumber,
      });
      await getCurrentUser();
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserImage = async image => {
    try {
      await axios.put(`${url}/api/user/${Current._id}`, {
        ...Current,
        avatar: image,
      });
      console.log('user updated successfully');
      await getCurrentUser();
    } catch (error) {
      console.log(error);
    }
  };
  const updateUserPassword = async newPass => {
    try {
      await axios.post(`${url}/api/user/change-password`, {
        userId: Current._id,
        newPassword: newPass,
      });
      await getCurrentUser();
    } catch (error) {
      console.log(error);
    }
  };
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
      let response = await axios.post(`${url}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.image;
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  const handleUpdateImage = async id => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      let newImageUploaded = await uploadImageToUpdate(image);
      setCurrent({
        ...Current,
        avatar: newImageUploaded,
      });

      await updateUserImage(newImageUploaded);
      setAvatar(newImageUploaded);

      await getCurrentUser();
    } catch (error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        console.warn('Image picking was cancelled by the user.');
      } else if (error.message === 'Network Error') {
        console.error('Network error. Please check your internet connection.');
      } else if (error.response && error.response.status === 400) {
        console.error('Bad request. Please check your input data.');
      } else if (error.response && error.response.status === 401) {
        console.error('Unauthorized. Please log in and try again.');
      } else if (error.response && error.response.status === 404) {
        console.error('Not found. The requested resource was not found.');
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/headerProfile.png')}
        resizeMode="cover"
        style={styles.profileContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
            AsyncStorage.clear();
          }}
          style={styles.logoOutButton}>
          <Image
            style={styles.logoutImage}
            source={require('../assets/icons/logOutIcon.png')}
          />
        </TouchableOpacity>
        <Text style={styles.profileName}>{Username}</Text>

        <Image
          style={styles.profileImage}
          source={{
            uri: `${url}${Current.avatar ? Current.avatar.url : Avatar.url}`,
          }}
        />
        <TouchableOpacity
          onPress={() => handleUpdateImage(Current._id)}
          style={styles.ChangePhoto}>
          <Image
            style={styles.ChangeLogoutIcon}
            source={require('../assets/icons/changePhoto.png')}
          />
        </TouchableOpacity>
      </ImageBackground>
      <Text style={styles.headingText}>My Profile</Text>

      <View style={styles.contentContainer}>
        <View style={styles.contentInfo}>
          <Image
            style={styles.labeleIcon}
            source={require('../assets/icons/mail.png')}
          />
          {isEditingEmail ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                value={email}
                onChangeText={handleEmailChange}
                autoFocus={true}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={handleConfirmEmail}>
                <Icon name="check" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 20}}
                onPress={handleCancelEmail}>
                <Icon name="remove" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.TextValue}>{email}</Text>
              <TouchableOpacity onPress={handleEditEmail}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.contentInfo}>
          <Image
            style={styles.labeleIcon}
            source={require('../assets/icons/name.png')}
          />
          {isEditingName ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputText, isEditingName && styles.transparent]}
                value={name}
                onChangeText={handleNameChange}
                autoFocus={true}
              />
              <TouchableOpacity onPress={handleConfirmName}>
                <Icon name="check" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 30}}
                onPress={handleCancelName}>
                <Icon name="remove" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.TextValue}>{name}</Text>
              <TouchableOpacity onPress={handleEditName}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.contentInfo}>
          <Image
            style={styles.labeleIcon}
            source={require('../assets/icons/phone.png')}
          />
          {isEditingPhoneNumber ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.inputText,
                  isEditingPhoneNumber && styles.transparent,
                ]}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                autoFocus={true}
              />
              <TouchableOpacity onPress={handleConfirmPhoneNumber}>
                <Icon name="check" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 30}}
                onPress={handleCancelPhoneNumber}>
                <Icon name="remove" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.TextValue}>{phoneNumber}</Text>
              <TouchableOpacity onPress={handleEditPhoneNumber}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.contentInfo}>
          <Image
            style={styles.labeleIcon}
            source={require('../assets/icons/Password.png')}
          />
          {isEditingPassword ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.inputText,
                  isEditingPassword && styles.transparent,
                ]}
                value={password}
                onChangeText={handlePasswordChange}
                autoFocus={true}
              />
              <TouchableOpacity onPress={() => handleConfirmPassword(password)}>
                <Icon name="check" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 30}}
                onPress={handleCancelPassword}>
                <Icon name="remove" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.TextValue}>{password}</Text>
              <TouchableOpacity onPress={handleEditPassword}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.headingText}>My Activity</Text>

      <View style={styles.activityContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Event')}>
          <LinearGradient
            colors={['#0094B4', '#00D9F7']}
            start={{x: 1, y: 0}}
            end={{x: 1.1, y: 1}}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/PayIcon.png')}
            />
            <Text style={styles.activityText}>Services</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Reserve')}>
          <LinearGradient
            colors={['#0094B4', '#00D9F7']}
            start={{x: 1, y: 0}}
            end={{x: 1.1, y: 1}}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/reservationIcon.png')}
            />
            <Text style={styles.activityText}>Reservation</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.activityContainer, {marginBottom: windowHeight * 0.15}]}>
        <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
          <LinearGradient
            colors={['#0094B4', '#00D9F7']}
            start={{x: 1, y: 0}}
            end={{x: 1.1, y: 1}}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/BlogIcon.png')}
            />
            <Text style={styles.activityText}>Blogs</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Store')}>
          <LinearGradient
            colors={['#0094B4', '#00D9F7']}
            start={{x: 1, y: 0}}
            end={{x: 1.1, y: 1}}
            style={[styles.activityItem, {backgroundColor: '#3C84AC'}]}>
            <Image
              style={styles.activityIcon}
              source={require('../assets/icons/CarteIcon.png')}
            />
            <Text style={styles.activityText}>Purchased</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.headingText}>My Bank Details</Text>

      <View
        style={[
          styles.contentContainer,
          {
            marginBottom: windowHeight * 0.15,
          },
        ]}>
        <View style={styles.contentInfo}>
          <Text style={styles.textLabel}>Bank Name:</Text>
          {isEditingBankName ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.inputText,
                  isEditingBankName && styles.transparent,
                ]}
                value={bankName}
                onChangeText={handleBankNameChange}
                autoFocus={true}
              />
              <TouchableOpacity onPress={handleConfirmBankName}>
                <Icon name="check" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 30}}
                onPress={handleCancelBankName}>
                <Icon name="remove" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.TextValue}>{bankName}</Text>
              <TouchableOpacity onPress={handleEditBankName}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.contentInfo}>
          <Text style={styles.textLabel}>RIB:</Text>
          {isEditingRib ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputText, isEditingRib && styles.transparent]}
                value={rib}
                onChangeText={handleRibChange}
                autoFocus={true}
              />
              <TouchableOpacity onPress={handleConfirmRib}>
                <Icon name="check" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 30}}
                onPress={handleCancelRib}>
                <Icon name="remove" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.TextValue}>{rib}</Text>
              <TouchableOpacity onPress={handleEditRib}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View> */}
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',

    width: '100%',
  },
  profileContainer: {
    height: windowHeight * 0.29,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
  },
  logoOutButton: {
    position: 'absolute',
    top: windowHeight * 0.05,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutImage: {width: 30, resizeMode: 'contain'},
  logoutText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A2D9FF',
  },
  profileImage: {
    width: windowWidth * 0.27,
    height: windowWidth * 0.27,
    borderRadius: 100,
    position: 'absolute',
    bottom: 5,
    left: windowWidth * 0.367,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    marginBottom: windowHeight * 0.05,
    alignContent: 'center',
  },
  contentContainer: {
    paddingLeft: 42,
    height: windowHeight * 0.2,
    justifyContent: 'space-around',
  },
  headingText: {
    marginVertical: 20,
    marginHorizontal: 10,
    fontSize: 24,

    color: '#383E44',
    fontFamily: 'OriginalSurfer-Regular',
  },
  labeleIcon: {marginRight: 15},
  textLabel: {
    marginVertical: 5,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#212529',
    alignItems: 'center',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  activityContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    height: '8%',
    justifyContent: 'space-evenly',
  },
  activityItem: {
    width: 155,
    height: 75,
    backgroundColor: '#A2D9FF',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
  },
  activityIcon: {},
  activityText: {
    fontSize: 18,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#fff',
    marginLeft: -8,
  },
  bankDetailsContainer: {
    paddingLeft: 42,
  },
  bankDetailsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  transparent: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth * 0.6,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  contentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextValue: {
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 16,
  },

  ChangeLogoutIcon: {width: 30, height: 30},
  ChangePhoto: {position: 'absolute', bottom: 0, left: windowWidth * 0.38},
});

export default Profile;
