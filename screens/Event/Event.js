import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const Event = ({title, description, onClose}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image
          style={styles.close}
          source={require('../../assets/icons/fleche.png')}
        />
      </TouchableOpacity>
      <Image
        style={styles.image}
        source={require('../../assets/images/eventPic3.png')}
      />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {marginLeft: 50},
  title: {
    top: 10,
    color: '#303030',
    fontWeight: '600',
    fontSize: 18,
  },
  description: {
    left: 5,
    top: 10,
    color: '#303030',
    fontWeight: '400',
    fontSize: 12,
  },
  close: {
    position: 'absolute',
    margin: 15,
  },
});
