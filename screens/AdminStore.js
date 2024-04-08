import React, {useEffect, useMemo, useState} from 'react';
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
import Icon1 from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import {url} from '../url';
import ImagePicker from 'react-native-image-crop-picker';
import RadioGroup from 'react-native-radio-buttons-group';

const AdminStore = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [modalCartVisible, setModalCartVisible] = useState(false);
  const [TitleChangingVisible, setTitleChangingVisible] = useState(false);
  const [DescChangingVisible, setDescChangingVisible] = useState(false);
  const [CategoryChangingVisible, setCategoryChangingVisible] = useState(false);
  const [PriceChangingVisible, setPriceChangingVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState({
    image: {url: ''},
    likes: [],
  });
  const [quantity, setQuantity] = useState(1);
  const [basket, setBasket] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedId, setSelectedId] = useState();
  const [products, setProducts] = useState([]);
  const [Current, setCurrent] = useState({});
  const [NewProductName, setNewProductName] = useState('');
  const [NewProductPrice, setNewProductPrice] = useState('');
  const [NewProductCategory, setNewProductCategory] = useState(0);
  const [NewProductImage, setNewProductImage] = useState({});
  const [DataToedit, setDataToedit] = useState('');
  const [NewProductImageToUpdate, setNewProductImageToUpdate] = useState({});

  const categories = ['All', 'Clothes', 'Tools', 'Equipment'];

  useEffect(() => {
    getCurrentUser();
    getProducts();
    console.log(NewProductCategory);
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
  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      await uploadImage(image);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const uploadImage = async image => {
    const newImageUri = 'file:///' + image.path.split('file:/').join('');

    // Function to determine MIME type based on file extension
    const getMimeType = filename => {
      const extension = filename.split('.').pop();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        // Add more cases for other supported image formats
        default:
          return 'application/octet-stream';
      }
    };

    const formData = new FormData();
    formData.append('image', {
      uri: newImageUri,
      type: getMimeType(newImageUri.split('/').pop()),
      name: newImageUri.split('/').pop(),
    });

    try {
      const response = await axios.post(`${url}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Image uploaded successfully', response.data.image);
        setNewProductImage(response.data.image);
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };
  const handleUpdateImage = async id => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      await uploadImageToUpdate(image);
      setSelectedProduct({
        ...selectedProduct,
        image: NewProductImageToUpdate,
      });
      await axios.put(`${url}/api/product/${id}`, {
        ...selectedProduct,
        image: NewProductImageToUpdate,
      });
      await getProducts();
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const uploadImageToUpdate = async image => {
    const newImageUri = 'file:///' + image.path.split('file:/').join('');

    // Function to determine MIME type based on file extension
    const getMimeType = filename => {
      const extension = filename.split('.').pop();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        // Add more cases for other supported image formats
        default:
          return 'application/octet-stream';
      }
    };

    const formData = new FormData();
    formData.append('image', {
      uri: newImageUri,
      type: getMimeType(newImageUri.split('/').pop()),
      name: newImageUri.split('/').pop(),
    });

    try {
      const response = await axios.post(`${url}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Image uploaded successfully', response.data.image);
        setNewProductImageToUpdate(response.data.image);
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Equipment',
        value: 'Equipment',
        borderColor: '#3C84AC',
        color: '#3C84AC',
        containerStyle: {width: 100},
      },
      {
        id: '2',
        label: 'Tools',
        value: 'Tools',
        borderColor: '#3C84AC',
        color: '#3C84AC',
        containerStyle: {width: 100},
      },
      {
        id: '3',
        label: 'Clothes',
        value: 'Clothes',
        borderColor: '#3C84AC',
        color: '#3C84AC',
        containerStyle: {width: 100},
      },
    ],
    [],
  );

  const handelAddProduct = async () => {
    await AddProduct();
    await getProducts();
    setModalCartVisible(false);
  };
  const handelDeleteProduct = async id => {
    await DeleteProduct(id);
    await getProducts();
    setSelectedProduct({
      image: {url: ''},
      likes: [],
    });
    setModalAlertVisible(false);
    setModalVisible(false);
  };

  const AddProduct = async () => {
    try {
      await axios.post(`${url}/api/product`, {
        title: NewProductName,
        description: NewProductName,
        price: Number(NewProductPrice),
        categorie: radioButtons[NewProductCategory].value,
        image: NewProductImage,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const DeleteProduct = async id => {
    try {
      await axios.delete(`${url}/api/product/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTitle = async (newTitle, id) => {
    try {
      await axios.put(`${url}/api/product/${id}`, {
        ...selectedProduct,
        title: newTitle,
      });
      setSelectedProduct({...selectedProduct, title: newTitle});
      setDataToedit('');
      await getProducts();
      setTitleChangingVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  const updatePrice = async (newPrice, id) => {
    try {
      await axios.put(`${url}/api/product/${id}`, {
        ...selectedProduct,
        price: Number(newPrice),
      });
      setSelectedProduct({...selectedProduct, price: Number(newPrice)});
      setDataToedit('');
      await getProducts();
      setPriceChangingVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  const updateDescrition = async (newDescrition, id) => {
    try {
      await axios.put(`${url}/api/product/${id}`, {
        ...selectedProduct,
        description: newDescrition,
      });
      setSelectedProduct({...selectedProduct, description: newDescrition});
      setDataToedit('');
      await getProducts();
      setDescChangingVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  const updateCategory = async id => {
    try {
      await axios.put(`${url}/api/product/${id}`, {
        ...selectedProduct,
        categorie: radioButtons[NewProductCategory - 1].value,
      });
      setSelectedProduct({
        ...selectedProduct,
        categorie: radioButtons[NewProductCategory - 1].value,
      });
      await getProducts();
      setCategoryChangingVisible(false);
    } catch (error) {
      console.log(error);
    }
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
      <LinearGradient
        colors={['#0094B4', '#00D9F7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header]}>
        <Text style={styles.HeaderTitle}>Store</Text>
      </LinearGradient>

      {/* Cards */}
      <View
        style={styles.cardContainer}
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
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
                  <View style={styles.likedBox}>
                    <Text style={styles.likedValue}>{card.likes.length}</Text>
                    <Icon name={'heart'} size={30} color="#F68A72" />
                  </View>
                </View>
                <View style={styles.Cardtaile}>
                  <Text style={styles.cardPrice}>{`${card.price} DT`}</Text>

                  <TouchableOpacity
                    onPress={() => handleBuy(card)}
                    style={styles.cardButton}>
                    <Icon1
                      style={styles.basketIcon}
                      size={20}
                      color="#fff"
                      name="edit"
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
            <TouchableOpacity
              style={[
                styles.uploadButton,
                {
                  marginTop: windowHeight * 0.3,
                  marginLeft: windowWidth * 0.7,
                },
              ]}
              onPress={() => handleUpdateImage(selectedProduct._id)}>
              <Image
                source={require('../assets/icons/aploadImagePostIcon.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.close,
              {alignSelf: 'flex-end', top: windowHeight * 0.47, right: 30},
            ]}
            onPress={() => setModalAlertVisible(true)}>
            <Image
              style={{width: 40, height: 40, resizeMode: 'contain'}}
              source={require('../assets/icons/deleteIcon.png')}
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
              <View style={styles.Row}>
                <Text style={styles.title}>
                  {selectedProduct && selectedProduct.title}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setTitleChangingVisible(true);
                    setDataToedit(selectedProduct.title);
                  }}>
                  <Image source={require('../assets/icons/edit.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.Row}>
                <Text style={[styles.price, {marginRight: 10}]}>{`${
                  selectedProduct && selectedProduct.price
                } DT`}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setPriceChangingVisible(true);
                    setDataToedit(selectedProduct.price + '');
                  }}>
                  <Image source={require('../assets/icons/edit.png')} />
                </TouchableOpacity>
              </View>
              <View style={[styles.Row, {marginTop: windowHeight * 0.06}]}>
                <Text style={[styles.About, {marginRight: 10}]}>Category</Text>
                <TouchableOpacity
                  onPress={() => {
                    let newCategory =
                      selectedProduct.categorie == 'Equipment'
                        ? '1'
                        : selectedProduct.categorie == 'Tools'
                        ? '2'
                        : '3';
                    setNewProductCategory(newCategory);
                    console.log(NewProductCategory);
                    setCategoryChangingVisible(true);
                  }}>
                  <Image source={require('../assets/icons/edit.png')} />
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>
                {selectedProduct && selectedProduct.categorie}
              </Text>
              <View style={[styles.Row, {marginTop: windowHeight * 0.06}]}>
                <Text style={[styles.About, {marginRight: 10}]}>
                  Description
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setDescChangingVisible(true);
                    setDataToedit(selectedProduct.description);
                  }}>
                  <Image source={require('../assets/icons/edit.png')} />
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>
                {selectedProduct && selectedProduct.description}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Basket */}
      <TouchableOpacity
        style={styles.basketButton}
        onPress={() => setModalCartVisible(true)}>
        <View
          style={[styles.RadialEffect, {backgroundColor: '#FFC444'}]}
          // colors={['#FFC444', '#FEE6C2', '#FFC444']}
        >
          <Icon1 name="cart-plus" size={25} color="#383E44" />
        </View>
      </TouchableOpacity>

      {/* Cart */}
      <Modal
        visible={modalCartVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCartVisible(false)}>
        <View style={styles.cartContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add Item </Text>
            <Text style={styles.formSubTitle}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={setNewProductName}
              value={NewProductName}
            />
            <Text style={styles.formSubTitle}>Price</Text>

            <TextInput
              style={[styles.input, {width: windowWidth * 0.6}]}
              placeholder="Price"
              keyboardType="numeric"
              onChangeText={setNewProductPrice}
              value={NewProductPrice}
            />
            <Text style={styles.formSubTitle}>Category</Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setNewProductCategory}
              selectedId={NewProductCategory}
              containerStyle={{
                alignSelf: 'flex-start',
                marginLeft: windowWidth * 0.1,
              }}
            />
            <Text style={styles.formSubTitle}>Upload Photo</Text>

            <TouchableOpacity
              onPress={handleImageUpload}
              style={styles.uploadButton}>
              <Image
                source={require('../assets/icons/aploadImagePostIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.reserveButton, {marginTop: windowHeight * 0.05}]}
              onPress={handelAddProduct}>
              <View
                style={[styles.RadialEffect, {backgroundColor: '#5AC2E3'}]}
                // colors={['#5AC2E3', '#4698BD', '#3C84AC']}
              >
                <Text style={styles.buttonText}>Add Item</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setModalCartVisible(false)}>
              <Image
                style={styles.arrowIcon}
                source={require('../assets/icons/fleche.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAlertVisible}
        onRequestClose={() => setModalAlertVisible(false)}>
        <View style={styles.AlertmodalContainer}>
          <View style={styles.AlertmodalContent}>
            <Image
              source={require('../assets/icons/warning.png')} // Replace with your image source
              style={styles.AlertmodalImage}
            />
            <Text style={styles.AlertmodalTitle}>Alert</Text>
            <Text style={styles.AlertmodalText}>
              Are you sure you want to{'\n'}Delete this Product?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setModalAlertVisible(false)}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handelDeleteProduct(selectedProduct._id)}
                style={styles.exitModalButton}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={TitleChangingVisible}
        onRequestClose={() => setTitleChangingVisible(false)}>
        <View style={styles.AlertmodalContainer}>
          <View
            style={[
              styles.AlertmodalContent,
              {justifyContent: 'space-around'},
            ]}>
            <Image
              source={require('../assets/icons/edit.png')} // Replace with your image source
              style={styles.AlertmodalImage}
            />
            <Text style={styles.AlertmodalTitle}>Edit</Text>
            <TextInput
              style={styles.inputModal}
              value={DataToedit}
              onChangeText={setDataToedit}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setTitleChangingVisible(false)}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateTitle(DataToedit, selectedProduct._id)}
                style={styles.exitModalButton}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={CategoryChangingVisible}
        onRequestClose={() => setCategoryChangingVisible(false)}>
        <View style={styles.AlertmodalContainer}>
          <View
            style={[
              styles.AlertmodalContent,
              {justifyContent: 'space-around'},
            ]}>
            <Image
              source={require('../assets/icons/edit.png')} // Replace with your image source
              style={styles.AlertmodalImage}
            />
            <Text style={styles.AlertmodalTitle}>Edit{NewProductCategory}</Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setNewProductCategory}
              selectedId={NewProductCategory}
              containerStyle={{
                alignSelf: 'flex-start',
                marginLeft: windowWidth * 0.1,
              }}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setCategoryChangingVisible(false)}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateCategory(selectedProduct._id)}
                style={styles.exitModalButton}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={DescChangingVisible}
        onRequestClose={() => setDescChangingVisible(false)}>
        <View style={styles.AlertmodalContainer}>
          <View
            style={[
              styles.AlertmodalContent,
              {justifyContent: 'space-around'},
            ]}>
            <Image
              source={require('../assets/icons/edit.png')} // Replace with your image source
              style={styles.AlertmodalImage}
            />
            <Text style={styles.AlertmodalTitle}>Edit</Text>
            <TextInput
              style={styles.inputModal}
              value={DataToedit}
              onChangeText={setDataToedit}
              multiline={true}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setDescChangingVisible(false)}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  updateDescrition(DataToedit, selectedProduct._id)
                }
                style={styles.exitModalButton}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={PriceChangingVisible}
        onRequestClose={() => setPriceChangingVisible(false)}>
        <View style={styles.AlertmodalContainer}>
          <View
            style={[
              styles.AlertmodalContent,
              {justifyContent: 'space-around'},
            ]}>
            <Image
              source={require('../assets/icons/edit.png')} // Replace with your image source
              style={styles.AlertmodalImage}
            />
            <Text style={styles.AlertmodalTitle}>Edit</Text>
            <TextInput
              style={styles.inputModal}
              value={DataToedit}
              onChangeText={setDataToedit}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.exitModalButton, styles.cancelButton]}
                onPress={() => setPriceChangingVisible(false)}>
                <Text style={[styles.buttonText, {color: '#0080B2'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updatePrice(DataToedit, selectedProduct._id)}
                style={styles.exitModalButton}>
                <Text style={[styles.buttonText, {color: '#F68A72'}]}>Yes</Text>
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
    marginBottom: windowHeight * 0.015,
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
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    transform: 'scale(1.05)',
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
    marginVertical: 5,
    width: '100%',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: 'Poppins-Regular',

    fontSize: 16,
    color: '#fff',
    marginVertical: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  cardDescription: {},
  cardButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '20%',
    height: '123%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    top: 60,
    right: 20,
    borderRadius: 50,
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
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
    top: windowHeight * -0.1,
    backgroundColor: '#fefefe',
    borderRadius: 40,
  },
  cartContainer: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingLeft: 15,
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
    height: windowHeight * 0.35,
    backgroundColor: '#b3e0ff',
    justifyContent: 'center',
  },
  gradientButton: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 30,
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

  arrowIcon: {width: 40, resizeMode: 'contain'},

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
    marginBottom: 20,
    marginRight: 10,
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
    marginHorizontal: 3,
  },
  price: {
    color: '#FFD466',
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2,
    fontFamily: 'OriginalSurfer-Regular',
  },
  description: {
    color: '#666',
    fontSize: 16,

    fontFamily: 'OriginalSurfer-Regular',
    marginTop: 5,
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
  RadialEffect: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 30,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    marginTop: windowHeight * 0.1,
    alignSelf: 'center',
  },
  formSubTitle: {
    fontSize: 24,
    fontFamily: 'OriginalSurfer-Regular',
    color: '#383E44',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.02,
    alignSelf: 'flex-start',
  },
  input: {
    width: windowWidth * 0.7,
    paddingVertical: windowHeight * 0.025,
    paddingHorizontal: 30,
    borderRadius: 16,
    elevation: 10,
    backgroundColor: 'white',
    shadowColor: 'rgba(56, 62, 68, 1)',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    marginLeft: windowWidth * 0.1,
    fontSize: 20,
  },
  uploadButton: {marginLeft: windowWidth * 0.15},
  AlertmodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  AlertmodalContent: {
    elevation: 10,
    backgroundColor: 'white',
    shadowColor: '#0a0a0a',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height: windowHeight * 0.4,
    width: windowWidth * 0.75,
  },
  AlertmodalImage: {
    width: 41,
    height: 41,
    marginBottom: 10,
  },
  AlertmodalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#303030',
  },
  AlertmodalText: {
    fontSize: 20,
    marginVertical: '8%',
    color: '#000',
    lineHeight: windowHeight * 0.04,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  exitModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  Row: {flexDirection: 'row', alignItems: 'center'},
  inputModal: {
    width: windowWidth * 0.6,
    paddingVertical: windowHeight * 0.025,
    paddingHorizontal: 30,
    borderRadius: 16,
    elevation: 6,
    backgroundColor: 'white',
    shadowColor: 'rgba(56, 62, 68, 1)',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  likedBox: {
    flexDirection: 'row',
  },
});

export default AdminStore;
