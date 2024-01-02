import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <View>
      <Image
        source={require('../assets/Animation/loader.gif')}
        style={{width: 100, height: 100}}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
