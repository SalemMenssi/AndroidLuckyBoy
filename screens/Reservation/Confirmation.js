import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Confirmation = () => {
  return (
    <View style={{height: '100%'}}>
      <Image
        style={{top: 30, left: 20}}
        source={require('../../assets/icons/fleche.png')}
      />
      <Text
        style={{
          top: 100,
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 900,
          color: '#0A0A0A',
        }}>
        Confirmation
      </Text>
      <Text
        style={{
          top: 100,
          textAlign: 'center',
          fontWeight: 350,
          fontSize: 14,
          color: '#000000',
        }}>
        This is your reservation overview
      </Text>
      <Image
        style={{top: 120, left: 180}}
        source={require('../../assets/icons/Confirm.png')}
      />
      <Text
        style={{
          top: 135,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: 20,
          color: '#000000',
        }}>
        Paddle
      </Text>

      <View
        style={{
          flexDirection: 'row',
          top: 200,
          justifyContent: 'space-evenly',
        }}>
        <Text style={{fontWeight: 350, fontSize: 16, color: '#000000'}}>
          Guest
        </Text>
        <Text style={{fontWeight: 350, fontSize: 16, color: '#000000'}}>
          Day
        </Text>
        <Text style={{fontWeight: 350, fontSize: 16, color: '#000000'}}>
          Time
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          top: 210,
          justifyContent: 'space-evenly',
        }}>
        <Text
          style={{left: 27, fontWeight: 900, fontSize: 24, color: '#000000'}}>
          4
        </Text>
        <Text
          style={{left: 30, fontWeight: 900, fontSize: 24, color: '#000000'}}>
          Aug 30
        </Text>
        <Text
          style={{left: 5, fontWeight: 900, fontSize: 24, color: '#000000'}}>
          18:30
        </Text>
      </View>

      <View
        style={{
          top: 280,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            borderRadius: 7,
            width: 175,
            height: 44,
            backgroundColor: '#0A0A0A',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, fontWeight: '400', color: '#A2D9FF'}}>
            Confirm Reservation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Confirmation;

const styles = StyleSheet.create({});
