import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {SvgUri} from 'react-native-svg';

const SignIn = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/noSlog.png')}
        style={styles.image}
      />
      <View style={styles.box}>
        <Text style={styles.Login}>Login</Text>
        <TextInput style={styles.emailInput} placeholder="Email" />
        <TextInput style={styles.passwordInput} placeholder="Password" />
        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        <TouchableOpacity style={styles.CWGButton}>
          <Image
            source={require('../assets/icons/Google.png')}
            style={styles.imageGoogle}
          />
          <Text style={styles.CWGTextButton}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.LoginButton}
          onPress={() => navigation.navigate('User')}>
          <Text style={styles.LoginTextButton}>Login Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.DontHaveAccount}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  image: {width: 129, height: 138, resizeMode: 'contain', marginBottom: 70},
  imageGoogle: {
    width: 30,
    resizeMode: 'contain',
  },
  CWGButton: {
    backgroundColor: '#fff',
    padding: 15,
    width: 300,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    height: 60,
    elevation: 5,
    borderRadius: 5,
    justifyContent: 'space-around',
  },
  LoginButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  CWGTextButton: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 20,
    fontWeight: 'bold',
  },
  LoginTextButton: {color: '#A2D9FF', fontSize: 20, fontWeight: 'bold'},
  emailInput: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 20,
  },
  passwordInput: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 20,
    marginTop: 10,
  },
  Login: {fontSize: 30, fontWeight: 'bold'},
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 50,
    marginTop: -20,
    color: '#000000',
  },
  DontHaveAccount: {alignSelf: 'center', color: '#000000'},
  box: {
    backgroundColor: '#fff',
    padding: 15,
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 80,
    bottom: 40,
  },
});
