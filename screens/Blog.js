import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import RadialGradient from 'react-native-radial-gradient';
import {url} from '../url';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostImage, setNewPostImage] = useState({});
  const [selectedPost, setSelectedPost] = useState({
    title: '',
    contents: '',
    image: {url: ''},
    likes: [],
    date: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [Current, setCurrent] = useState({});

  const addPost = async () => {
    if (newPostTitle && newPostDescription && newPostImage) {
      const newPost = {
        title: newPostTitle,
        contents: newPostDescription,
        image: newPostImage,
        author: Current,
      };

      await createPost(newPost);
      setNewPostTitle('');
      setNewPostDescription('');
      setNewPostImage({});
      await getPostes();
      setModalVisible(false);
    }
  };

  const createPost = async newPost => {
    try {
      await axios.post(`${url}/api/comment/`, newPost);
    } catch (error) {
      console.log(error);
    }
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
        setNewPostImage(response.data.image);
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPostes();
    console.log(posts);
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

  const getPostes = async () => {
    try {
      let postsData = await axios.get(`${url}/api/comment/`);
      setPosts(postsData.data.CommentList);
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async post => {
    try {
      await axios.put(`${url}/api/comment/${post._id}`, {
        ...post,
        likes: [...post.likes, Current._id],
      });
      await getPostes();
    } catch (error) {
      console.log(error);
    }
  };
  const UnlikePost = async post => {
    try {
      await axios.put(`${url}/api/comment/${post._id}`, {
        ...post,
        likes: post.likes.filter(e => e !== Current._id),
      });
      await getPostes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Blog</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          maxHeight: windowHeight * 0.75,
        }}>
        {posts &&
          posts.map(post => (
            <View key={post._id} style={styles.postCard}>
              <View style={styles.Content}>
                <View style={styles.postHeader}>
                  <Text style={styles.cardTitle}>
                    {post.title.length > 15
                      ? post.title.slice(0, 10).concat('...')
                      : post.title}
                  </Text>

                  <View style={styles.LikeAndPriceContainer}>
                    <Text style={styles.cardDate}>
                      {post.date.slice(0, 10)}
                    </Text>
                    <View style={styles.LikeContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          post.likes.includes(Current._id)
                            ? UnlikePost(post)
                            : likePost(post);
                        }}>
                        <Image
                          style={styles.likeIcon}
                          source={
                            post.likes.includes(Current._id)
                              ? require('../assets/icons/FullHeart.png')
                              : require('../assets/icons/heart.png')
                          }
                        />
                      </TouchableOpacity>
                      <Text style={styles.likedValue}>{post.likes.length}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.cardDescription}>
                  {post.contents.split('\n').length >= 1
                    ? post.contents.split('\n')[0]
                    : post.contents.length > 30
                    ? post.contents.slice(0, 20).concat('...')
                    : post.contents}
                </Text>
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => {
                    setSelectedPost(post);
                    setModalInfoVisible(true);
                  }}>
                  <Text style={styles.seeMoreButtonText}>see More {'>'}</Text>
                </TouchableOpacity>
              </View>

              <Image
                source={{uri: `${url}${post.image.url}`}}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addPost}
        onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={['#0094B4', '#00DAF8']}
          start={{x: 0, y: 0.5}}
          end={{x: 0.5, y: 1}}
          style={{
            /*width: '100%',
            height: '100%',
            alignItems: 'center',*/
            justifyContent: 'center',
            backgroundColor: '#5AC2E3',
          }}>
          <Text style={styles.addPostText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Post</Text>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={newPostTitle}
            onChangeText={setNewPostTitle}
          />
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[
              styles.input,
              {height: windowHeight * 0.2, textAlignVertical: 'top'},
            ]}
            value={newPostDescription}
            onChangeText={setNewPostDescription}
            multiline
          />
          <View style={styles.aploadContainer}>
            <Text style={styles.label}>Upload Photo</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}>
              <Image
                source={require('../assets/icons/aploadImagePostIcon.png')}
              />
            </TouchableOpacity>
          </View>
          {newPostImage && (
            <Image
              source={{uri: `${url}${newPostImage.url}`}}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'cover',
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          )}
          {/* '#5AC2E3', '#4698BD', '#3C84AC' */}
          <TouchableOpacity style={styles.reserveButton} onPress={addPost}>
            <LinearGradient
              colors={['#00D9F7', '#0094B4']}
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 0.9}}
              style={[styles.RadialEffect, {backgroundColor: '#4698BD'}]}>
              <Text style={styles.buttonText}>Add Post</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setModalVisible(false)}>
            <Image
              style={styles.arrowIcon}
              source={require('../assets/icons/fleche.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={modalInfoVisible}
        animationType="slide"
        onRequestClose={() => setModalInfoVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedPost.title}</Text>
          <View style={[styles.LikeAndPriceContainer, {alignSelf: 'flex-end'}]}>
            <Text style={styles.cardDate}>
              {selectedPost.date.slice(0, 10)}
            </Text>
            <View style={styles.LikeContainer}>
              <TouchableOpacity
                onPress={() => {
                  selectedPost.likes.includes(Current._id)
                    ? (UnlikePost(selectedPost),
                      setSelectedPost({
                        ...selectedPost,
                        likes: selectedPost.likes.filter(
                          e => e !== Current._id,
                        ),
                      }))
                    : (likePost(selectedPost),
                      setSelectedPost({
                        ...selectedPost,
                        likes: [...selectedPost.likes, Current._id],
                      }));
                }}>
                <Image
                  style={styles.likeIcon}
                  source={
                    selectedPost && selectedPost.likes.includes(Current._id)
                      ? require('../assets/icons/FullHeart.png')
                      : require('../assets/icons/heart.png')
                  }
                />
              </TouchableOpacity>
              <Text style={styles.likedValue}>{selectedPost.likes.length}</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>{selectedPost.contents}</Text>
          <Image
            source={{uri: `${url}${selectedPost.image.url}`}}
            style={[
              styles.cardImage,
              {
                borderRadius: 20,
                maxWidth: windowWidth * 0.9,
                maxHeight: windowHeight * 0.6,
              },
            ]}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.close}
            onPress={() => setModalInfoVisible(false)}>
            <Image
              style={styles.arrowIcon}
              source={require('../assets/icons/fleche.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  heading: {
    color: '#383E44',
    fontFamily: 'Poppins-Bold',
    fontSize: 46,
    alignSelf: 'flex-start',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: windowHeight * 0.04,
  },
  postCard: {
    alignSelf: 'center',
    maxHeight: windowHeight * 0.5,
    width: windowWidth * 0.8,
    borderRadius: 20,
    position: 'relative',
    marginVertical: 20,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: '65%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  Content: {},
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  cardTitle: {
    color: '#383E44',
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    width: '70%',
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
    padding: 10,
    lineHeight: 24,
  },
  seeMoreButton: {position: 'absolute', right: 10, bottom: 8},
  seeMoreButtonText: {
    color: '#3C84AC',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#383E44',
    marginBottom: 5,
  },
  LikeAndPriceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  LikeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  likeIcon: {height: windowWidth * 0.07, width: windowWidth * 0.07, top: 2},
  likedValue: {
    fontFamily: 'Poppins-Bold',
    color: '#383E44',
    fontSize: 26,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,

    backgroundColor: '#FAFAFA',
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    color: '#000',
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.07,
  },
  label: {
    fontFamily: 'Poppins-Bold',
    color: '#383E44',
    fontSize: 30,
    marginRight: 20,
  },
  input: {
    width: windowWidth * 0.8,
    alignSelf: 'center',
    height: windowHeight * 0.07,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#383E44',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
    color: '#000',
    marginVertical: 20,
  },
  addPost: {
    width: windowWidth * 0.17,
    height: windowWidth * 0.17,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
    elevation: 10,
    bottom: 90,
    alignSelf: 'center',
  },
  addPostText: {
    color: '#fff',
    height: '100%',
    fontSize: 46,
    paddingTop: 5,
    textAlign: 'center',
  },
  close: {position: 'absolute', top: 60, left: 20},
  arrowIcon: {width: 40, resizeMode: 'contain'},
  aploadContainer: {flexDirection: 'row'},
  reserveButton: {
    borderRadius: 15,
    width: '50%',
    height: windowHeight * 0.09,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
    marginTop: windowHeight * 0.02,
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
    fontFamily: 'Poppins-Bold',
  },
});

const blogData = [];

export default Blog;
