import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Dimensions,
} from 'react-native';
import HomeReservation from './Reservation/HomeReservation';
import RadialGradient from 'react-native-radial-gradient';
import {url} from '../url';

const FoodInfo = ({card, close}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={close}>
        <Image
          style={styles.arrowIcon}
          source={require('../assets/icons/fleche.png')}
        />
      </TouchableOpacity>

      <ImageBackground
        style={styles.imageContainer}
        source={{uri: `${url}${card.image.url}`}}>
        <Text style={styles.title}>{card.title}</Text>
      </ImageBackground>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.LikeAndPriceContainer}>
            <View style={styles.LikeContainer}>
              <TouchableOpacity
                onPress={() => {
                  setIsLiked(!isLiked);
                }}>
                <Image
                  style={styles.likeIcon}
                  source={
                    isLiked
                      ? require('../assets/icons/FullHeart.png')
                      : require('../assets/icons/heart.png')
                  }
                />
              </TouchableOpacity>
              <Text style={styles.likedValue}>{card.Likes}</Text>
            </View>
            <Text style={styles.price}>{card.price}</Text>
          </View>
          <Text style={styles.description}>{card.discription}</Text>
        </View>

        <TouchableOpacity style={styles.reserveButton} onPress={openModal}>
          <View
            style={[styles.RadialEffect, {backgroundColor: '#4698BD'}]}
            // colors={['#5AC2E3', '#4698BD', '#3C84AC']}
          >
            <Text style={styles.buttonText}>Reserve</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <HomeReservation card={card} close={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodInfo;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    zIndex: 10,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  imageContainer: {
    width: windowWidth,
    height: windowWidth,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: windowHeight * 0.1,
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: windowHeight * 0.45,
    borderTopLeftRadius: 60,
    justifyContent: 'space-between',
    overflow: 'hidden',
    top: windowHeight * -0.072,
  },
  infoRow: {},
  title: {
    color: '#FFFFFF',
    fontSize: 46,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    fontFamily: 'OriginalSurfer-Regular',
  },
  LikeAndPriceContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  LikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {height: windowWidth * 0.07, width: windowWidth * 0.07},
  likedValue: {
    color: '#F68A72',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  price: {
    color: '#FFD466',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1.5,
    fontFamily: 'OriginalSurfer-Regular',
  },
  description: {
    color: '#000',
    fontSize: 16,
    lineHeight: windowHeight * 0.035,
    fontFamily: 'OriginalSurfer-Regular',
    marginVertical: windowHeight * 0.07,
    paddingHorizontal: windowWidth * 0.05,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  reserveButton: {
    borderRadius: 60,
    width: '80%',
    height: windowHeight * 0.09,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 42,
    color: '#fff',
    fontFamily: 'OriginalSurfer-Regular',
  },
  About: {color: '#7f7e81', fontSize: 20, fontWeight: '500'},
  modalContainer: {},
  modalContent: {},
});
