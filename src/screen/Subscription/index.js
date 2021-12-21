import React from 'react'
import {StyleSheet, View, Text, StatusBar, TouchableOpacity} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import Fonts from '../../common/assets/fonts/index'
import Icon from 'react-native-vector-icons/FontAwesome'
const slides = [
  {
    key: 1,
    title: 'Free',
    Price: '0',
    text:
      'Have a try at the worlds most powerful & user-friendly Investing planer application available now !',
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Standard',
    Price: '50',
    text:
      'Have a try at the worlds most powerful & user-friendly Investing planer application available now !',
    backgroundColor: '#febe29',
  },
]

export default class Subscription extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showRealApp: false,
    }
  }
  _renderItem = ({item}) => {
    return (
      <View style={{backgroundColor: '#1a152a', flex: 1}}>
        {/* <StatusBar barStyle='dark-content' hidden={false} translucent={true} /> */}
        <Text
          style={{
            color: '#fff',
            marginVertical: 30,
            textAlign: 'center',
            alignSelf: 'center',
            fontFamily: Fonts.type.RubikMedium,
            fontSize: 25,
            textTransform: 'uppercase',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontFamily: Fonts.type.Rubik,
            fontSize: 15,
            paddingHorizontal: 12,
            textTransform: 'capitalize',
            opacity: 0.5,
          }}>
          {item.text}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text
            style={{
              color: '#0aa793',
              marginTop: 40,
              textAlign: 'center',
              fontFamily: Fonts.type.RubikBold,
              textTransform: 'capitalize',
              fontSize: 38,
            }}>
            $
          </Text>
          <Text
            style={{
              color: '#0aa793',
              marginTop: 40,
              textAlign: 'center',
              fontFamily: Fonts.type.RubikBold,
              fontSize: 40,
              textTransform: 'capitalize',
            }}>
            {item.Price}
          </Text>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontSize: 10,
              fontFamily: Fonts.type.RubikBold,
              textTransform: 'capitalize',
              alignSelf: 'flex-end',
              position: 'relative',
              top: -5,
            }}>
            /month
          </Text>
        </View>
        <View style={{marginTop: 70, paddingHorizontal: 20}}>
          <View
            style={{
              padding: 8,
              flexDirection: 'row',
            }}>
            <Icon name='check-circle' size={20} color='#7b788a' />
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontFamily: Fonts.type.RubikMedium,
                textTransform: 'capitalize',

                marginHorizontal: 15,
              }}>
              Unlimted Listings
            </Text>
          </View>
          <View
            style={{
              padding: 8,
              flexDirection: 'row',
            }}>
            <Icon name='check-circle' size={20} color='#7b788a' />
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontFamily: Fonts.type.RubikMedium,
                textTransform: 'capitalize',
                marginHorizontal: 15,
              }}>
              1 account
            </Text>
          </View>
          <View
            style={{
              padding: 8,
              flexDirection: 'row',
              alignSelf: 'flex-start',
            }}>
            <Icon name='check-circle' size={20} color='#7b788a' />
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontFamily: Fonts.type.RubikMedium,
                textTransform: 'capitalize',
                marginHorizontal: 15,
              }}>
              Simple analytics
            </Text>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: '15%',
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>Let's Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  _onDone = () => {
    this.setState({showRealApp: true})
  }
  render () {
    if (this.state.showRealApp) {
      return <Subscription />
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtn: {
    width: '90%',
    backgroundColor: '#0AA793',
    borderRadius: 7,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,

    textShadowColor: '#0AA793',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 15,
    elevation: 50,

    shadowColor: '#0AA793',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
  },
})
