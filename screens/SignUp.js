import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.SingUpText}> Sign Up </Text>

      <View style={styles.box}>
        <TextInput style={styles.FullNameInput} placeholder="FullName" />
        <TextInput style={styles.emailInput} placeholder="Email" />
        <TextInput
          secureTextEntry={true}
          style={styles.passwordInput}
          placeholder="Password"
        />
        <TextInput
          secureTextEntry={true}
          style={styles.ConfirmPasswordInput}
          placeholder="Confirm Password"
        />

        <TouchableOpacity
          style={styles.SignUpButton}
          onPress={() => navigation.navigate('User')}>
          <Text style={styles.SignUpTextButton}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.haveAccount}> Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  SingUpText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A2D9FF',
    marginVertical: 70,
    textAlign: 'center',
    fontFamily: 'poppins',
    letterSpacing: 2,
    fontSize: 36,
  },
  SignUpButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  SignUpTextButton: {color: '#A2D9FF', fontSize: 20, fontWeight: 'bold'},
  FullNameInput: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 10,
  },
  emailInput: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 10,
  },
  passwordInput: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  ConfirmPasswordInput: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  haveAccount: {alignSelf: 'center', color: '#000000'},
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
