import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Animated, Dimensions, Image} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SignIn,
  SignUp,
  Store,
  ReservationHistory,
  Blog,
  Profile,
  Reservation,
  Home,
  Chart,
  ReservationAdmin,
  AdminStore,
  EventAdmin,
  Loading,
  ServicesAdmin,
} from './screens';
import messaging from '@react-native-firebase/messaging';

const {height, width} = Dimensions.get('window');
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const User = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Event') {
            iconName = 'star-o';
          } else if (route.name === 'Profil') {
            iconName = 'user-o';
          } else if (route.name === 'Blog') {
            iconName = 'wechat';
          } else if (route.name === 'Store') {
            iconName = 'shopping-bag';
          } else if (route.name === 'Reserve') {
            iconName = 'calendar-o';
          } else if (route.name === 'Service') {
            iconName = 'calendar';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3C84AC',

        tabBarInactiveTintColor: '#383E44',
        tabBarStyle: {
          position: 'absolute',
          elevation: 50,
          shadowOffset: {
            width: 0,
            height: 15,
          },
          shadowOpacity: 1,
          shadowRadius: 16.0,
          shadowColor: '#000',
          borderTopLeftRadius: 21,
          borderTopRightRadius: 21,
          backgroundColor: '#fff',
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          height: 75,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Event"
        component={ReservationHistory}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activstar.png')
                    : require('./assets/TapBarIcon/star.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Reserve"
        component={Reservation}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activscheduel.png')
                    : require('./assets/TapBarIcon/scheduel.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Store"
        component={Store}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activchart.png')
                    : require('./assets/TapBarIcon/chart.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Blog"
        component={Blog}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activblog.png')
                    : require('./assets/TapBarIcon/blog.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profil"
        component={Profile}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activprofile.png')
                    : require('./assets/TapBarIcon/profile.png')
                }
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Admin = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Chart') {
            iconName = 'bar-chart';
          } else if (route.name === 'Reservation-Stat') {
            iconName = 'calendar-o';
          } else if (route.name === 'Blog') {
            iconName = 'wechat';
          } else if (route.name === 'Store') {
            iconName = 'shopping-bag';
          } else if (route.name === 'Events') {
            iconName = 'star-o';
          } else iconName = 'star';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3C84AC',

        tabBarInactiveTintColor: '#383E44',
        tabBarStyle: {
          position: 'absolute',
          elevation: 50,
          shadowOffset: {
            width: 0,
            height: 15,
          },
          shadowOpacity: 1,
          shadowRadius: 16.0,
          shadowColor: '#000',
          borderTopLeftRadius: 21,
          borderTopRightRadius: 21,
          backgroundColor: '#fff',
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          height: 75,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Chart"
        component={Chart}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activcart.png')
                    : require('./assets/TapBarIcon/cart.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Reservation-Stat"
        component={ReservationAdmin}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activscheduel.png')
                    : require('./assets/TapBarIcon/scheduel.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventAdmin}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activevent.png')
                    : require('./assets/TapBarIcon/event.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesAdmin}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size + 1, height: size + 1, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activservice.png')
                    : require('./assets/TapBarIcon/service.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Store"
        component={AdminStore}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activchart.png')
                    : require('./assets/TapBarIcon/chart.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Blog"
        component={Blog}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./assets/TapBarIcon/activblog.png')
                    : require('./assets/TapBarIcon/blog.png')
                }
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Home">
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

const App = () => {
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  messaging().onMessage(async remoteMessage => {
    console.log('FCM Message Data:', remoteMessage.data);

    try {
      const notifications = JSON.parse(
        (await AsyncStorage.getItem('notifs')) || '[]',
      );

      const newNotificationArray = JSON.stringify([
        ...notifications,
        remoteMessage.notification,
      ]);

      await AsyncStorage.setItem('notifs', newNotificationArray);
      Toast.show({
        type: 'success', // You can customize the type
        text1: 'New Notification',
        text2: remoteMessage.notification.body,
      });
      console.log(
        'Notification data saved to AsyncStorage',
        remoteMessage.notification,
      );
    } catch (error) {
      console.error('Error saving notification data to AsyncStorage:', error);
    }
  });
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // Save the notification data to AsyncStorage or handle as needed
  });

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
