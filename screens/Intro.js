import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

const Intro = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Intro.png')}
        style={styles.image}
      />

      <TouchableOpacity style={styles.signinButton}>
        <Text style={styles.signinButtonText}>SignIn</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  image: {width: 400, height: 250, resizeMode: 'contain', marginBottom: 70},
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 90,
  },
  signinButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  signinButtonText: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  signupButtonText: {color: '#000', fontSize: 20, fontWeight: 'bold'},
});
