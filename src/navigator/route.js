import 'react-native-gesture-handler'
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack'
import HomeScreen from '../screen/Home'
import SearchScreen from '../screen/Search'
import PortfolioScreen from '../screen/Portfolio'
import WatchlistScreen from '../screen/Watchlist'
import LoginScreen from '../screen/Login'
import SignupScreen from '../screen/Signup'
import QuoteScreen from '../screen/Quote'
import ManageWatchlistScreen from '../screen/ManageWatchlist'
import forgotPasswordScreen from '../screen/forgotPassword'
import userProfileScreen from '../screen/UserProfile'
import EditProfileScreen from '../screen/EditProfile'
import ChangePasswordScreen from '../screen/ChangePassword'
// import SubscriptionScreen from '../screen/Subscription'
import PriceListScreen from '../screen/PriceList'
import TrendingPortfolioScreen from '../screen/TredingPortfolio'
 import KeyStatsScreen from '../screen/KeyStats'
const HomeTab = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {headerShown: false},
  },
});
const SearchTab = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: {headerShown: false},
  },
});
const PortfolioTab = createStackNavigator({
  Portfolio: {
    screen: PortfolioScreen,
    navigationOptions: {headerShown: false},
  },
});
const WatchlistTab = createStackNavigator({
  Watchlist: {
    screen: WatchlistScreen,
    navigationOptions: {headerShown: false},
  },
});
 

module.exports = {
  LoginScreen,
  SignupScreen,
  QuoteScreen,
  ManageWatchlistScreen,
  HomeTab,
  SearchTab,
  PortfolioTab,
  WatchlistTab,
  forgotPasswordScreen,
  userProfileScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  // SubscriptionScreen,
  PriceListScreen,
  TrendingPortfolioScreen,
  KeyStatsScreen
};
