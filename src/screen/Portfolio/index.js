import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  BackHandler,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Images from '../../common/assets/images/index'
import Fonts from '../../common/assets/fonts/index'
import {APICaller} from '../../util/apiCaller'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Dash from 'react-native-dash'
import Menu from '../../common/component/navDrawer'
const SideMenu = require('react-native-side-menu').default
export default class PortFolio extends Component {
  constructor (props) {
    super(props)
    let t = this
    this.state = {
      token: '',
      isOpen: false,
    }
    this.toggle = this.toggle.bind(this)
  }
  componentDidMount () {
    let t = this
    AsyncStorage.getItem('authToken').then(value => {
      value = JSON.parse(value)
      if (value != null) {
        t.setState({token: value.token})
        t.checkSubscription()
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButton.bind(this),
        )
      } else {
        t.props.navigation.navigate('Login')
      }
    })
  }
  handleBackButton () {
    BackHandler.exitApp()
  }
  checkSubscription () {
    let t = this
    APICaller('users/check-subscription/', 'Get', null, t.state.token).then(
      function (res) {
        if (res.status != 'active') {
          t.props.navigation.navigate('PriceList')
        }
      },
    )
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  updateMenuState (isOpen) {
    this.setState({isOpen})
  }
  navigateTredingPortfolio (keyVal) {
    let t = this
    t.props.navigation.navigate('TredingPortfolio', { keyVal: keyVal})
    // console.log(keyVal)
  }

  render () {
    return (
      <SideMenu
        menu={<Menu />}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}>
        <ScrollView style={styles.container}>
          <View style={styles.head}>
            <View style={styles.rhead}>
              <TouchableOpacity style={{width: 20}} onPress={this.toggle}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={Images.menu}
                />
              </TouchableOpacity>
              <Text style={styles.screenName}>PORTFOLIO</Text>
            </View>
            <View style={styles.rhead}>
              <Pressable
                style={styles.rhead}
                onPress={() => this.props.navigation.navigate('UserProfile')}>
                <Icon
                  name='user-circle'
                  size={22}
                  color='#7b788a'
                  style={{paddingHorizontal: 15, alignSelf: 'center'}}
                />
              </Pressable>
              <Icon
                name='bell'
                size={22}
                color='#7b788a'
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 15,
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              style={styles.sellbtn}
              onPress={() => this.navigateTredingPortfolio('sell')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 17,
                  fontFamily: Fonts.type.RubikMedium,
                }}>
                Sell Transaction
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buybtn}
              onPress={() => this.navigateTredingPortfolio('buy')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 17,
                  fontFamily: Fonts.type.RubikMedium,
                }}>
                Buy Transaction
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SideMenu>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E0B1A',
  },
  keyConSymbol: {
    fontSize: 12,
    color: '#fff',
    width: 70,
    paddingVertical: 15,
  },
  symbol: {
    fontSize: 13,
  },
  price: {
    fontSize: 13,
    color: '#fff',
  },
  qty: {
    fontSize: 13,
    color: '#fff',
  },
  date: {
    fontSize: 12,
    color: '#fff',
  },

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
  marketTd: {
    backgroundColor: '#1A152A',
    marginHorizontal: 10,
    borderRadius: 4,
  },
  keyState: {
    backgroundColor: '#1A152A',
    margin: 10,
    borderRadius: 4,
  },

  mrktC: {
    width: '100%',
    borderBottomColor: '#fff',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderRadius: 1,
    flexDirection: 'row',
  },
  mrktCt: {
    flexDirection: 'row',
  },
  mrktO: {
    width: '50%',
    borderRightColor: '#fff',
    borderStyle: 'dashed',
    borderRightWidth: 1,
    borderRadius: 1,
    padding: 15,
  },
  mrktT: {
    width: '50%',
    padding: 15,
  },
  mrktTH: {
    width: '50%',
    borderRightColor: '#fff',
    borderStyle: 'dashed',
    borderRightWidth: 1,
    borderRadius: 1,
    padding: 15,
  },
  mrktF: {
    width: '50%',
    padding: 15,
  },
  mrktName: {
    color: '#0AA793',
    marginLeft: 10,
    fontSize: 13,
  },
  marktPrice: {
    color: '#fff',
    fontSize: 18,
  },
  mrktUD: {
    color: 'green',
    marginLeft: 5,
    fontSize: 13,
  },
  keyCon: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  keyStateList: {
    backgroundColor: '#1A152A',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  borderKeylist: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.2,
  },

  keyConLTPText: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'right',
  },
  buybtn: {
    backgroundColor: '#0aa793',
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '50%',
    borderRadius: 10,
    marginVertical: 5,
  },
  sellbtn: {
    backgroundColor: '#de4c4c',
    width: '50%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
})
