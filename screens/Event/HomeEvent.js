import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Event from './Event';

const HomeEvent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleExplorePress = event => {
    setSelectedEvent(event);
  };

  // Static event data
  const events = [
    {
      title: 'Event 1',
      description: 'Description of Event 1',
      image: require('../../assets/icons/eventPic1.png'),
    },
    {
      title: 'Event 2',
      description: 'Description of Event 2',
      image: require('../../assets/icons/eventPic1.png'),
    },
    {
      title: 'Event 3',
      description: 'Description of Event 3',
      image: require('../../assets/icons/eventPic1.png'),
    },
  ];

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {/* ...existing code... */}
      <Text style={styles.title}>Join Our Events</Text>

      {/* OP Card */}
      <View style={styles.cardContainer}>
        <Text style={styles.cardText1}>CUSTOMER EVENTS WITH</Text>
        <Text style={styles.cardText2}>LUCKY BOY</Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore!</Text>
        </TouchableOpacity>
      </View>
      {/* Other Cards */}
      {events.map((event, index) => (
        <TouchableOpacity
          key={index}
          style={styles.product}
          onPress={() => handleExplorePress(event)}>
          <View>
            <Image style={styles.cadreImage} source={event.image} />
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => handleExplorePress(event)}>
              <Text style={styles.exploreButtonText}>Explore!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* ...other cards... */}

      <Modal visible={selectedEvent !== null} animationType="slide">
        {selectedEvent && (
          <Event
            title={selectedEvent.title}
            description={selectedEvent.description}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </Modal>
    </View>
  );
};

export default HomeEvent;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    top: 45,
    fontSize: 36,
    fontWeight: '500',
    color: '#0A0A0A',
    textAlign: 'center',
  },
  cardContainer: {
    top: 80,
    width: 319,
    height: 128,
    backgroundColor: '#0A0A0A',
    flexDirection: 'column',
    borderRadius: 20,
  },
  cardText1: {
    color: '#AAACAE',
    fontSize: 10,
    fontWeight: '500',
    top: 10,
  },
  cardText2: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '400',
    top: 20,
    left: 160,
  },
  exploreButton: {
    marginVertical: 40,
    backgroundColor: '#A2D9FF',
    width: 96,
    height: 19,
    borderRadius: 7,
    left: 25,
  },
  exploreButtonText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: '400',
    left: 25,
  },
  product: {
    top: 100,
    width: 319,
    height: 128,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 20,
    marginTop: 20,
  },
  cadreImage: {
    top: 5,
    left: 5,
  },
  productImage: {
    top: -125,
  },
  productText1: {
    color: '#0A0A0A',
    fontSize: 10,
    fontWeight: '500',
    top: 10,
    left: 25,
  },
  productText2: {
    color: '#0A0A0A',
    fontSize: 24,
    fontWeight: '400',
    top: 20,
    left: 30,
  },
});
