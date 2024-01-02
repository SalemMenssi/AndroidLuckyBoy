import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Animated, Dimensions} from 'react-native';
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
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Profil"
        component={Profile}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Store"
        component={Store}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Blog"
        component={Blog}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Reserve"
        component={Reservation}
        options={{tabBarLabel: () => null}}
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
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Reservation-Stat"
        component={ReservationAdmin}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Events"
        component={EventAdmin}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Services"
        component={ServicesAdmin}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Store"
        component={AdminStore}
        options={{tabBarLabel: () => null}}
      />
      <Tab.Screen
        name="Blog"
        component={Blog}
        options={{tabBarLabel: () => null}}
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
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
