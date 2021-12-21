import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native'
import Fonts from '../../common/assets/fonts/index'
import Icon from 'react-native-vector-icons/FontAwesome'
import Images from '../../common/assets/images/index'
import {APICaller} from '../../util/apiCaller'
import {Storage} from '../../util/storage'
import GlobalVar from '../../global'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-root-toast'
export default class PriceList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plan: '',
      token: '',
    }
  }
  componentDidMount () {
    let t = this
    AsyncStorage.getItem('authToken').then(value => {
      value = JSON.parse(value)
      console.log(value)
      if (value != null) {
        t.setState({token: value.token})
      }
      else{
        t.props.navigation.navigate('Login')
      }
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }
  handleBackButton () {
    Toast.show('', Toast.SHORT)
    return true
  }
 
  getSelectedPlan (plan) {
    let t = this
    let today = new Date()
    let expiryData = ''
    if (plan == 1) {
      today.setDate(today.getDate() + 7)
      expiryData = GlobalVar.dateToYMD(today)
      console.log(expiryData)
    } else if (plan == 2) {
      today.setDate(today.getDate() + 30)
      expiryData = GlobalVar.dateToYMD(today)
      console.log(expiryData)
    }

    let data = {
      plan: plan,
      expiry: expiryData,
      token_in_header: expiryData,
    }
    APICaller('users/create-subscription/', 'post', data, t.state.token).then(
      function (res) {
        console.log('from Price list', res)
        if (res.status) {
          t.props.navigation.goBack()
        }
      },
    )
  }
  render () {
    return (
      <View style={{backgroundColor: '#0E0B1A', flex: 1}}>
        <View style={styles.head}>
          <View style={styles.rhead}>
            <Text style={styles.screenName}>Choose a plan for you</Text>
          </View>
        </View>
        <View style={{marginVertical: 20}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#1a152a',
              marginVertical: 20,
              paddingVertical: 20,
              marginHorizontal: 15,
              borderRadius: 20,
            }}
            onPress={() => this.getSelectedPlan(1)}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: Fonts.type.RubikMedium,
                  fontSize: 25,
                  marginLeft: -50,
                }}>
                Free Trial
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  color: '#0aa793',
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
                  textAlign: 'center',
                  fontFamily: Fonts.type.RubikBold,
                  fontSize: 40,
                  textTransform: 'capitalize',
                }}>
                0
              </Text>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: 10,
                  fontFamily: Fonts.type.RubikBold,
                  alignSelf: 'flex-end',
                  position: 'relative',
                  top: -5,
                }}>
                /for upto 14 days
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.getSelectedPlan(2)}
            style={{
              backgroundColor: '#1a152a',
              paddingVertical: 20,
              marginHorizontal: 15,
              borderRadius: 20,
              marginVertical: 20,
            }}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: Fonts.type.RubikMedium,
                  fontSize: 25,
                  marginLeft: -50,
                }}>
                Standard
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  color: '#0aa793',
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
                  textAlign: 'center',
                  fontFamily: Fonts.type.RubikBold,
                  fontSize: 40,
                  textTransform: 'capitalize',
                }}>
                50
              </Text>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: 10,
                  fontFamily: Fonts.type.RubikBold,
                  alignSelf: 'flex-end',
                  position: 'relative',
                  top: -5,
                }}>
                /for upto 14 days
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1A152A',
  },
  rhead: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  screenName: {
    paddingHorizontal: 10,
    color: '#fff',
    fontFamily: Fonts.type.RubikBold,
    fontSize: 17,
    alignSelf: 'center',
  },

  container: {
    backgroundColor: '#0E0B1A',
  },
})
