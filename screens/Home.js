import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {url} from '../url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import jwtDecode from 'jwt-decode';
Icon.loadFont();
const Home = () => {
  const navigation = useNavigation();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const formPosition = useRef(new Animated.Value(height)).current;

  // State variable for input values
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    Number: '',
  });
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [confirmidPassword, setConfirmidPassword] = useState('');

  const handleGetStarted = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token != null) {
      await getCurrentUser();
    } else {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowLoginForm(true);
        Animated.timing(formPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleRegister = () => {
    Animated.timing(formPosition, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowRegisterForm(true);
      Animated.timing(formPosition, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleLogin = () => {
    Animated.timing(formPosition, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowRegisterForm(false);
      Animated.timing(formPosition, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const login = async user => {
    try {
      let result = await (await axios.post(`${url}/api/user/login`, user)).data;
      console.log(result);
      await AsyncStorage.setItem('token', result.token);
      result.user.isAdmin
        ? navigation.navigate('Admin')
        : navigation.navigate('User');
    } catch (error) {
      if (error.message.includes('Network Error')) {
        Alert.alert(
          'Error',
          'Network error. Please check your internet connection.',
        );
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with an error:', error.response.data);
        Alert.alert(
          'Error',
          'Invalid credentials. Please check your username and password.',
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request made but no response received:', error.request);
        Alert.alert(
          'Error',
          'No response from the server. Please try again later.',
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
        Alert.alert(
          'Error',
          'An unexpected error occurred. Please try again later.',
        );
      }
    }
  };
  const register = async user => {
    try {
      let result = await (
        await axios.post(`${url}/api/user/register`, user)
      ).data;
      Alert.alert('Success', 'User created successfully');

      console.log(result);
    } catch (error) {
      Alert.alert('Error', 'bad request');
      console.log(error.data);
    }
  };

  const handelLoginSubmit = async user => {
    let TrimedUserName = user.username.trim();
    setUser({...user, username: TrimedUserName});
    await login({...user, username: TrimedUserName});
    setUser({
      username: '',
      password: '',
    });
    console.log('login', {...user, username: TrimedUserName});
  };

  const handleRegisterSubmit = async () => {
    let TrimedUserName = newUser.username.trim();

    setNewUser({...newUser, username: TrimedUserName});
    await register({...newUser, username: TrimedUserName});
    setNewUser({
      username: '',
      password: '',
      email: '',
      fullName: '',
      Number: '',
    });
    console.log('register', newUser);
  };

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentId = jwtDecode(token).id;

    try {
      let currentUser = await axios.get(`${url}/api/user/${currentId}`);
      currentUser.data.user.isAdmin
        ? navigation.navigate('Admin')
        : navigation.navigate('User');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <ImageBackground
        source={require('../assets/images/IntroHome.png')}
        style={styles.backgroundImage}>
        <Image
          source={require('../assets/icons/bbba.png')}
          style={styles.logo}
        />

        <Animated.View style={[styles.container, {opacity: contentOpacity}]}>
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              The Best way{'\n'}to see Tunisia
            </Text>
            <Text
              style={[
                styles.description,
                {fontFamily: 'OriginalSurfer-Regular'},
              ]}>
              Start exploring the natural{'\n'}wonders of the water!
            </Text>
          </View>

          {!showLoginForm && (
            <View style={styles.centeredButtonContainer}>
              <TouchableOpacity
                onPress={handleGetStarted}
                style={styles.button}>
                <Text style={styles.buttonText}>Get Started!</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {showLoginForm && (
          <Animated.View
            style={[
              styles.formContainer,
              {transform: [{translateY: formPosition}]},
            ]}>
            {!showRegisterForm ? (
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.37)',
                  'rgba(255, 255, 255, 0.14)',
                ]}
                useAngle={true}
                angle={137}
                style={styles.formBox}>
                <Text style={styles.loginTitle}>Login</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#364F6B"
                    value={user.username}
                    onChangeText={text => setUser({...user, username: text})}
                  />
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordinput}
                      placeholder="Password"
                      placeholderTextColor="#364F6B"
                      secureTextEntry={!showPassword}
                      value={user.password}
                      onChangeText={text => setUser({...user, password: text})}
                    />
                    <Icon
                      name={showPassword ? 'eye-slash' : 'eye'}
                      size={24}
                      color="#333"
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  </View>
                </View>
                <View style={styles.formButton}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => handelLoginSubmit(user)}>
                    <Text style={styles.buttonText}>Log in</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}>
                    <Text style={[styles.buttonText, {color: '#0098F4'}]}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.37)',
                  'rgba(255, 255, 255, 0.14)',
                ]}
                useAngle={true}
                angle={137}
                style={styles.formBox}>
                <Text style={styles.loginTitle}>Register</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#364F6B"
                    value={newUser.email}
                    onChangeText={text => setNewUser({...newUser, email: text})}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#364F6B"
                    value={newUser.fullName}
                    onChangeText={text =>
                      setNewUser({...newUser, fullName: text})
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#364F6B"
                    value={newUser.username}
                    onChangeText={text =>
                      setNewUser({...newUser, username: text})
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    keyboardType="numeric"
                    placeholderTextColor="#364F6B"
                    value={newUser.Number}
                    onChangeText={text =>
                      setNewUser({...newUser, Number: text})
                    }
                  />
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordinput}
                      placeholder="Password"
                      placeholderTextColor="#364F6B"
                      secureTextEntry={!showPassword}
                      value={newUser.password}
                      onChangeText={text =>
                        setNewUser({...newUser, password: text})
                      }
                    />
                    <Icon
                      name={showPassword ? 'eye-slash' : 'eye'}
                      size={24}
                      color="#333"
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  </View>
                </View>
                <View style={styles.formButton}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleRegisterSubmit}>
                    <Text style={[styles.buttonText, {color: '#000'}]}>
                      Register
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.registerButton, {marginTop: 10}]}
                    onPress={handleLogin}>
                    <Text style={[styles.buttonText, {color: '#0098F4'}]}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          </Animated.View>
        )}
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backgroundImage: {
    backgroundColor: '#000',
    padding: 15,
    flex: 1,
    resizeMode: 'cover',
    height: height,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20%',
  },
  logo: {
    width: 120,
    height: 90,
    resizeMode: 'contain',
    marginTop: 70,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'OriginalSurfer-Regular',
    marginLeft: 0,
  },
  content: {},
  subtitle: {
    fontSize: 40,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 20,
    marginVertical: 10,
    fontFamily: 'OriginalSurfer-Regular',
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 60,
  },
  centeredButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  button: {
    backgroundColor: '#FFD466',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '70%',
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    textAlign: 'center',
  },
  formContainer: {
    position: 'absolute',
    top: height * 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    elevation: 100,
    shadowColor: 'rgba(255, 255, 255, 0.25)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 40,
    inset: true,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    paddingVertical: 20,
  },
  loginTitle: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,

    fontFamily: 'OriginalSurfer-Regular',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    height: 42,
    width: '80%',
    borderRadius: 20,
    paddingHorizontal: 25,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#fff',
  },
  passwordinput: {
    fontSize: 16,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    height: 42,
    width: '80%',
    borderRadius: 20,
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  loginButton: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '80%',
    borderRadius: 60,
    backgroundColor: '#FFD466',
    shadowColor: '#e6a400',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.67,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 15,
  },
  registerButton: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '80%',
    borderRadius: 60,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.67,
    shadowRadius: 15,
    elevation: 8,
  },
  formButton: {
    width: '70%',
    alignItems: 'center',
  },
});

export default Home;
