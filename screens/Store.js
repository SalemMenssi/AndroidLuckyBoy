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
  const [searchText, setSearchText] = useState('');

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
  const handleSearch = text => {
    setSearchText(text);
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

  const filteredCardsByName = products.filter(card =>
    card.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const filtredCard =
    selectedCategory === 'All'
      ? filteredCardsByName
      : filteredCardsByName.filter(e => e.categorie === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0094B4', '#00D9F7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header]}>
        <Text style={styles.HeaderTitle}>Store</Text>
      </LinearGradient>
      <View style={styles.searchBar}>
        <Icon
          name="search"
          size={25}
          color="#383E44"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#A2A2A2"
          onChangeText={handleSearch}
          value={searchText}
        />
        <TouchableOpacity onPress={() => setSearchText('')}>
          {searchText ? (
            <Icon
              name="close-circle"
              size={25}
              color="#383E44"
              style={styles.resetIcon}
            />
          ) : (
            ''
          )}
        </TouchableOpacity>
      </View>
      {/* Cards */}
      <View style={styles.cardContainer}>
        {/* Product Types */}
        <ScrollView
          horizontal
          contentContainerStyle={[
            styles.categoryScrollContainer,
            {marginTop: windowHeight * 0.05},
          ]}
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
                    selectedCategory === category ? '#28B0DB' : '#F68A72'
                  }`,
                }}>
                <Text style={styles.categoryTxt}>{category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular */}
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: 36,
              marginTop: windowHeight * 0.02,
              marginBottom: windowHeight * 0.03,
            },
          ]}>
          our Products
        </Text>
        {filtredCard.length === 0 ? (
          <Text style={[styles.subtitle, {alignSelf: 'center'}]}>
            no Products
          </Text>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.categoryScrollContainer,
              {flexWrap: 'wrap', flexDirection: 'row'},
            ]}
            showsHorizontalScrollIndicator={false}>
            {filtredCard.map((card, index) => (
              <View style={styles.card} key={index}>
                <Image
                  source={{uri: `${url}${card.image.url}`}}
                  style={styles.productImage}
                />
                <View style={styles.cardContent}>
                  <View style={styles.content}>
                    <View style={styles.ContentHead}>
                      {/* <Text style={styles.cardCategerie}>{card.categorie}</Text> */}
                      <Text style={styles.cardTitle}>{card.title}</Text>
                    </View>
                    {/* <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() =>
                        card.likes.includes(Current._id)
                          ? UnlikeProdact(card)
                          : likeProdact(card)
                      }>
                      <Text style={[styles.likedValue, {marginHorizontal: 3}]}>
                        {card.likes.length}
                      </Text>
                      <Icon
                        name={
                          card.likes.includes(Current._id)
                            ? 'heart'
                            : 'heart-outline'
                        }
                        size={30}
                        color="#F68A72"
                      />
                    </TouchableOpacity> */}
                  </View>
                  <View style={styles.Cardtaile}>
                    <Text style={styles.cardPrice}>{`${card.price} DT`}</Text>

                    <TouchableOpacity onPress={() => handleBuy(card)}>
                      <Image
                        // style={[styles.seemoreService]}
                        source={require('../assets/icons/seemore.png')}
                        resizeMode="contain"
                        style={styles.productInfoImg}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
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
                {/* <Text style={styles.price}>{`${
                  selectedProduct && selectedProduct.price * quantity
                } DT`}</Text> */}
              </View>
              <Text style={styles.title}>
                {selectedProduct && selectedProduct.title}
              </Text>
              {/* <Text style={styles.About}>Description</Text> */}
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
              <LinearGradient
                colors={['#00D9F7', '#0094B4']}
                start={{x: 0, y: 0}}
                end={{x: 0.9, y: 0.9}}
                style={[
                  styles.RadialEffect,
                  {backgroundColor: '#4698BD', flexDirection: 'row'},
                ]}
                // colors={['#5AC2E3', '#4698BD', '#3C84AC']}
              >
                <Text style={styles.price}>
                  {selectedProduct && selectedProduct.price * quantity} DT
                </Text>
                <Text style={styles.buttonText}>Buy now</Text>
              </LinearGradient>
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
        {basket.length == 0 ? null : (
          <Text style={styles.basketText}>{basket.length}</Text>
        )}
      </TouchableOpacity>

      {/* Cart */}
      <Modal
        visible={modalCartVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCartVisible(false)}>
        <View style={styles.cartContainer}>
          <View style={styles.cartContent}>
            <View style={styles.CartHeader}>
              <Text style={styles.cartTitle}>Cart</Text>
              <TouchableOpacity
                style={styles.cartCloseButton}
                onPress={() => setModalCartVisible(false)}>
                <Text style={styles.cartCloseButtonText}>close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.cartItemsContainer}>
              {basket.map((item, index) => (
                <View style={styles.cartItem} key={index}>
                  <Image
                    style={styles.ImageItem}
                    source={{uri: `${url}${item.image.url}`}}
                  />
                  <View style={styles.cartItemContent}>
                    <Text style={styles.cartItemTitle}>
                      {item.title}
                      <Text style={styles.About}>
                        {item.quantity == 1 ? '' : ` x${item.quantity}`}
                      </Text>
                    </Text>
                    <Text style={styles.cartItemPrice}>{`${
                      item.price * item.quantity
                    } DT`}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cartItemRemove}
                    onPress={() => deleteItem(index)}>
                    <Icon name="trash-outline" size={30} color="#F68A72" />
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
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => Alert.alert('Payement', 'Buy with succes')}>
              <LinearGradient
                colors={['#00D9F7', '#0094B4']}
                start={{x: 0, y: 0}}
                end={{x: 0.9, y: 0.9}}
                style={[
                  styles.RadialEffect,
                  {
                    backgroundColor: '#4698BD',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  },
                ]}
                // colors={['#5AC2E3', '#4698BD', '#3C84AC']}
              >
                <Text style={styles.buttonText}>Buy</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    height: windowHeight * 0.3,
    width: windowWidth * 0.43,
    borderRadius: 13,
    zIndex: 100,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  productImage: {
    width: '100%',
    height: '65%',
    resizeMode: 'cover',
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
    height: '35%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ContentHead: {justifyContent: 'center'},
  cardCategerie: {color: '#000', fontSize: 10, marginHorizontal: 10},
  Cardtaile: {
    flexDirection: 'row',
    marginTop: 5,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#000',
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: {width: 1, height: 1},
    // textShadowRadius: 4,
  },
  cardDescription: {},
  cardButton: {
    marginTop: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '20%',
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
    color: '#0094B4',
    fontSize: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1.5,
    fontFamily: 'Poppins-Bold',
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
    top: 70,
    right: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketIcon: {tintColor: '#fff'},
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
    paddingBottom: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: '80%',
    maxHeight: '80%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: -1,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  cartTitle: {
    fontSize: 40,
    marginBottom: 20,
    color: '#0094B4',
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
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
    borderBottomWidth: 2,
    paddingBottom: 10,
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
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
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
    height: windowHeight * 0.07,
    elevation: 5,
    backgroundColor: '#F68A72',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
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
    paddingHorizontal: 0,
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
    color: '#fff',
    fontSize: 24,

    fontFamily: 'Poppins-Bold',
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
    marginHorizontal: 10,
    marginVertical: 40,
  },
  arrowIcon: {width: 50, resizeMode: 'contain', tintColor: '#fff'},

  imageContainer: {
    width: windowWidth,
    height: windowHeight * 0.55,

    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 50,
    height: windowHeight * 0.57,
    borderTopLeftRadius: 60,
    justifyContent: 'space-evenly',
    top: windowHeight * -0.12,
  },
  infoRow: {},
  title: {
    color: '#000',
    fontSize: 40,

    fontFamily: 'Poppins-Bold',
    marginVertical: 10,
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

  description: {
    color: '#666',
    fontSize: 16,
    lineHeight: windowHeight * 0.03,
    fontFamily: 'OriginalSurfer-Regular',
    marginVertical: 5,
    paddingHorizontal: windowWidth * 0.05,
  },

  reserveButton: {
    borderRadius: 15,
    width: '100%',
    height: windowHeight * 0.07,
    alignSelf: 'center',
    elevation: 5,

    overflow: 'hidden',
  },
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
  },
  About: {color: '#383E44', fontSize: 18, fontWeight: '500'},
  carteButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  productInfoImg: {
    resizeMode: 'contain',
    width: 30,
    padding: 5,
    marginLeft: 5,
    height: 30,
    borderRadius: 50,

    borderColor: '#3C84AC',
  },
  CartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: '#fff',
    width: windowWidth * 0.7,
    alignSelf: 'center',
    borderRadius: 50,
    elevation: 5,
    zIndex: 15,
    top: windowHeight * -0.1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  resetIcon: {
    marginLeft: 0,
  },
  searchInput: {
    borderColor: '#383E44',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 0,
    width: '80%',
    color: '#383E44',
    fontSize: 20,
  },
});

export default Store;
