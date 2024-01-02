import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import {url} from '../url';

const Store = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCartVisible, setModalCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    image: {url: ''},
    likes: [],
  });
  const [quantity, setQuantity] = useState(1);
  const [basket, setBasket] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLiked, setIsLiked] = useState(false);

  const [products, setProducts] = useState([]);
  const [Current, setCurrent] = useState({});

  const categories = ['All', 'Clothes', 'Tools', 'Equipment'];

  useEffect(() => {
    getCurrentUser();
    getProducts();
  }, []);

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentId = jwtDecode(token).id;

    try {
      let currentUser = await axios.get(`${url}/api/user/${currentId}`);
      setCurrent(currentUser.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      let productsData = await axios.get(`${url}/api/product`);
      setProducts(productsData.data.productList);
    } catch (error) {
      console.log(error);
    }
  };
  const likeProdact = async prod => {
    try {
      await axios.put(`${url}/api/product/${prod._id}`, {
        ...prod,
        likes: [...prod.likes, Current._id],
      });
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };
  const UnlikeProdact = async prod => {
    try {
      await axios.put(`${url}/api/product/${prod._id}`, {
        ...prod,
        likes: prod.likes.filter(e => e !== Current._id),
      });
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const addToBasket = () => {
    const product = {
      title: selectedProduct.title,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity: parseInt(quantity),
    };
    setBasket([...basket, product]);
    setModalVisible(false);
    setQuantity(1);
    Alert.alert('Product added to basket');
  };

  const handleBuy = product => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const deleteItem = index => {
    const updatedBasket = [...basket];
    updatedBasket.splice(index, 1);
    setBasket(updatedBasket);
    Alert.alert('Product removed from basket');
  };
  const handleCategorySelection = category => {
    setSelectedCategory(category);
    console.log(filtredCard);
  };

  const filtredCard =
    selectedCategory === 'All'
      ? products
      : products.filter(e => e.categorie === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, {backgroundColor: '#28B0DB'}]}>
        <Text style={styles.HeaderTitle}>Store</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {/* Product Types */}
        <ScrollView
          horizontal
          contentContainerStyle={styles.categoryScrollContainer}
          showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryBtn}
              onPress={() => handleCategorySelection(category)}>
              <View
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 15,
                  backgroundColor: `${
                    selectedCategory === category ? '#FFC444' : '#28B0DB'
                  }`,
                }}>
                <Text style={styles.categoryTxt}>{category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular */}
        <Text style={styles.subtitle}>Popular</Text>

        <ScrollView
          contentContainerStyle={[
            styles.categoryScrollContainer,
            {flexWrap: 'wrap', flexDirection: 'row'},
          ]}
          showsHorizontalScrollIndicator={false}>
          {filtredCard.map((card, index) => (
            <ImageBackground
              source={{uri: `${url}${card.image.url}`}}
              resizeMode="cover"
              style={styles.card}
              key={index}>
              <View style={styles.cardContent}>
                <View style={styles.content}>
                  <View style={styles.ContentHead}>
                    <Text style={styles.cardCategerie}>{card.categorie}</Text>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      card.likes.includes(Current._id)
                        ? UnlikeProdact(card)
                        : likeProdact(card)
                    }>
                    <Icon
                      name={
                        card.likes.includes(Current._id)
                          ? 'heart'
                          : 'heart-outline'
                      }
                      size={30}
                      color="#F68A72"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.Cardtaile}>
                  <Text style={styles.cardPrice}>{`${card.price} DT`}</Text>

                  <TouchableOpacity
                    onPress={() => handleBuy(card)}
                    style={styles.cardButton}>
                    <Icon
                      style={styles.basketIcon}
                      size={25}
                      color="#fff"
                      name="cart-outline"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>
      </View>

      {/* Basket Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            height: windowHeight,
            width: windowWidth,
            backgroundColor: '#fff',
          }}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setModalVisible(false)}>
            <Image
              style={styles.arrowIcon}
              source={require('../assets/icons/fleche.png')}
            />
          </TouchableOpacity>

          <Image
            style={styles.imageContainer}
            source={{
              uri: `${url}${selectedProduct && selectedProduct.image.url}`,
            }}
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.LikeAndPriceContainer}>
                <View style={styles.LikeContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      selectedProduct &&
                      selectedProduct.likes.includes(Current._id)
                        ? (UnlikeProdact(selectedProduct),
                          setSelectedProduct({
                            ...selectedProduct,
                            likes: selectedProduct.likes.filter(
                              e => e !== Current._id,
                            ),
                          }))
                        : (likeProdact(selectedProduct),
                          setSelectedProduct({
                            ...selectedProduct,
                            likes: [...selectedProduct.likes, Current._id],
                          }));
                    }}>
                    <Image
                      style={styles.likeIcon}
                      source={
                        selectedProduct &&
                        selectedProduct.likes.includes(Current._id)
                          ? require('../assets/icons/FullHeart.png')
                          : require('../assets/icons/heart.png')
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.likedValue}>
                    {selectedProduct && selectedProduct.likes.length}
                  </Text>
                </View>
                <Text style={styles.price}>{`${
                  selectedProduct && selectedProduct.price * quantity
                } DT`}</Text>
              </View>
              <Text style={styles.title}>
                {selectedProduct && selectedProduct.title}
              </Text>
              <Text style={styles.About}>Description</Text>
              <Text style={styles.description}>
                {selectedProduct && selectedProduct.description}
              </Text>
            </View>
            <View style={styles.quantityContainer}>
              <Text style={styles.About}>Quantity</Text>
              <View style={styles.numberPicker}>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity - 1)}
                  style={styles.button}>
                  <Text style={styles.PickerButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.numberOfPeople}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={styles.button}>
                  <Text style={styles.PickerButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.reserveButton}
              onPress={addToBasket}>
              <View style={[styles.RadialEffect, {backgroundColor: '#3C84AC'}]}>
                <Text style={styles.buttonText}>Add To Cart</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Basket */}
      <TouchableOpacity
        style={styles.basketButton}
        onPress={() => setModalCartVisible(true)}>
        <Image
          style={styles.basketIcon}
          source={require('../assets/icons/StoreCartIcon.png')}
        />
        <Text style={styles.basketText}>{basket.length}</Text>
      </TouchableOpacity>

      {/* Cart */}
      <Modal
        visible={modalCartVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCartVisible(false)}>
        <View style={styles.cartContainer}>
          <View style={styles.cartContent}>
            <Text style={styles.cartTitle}>Cart</Text>
            <ScrollView contentContainerStyle={styles.cartItemsContainer}>
              {basket.map((item, index) => (
                <View style={styles.cartItem} key={index}>
                  <Image
                    style={styles.ImageItem}
                    source={{uri: `${url}${item.image.url}`}}
                  />
                  <View style={styles.cartItemContent}>
                    <Text style={styles.cartItemTitle}>{item.title}</Text>
                    <Text style={styles.cartItemPrice}>{`${
                      item.price * item.quantity
                    } DT`}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cartItemRemove}
                    onPress={() => deleteItem(index)}>
                    <Icon name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.basketBottom}>
              <Text style={styles.About}>Total</Text>
              <Text style={styles.cartItemPrice}>{`${
                basket &&
                basket.reduce((acc, e) => acc + e.price * e.quantity, 0)
              } DT`}</Text>
            </View>
            <View style={styles.carteButtonContainer}>
              <TouchableOpacity
                style={styles.cartCloseButton}
                onPress={() => Alert.alert('Payement', 'Buy with succes')}>
                <View
                  style={[styles.RadialEffect, {backgroundColor: '#FFD466'}]}>
                  <Text style={styles.buttonText}>Buy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cartCloseButton}
                onPress={() => setModalCartVisible(false)}>
                <View
                  style={[styles.RadialEffect, {backgroundColor: '#5AC2E3'}]}>
                  <Text style={styles.buttonText}>close</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  HeaderTitle: {
    color: '#FFFFFF',
    fontSize: 46,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: windowHeight * 0.15,
    fontFamily: 'OriginalSurfer-Regular',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000000',
  },

  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderColor: '#000',
    marginVertical: 10,
    height: windowHeight * 0.35,
    width: windowWidth * 0.43,
    borderRadius: 13,
    zIndex: 100,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  cardImage: {},
  cardContent: {
    alignItems: 'center',
    width: '100%',
    height: '40%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ContentHead: {justifyContent: 'center'},
  cardCategerie: {color: '#ccebff', fontSize: 10, marginHorizontal: 10},
  Cardtaile: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'OriginalSurfer-Regular',
    fontSize: 16,
    color: '#fff',
    marginVertical: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  cardDescription: {},
  cardButton: {
    marginTop: 5,
    backgroundColor: '#F68A72',
    borderRadius: 5,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '30%',
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 10,
    marginRight: 5,
  },
  cardPrice: {
    color: '#FFD466',
    fontSize: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1.5,
    fontFamily: 'OriginalSurfer-Regular',
    alignSelf: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: 300,
    elevation: 5,
  },
  modalImage: {
    width: windowWidth,
    height: windowHeight * 0.5,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: 40,

    color: '#000',
    fontFamily: 'OriginalSurfer-Regular',
    margin: 10,
  },
  modalPrice: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalCloseButtonText: {
    color: '#0A84FF',
    fontSize: 16,
    textAlign: 'center',
  },
  basketButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketIcon: {},
  basketText: {
    position: 'absolute',
    top: 1,
    right: 0,
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  productTypes: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  categoryBtn: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 15,
  },
  categoryIconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: -2,
  },
  categoryIcon: {},
  categoryTxt: {},
  cardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    top: windowHeight * -0.15,
    backgroundColor: '#fefefe',
    borderRadius: 40,
  },
  cartContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
  },
  cartContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: '75%',
    maxHeight: '75%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: -20,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  cartTitle: {
    fontSize: 40,
    marginBottom: 20,
    color: '#3C84AC',
    fontFamily: 'OriginalSurfer-Regular',
  },
  cartItemsContainer: {
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: '#E5E5E5',
    height: windowHeight * 0.15,
  },
  ImageItem: {
    width: '40%',
    resizeMode: 'cover',
    height: '100%',
    borderRadius: 20,
  },
  cartItemContent: {
    height: '70%',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  cartItemTitle: {
    fontSize: 24,
    color: '#383E44',
    fontWeight: '500',
  },
  cartItemPrice: {
    color: '#FFD466',
    fontSize: 24,
    textShadowColor: '#383E44',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    fontFamily: 'OriginalSurfer-Regular',
  },
  cartItemRemove: {position: 'absolute', right: 10},
  basketBottom: {
    borderTopWidth: 1,
    borderColor: '#BBB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  cartCloseButton: {
    borderRadius: 20,
    width: '32%',
    height: windowHeight * 0.07,
    elevation: 5,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  cartCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerImage: {
    width: '110%',
    height: '110%',
    position: 'absolute',
    top: -30,
  },
  header: {
    position: 'relative',
    width: windowWidth,
    height: windowHeight * 0.4,
    backgroundColor: '#b3e0ff',
    justifyContent: 'center',
  },
  gradientButton: {
    paddingHorizontal: 50,
    paddingVertical: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScrollContainer: {marginTop: 10, width: windowWidth * 1.2},
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  numberPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5AC2E3',
  },
  PickerButtonText: {
    fontSize: 20,
    color: '#5AC2E3',
  },
  numberOfPeople: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: '#0A0A0A',
    backgroundColor: '#fff',
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
    resizeMode: 'contain',
  },
  imageContainer: {
    width: windowWidth,
    height: windowHeight * 0.55,

    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    height: windowHeight * 0.53,
    borderTopLeftRadius: 60,
    justifyContent: 'space-between',
    overflow: 'hidden',
    top: windowHeight * -0.12,
  },
  infoRow: {},
  title: {
    color: '#000',
    fontSize: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    fontFamily: 'OriginalSurfer-Regular',
    marginVertical: 10,
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
    color: '#666',
    fontSize: 16,
    lineHeight: windowHeight * 0.03,
    fontFamily: 'OriginalSurfer-Regular',
    marginVertical: 5,
    paddingHorizontal: windowWidth * 0.05,
  },

  reserveButton: {
    borderRadius: 60,
    width: '60%',
    height: windowHeight * 0.08,
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
    fontSize: 30,
    color: '#fff',
    fontFamily: 'OriginalSurfer-Regular',
  },
  About: {color: '#383E44', fontSize: 18, fontWeight: '500'},
  carteButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default Store;
