import 'react-native-gesture-handler'
import React, {Component} from 'react'
import {View, Image, TouchableOpacity, Text, Easing} from 'react-native'
import Animated, {useAnimatedStyle} from 'react-native-reanimated'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'

import {
  HomeTab,
  SearchTab,
  PortfolioTab,
  WatchlistTab,
  LoginScreen,
  SignupScreen,
  QuoteScreen,
  ManageWatchlistScreen,
  forgotPasswordScreen,
  userProfileScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  // SubscriptionScreen,
  PriceListScreen,
  TrendingPortfolioScreen,
  KeyStatsScreen
} from './route'

// import success from '../common/assets/images/success.json';
const TabNavigation = createMaterialTopTabNavigator(
  {
    Home: {
      screen: HomeTab,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#fff',
                }}>
                Home
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#7b788a',
                }}>
                Home
              </Text>
            ),
          tabBarVisible:
            navigation.state.params && navigation.state.params.tabBarVisible,
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon
                name='home'
                color={'#fff'}
                size={20}
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Icon
                name='home'
                color='#7b788a'
                size={20}
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ),
          swipeEnabled: false,
        }
      },
    },
    Search: {
      screen: SearchTab,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#fff',
                }}>
                Search
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#7b788a',
                }}>
                Search
              </Text>
            ),
          tabBarVisible:
            navigation.state.params && navigation.state.params.tabBarVisible,
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon
                name='search'
                size={20}
                color='#fff'
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Icon
                name='search'
                size={20}
                color='#7b788a'
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ),
          swipeEnabled: false,
        }
      },
    },
    Portfolio: {
      screen: PortfolioTab,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#fff',
                }}>
                Portfolio
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#7b788a',
                }}>
                Portfolio
              </Text>
            ),
          tabBarVisible:
            navigation.state.params && navigation.state.params.tabBarVisible,
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon
                name='pie-chart'
                size={20}
                color='#fff'
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Icon
                name='pie-chart'
                size={20}
                color='#7b788a'
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ),
          swipeEnabled: false,
        }
      },
    },
    Watchlist: {
      screen: WatchlistTab,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#fff',
                }}>
                Watchlist
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  color: '#7b788a',
                }}>
                Watchlist
              </Text>
            ),
          tabBarVisible:
            navigation.state.params && navigation.state.params.tabBarVisible,
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon
                name='list-alt'
                size={20}
                color='#fff'
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Icon
                name='list-alt'
                size={20}
                color='#7b788a'
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              />
            ),
          swipeEnabled: false,
        }
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: '#fff',
      },
      tabStyle: {
        padding: 5,
      },
      showIcon: true,
      style: {backgroundColor: '#211C37'},
      activeTintColor: '#FF6F6F',
      pressColor: '#FF6F6F',
      swipeEnabled: false,
      animationEnabled: true,
      keyboardHidesTabBar: true,
      gesturesEnabled: false,
    },
    lazy: true,
    initialRouteName: 'Home',
    initialRouteParams: {transition: 'fade'},
  },
)

const AppNavigation = createStackNavigator(
  {
    // Subscription:{
    //   screen: SubscriptionScreen,
    //   navigationOptions: {
    //     headerShown: false,
    //   },
    // },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    forgotPassword: {
      screen: forgotPasswordScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    EditProfile: {
      screen: EditProfileScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    TabHome: {
      screen: TabNavigation,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
        gestureEnabled: false,
        swipeEnabled: false,
      }),
    },
    UserProfile: {
      screen: userProfileScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Quote: {
      screen: QuoteScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    TredingPortfolio:{
      screen: TrendingPortfolioScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ManageWatchlist: {
      screen: ManageWatchlistScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    PriceList: {
      screen: PriceListScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    keyState: {
      screen: KeyStatsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    navigationOptions: {
      gestureEnabled: false,
      headerVisible: false,
      swipeEnabled: false,
      animationEnabled: true,
      keyboardHidesTabBar: true,
    },
    headerMode: 'screen',
    // transitionConfig,
  },
)

export default createAppContainer(AppNavigation)
