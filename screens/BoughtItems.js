import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const BoughtItems = () => {
  return (
    <View>
      <Image
        style={{top: 30, left: 20}}
        source={require('../assets/icons/fleche.png')}
      />
      <Text
        style={{
          top: 45,
          fontSize: 36,
          fontWeight: 500,
          color: '#0A0A0A',
          textAlign: 'center',
        }}>
        Bought Items
      </Text>

      <Text
        style={{
          top: 80,
          left: 45,
          fontSize: 16,
          fontWeight: 500,
          color: '#000000',
        }}>
        Completed
      </Text>
      {/*Card  */}

      <View style={styles.cards}>
        <View style={styles.card}>
          <Image
            source={require('../assets/images/noSlog.png')}
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: 15,
              left: 40,
            }}
          />
          <View style={styles.information}>
            <Text style={{fontWeight: 900}}>Kayak</Text>
            <Text>description</Text>
            <TouchableOpacity>
              <Text>See more</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              top: 10,
              color: '#000',
              fontWeight: 400,
              fontSize: 20,
            }}>
            30DTN
          </Text>
        </View>

        <View style={styles.card}>
          <Image
            source={require('../assets/images/noSlog.png')}
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: 15,
              left: 40,
            }}
          />
          <View style={styles.information}>
            <Text style={{fontWeight: 900}}>Kayak</Text>
            <Text>description</Text>
            <TouchableOpacity>
              <Text>See more</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              top: 10,
              color: '#000',
              fontWeight: 400,
              fontSize: 20,
            }}>
            30DTN
          </Text>
        </View>
      </View>
      {/* Waiting for paymant */}
      <Text
        style={{
          top: 100,
          left: 48,
          fontSize: 16,
          fontWeight: 500,
          color: '#000000',
        }}>
        Waiting for Paymant
      </Text>
      <View style={styles.cards}>
        <View style={styles.card}>
          <Image
            source={require('../assets/images/noSlog.png')}
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: 15,
              left: 40,
            }}
          />
          <View style={styles.information}>
            <Text style={{top: 10, fontWeight: 900}}>Kayak</Text>
            <Text style={{top: 10}}>description</Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              top: 10,
              color: '#000',
              fontWeight: 400,
              fontSize: 20,
            }}>
            30DTN
          </Text>
          <TouchableOpacity
            style={{
              top: 20,
              borderRadius: 7,
              width: 65,
              height: 30,
              backgroundColor: '#0A0A0A',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 12, fontWeight: '500', color: '#A2D9FF'}}>
              Pay
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Image
            source={require('../assets/images/noSlog.png')}
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: 15,
              left: 40,
            }}
          />
          <View style={styles.information}>
            <Text style={{top: 10, fontWeight: 900}}>Kayak</Text>
            <Text style={{top: 10}}>description</Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              top: 10,
              color: '#000',
              fontWeight: 400,
              fontSize: 20,
            }}>
            30DTN
          </Text>
          <TouchableOpacity
            style={{
              top: 20,
              borderRadius: 7,
              width: 65,
              height: 30,
              backgroundColor: '#0A0A0A',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 12, fontWeight: '500', color: '#A2D9FF'}}>
              Pay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BoughtItems;

const styles = StyleSheet.create({
  cards: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    top: 100,
    right: 25,
  },
  card: {
    marginVertical: 10,
    left: 35,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    height: 206,
    width: 146,
    borderRadius: 13,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
