import React, {Component} from 'react'
import {
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import Fonts from '../../common/assets/fonts/index'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Menu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'Home',
    }
  }
  navClick (nav) {
    let t = this
    t.setState({tab: nav})
    console.log(t.state.tab)
    // t.props.navigation.navigate(Home)
  }
  logout(){
    let t = this
    AsyncStorage.removeItem('authToken');
  }

  render () {
    return (
      <ScrollView scrollsToTop={false} style={{backgroundColor: '#0b091c'}}>
        <View style={styles.sideMenuContainer}>
          {/*<Image source={{uri:'https://reactnativecode.com/wp-content/uploads/2017/10/Guitar.jpg',}} style={styles.sideMenuProfileIcon}/>

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#e2e2e2',
              marginVertical: 20,
            }}
          />*/}

          <View style={{width: '100%'}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  this.state.tab == 'Home' ? '#211c37' : '#0b091c',
                padding: 10,
                borderRadius: 8,
                marginHorizontal: 5,
              }}
              onPress={() => this.navClick('Home')}>
              <Icon
                name='home'
                size={22}
                color='#7b788a'
                style={styles.sideMenuIcon}
              />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  this.state.tab == 'Search' ? '#211c37' : '#0b091c',
                padding: 10,
                borderRadius: 8,
                marginHorizontal: 5,
              }}
              onPress={() => this.navClick('Search')}>
              <Icon
                name='search'
                size={22}
                color='#7b788a'
                style={styles.sideMenuIcon}
              />
              <Text style={styles.menuText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  this.state.tab == 'Portfolio' ? '#211c37' : '#0b091c',
                padding: 10,
                borderRadius: 8,
                marginHorizontal: 5,
              }}
              onPress={() => this.navClick('Portfolio')}>
              <Icon
                name='pie-chart'
                size={22}
                color='#7b788a'
                style={styles.sideMenuIcon}
              />
              <Text style={styles.menuText}>Portfolio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  this.state.tab == 'Watchlist' ? '#211c37' : '#0b091c',
                padding: 10,
                borderRadius: 8,
                marginHorizontal: 5,
              }}
              onPress={() => this.navClick('Watchlist')}>
              <Icon
                name='list-alt'
                size={22}
                color='#7b788a'
                style={styles.sideMenuIcon}
              />
              <Text style={styles.menuText}>Watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  this.state.tab == 'Watchlist' ? '#211c37' : '#0b091c',
                padding: 10,
                borderRadius: 8,
                marginHorizontal: 5,
              }}
              onPress={() => this.logout()}>
              <Icon
                name='list-alt'
                size={22}
                color='#7b788a'
                style={styles.sideMenuIcon}
              />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/*<View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#e2e2e2',
                marginTop: 15,
              }}
            />*/}
          </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0b091c',
    alignItems: 'center',
    paddingTop: 20,
  },

  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },

  sideMenuIcon: {
    marginRight: 10,
    marginLeft: 20,
    alignSelf: 'center',
    alignContent: 'center',
  },

  menuText: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
    fontFamily: Fonts.type.Rubik,
  },
})
