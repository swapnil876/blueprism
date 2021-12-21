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

import Menu from '../../common/component/navDrawer'
const SideMenu = require('react-native-side-menu').default
export default class keyState extends Component {
  constructor (props) {
    super(props)
    let t = this
    this.state = {
      token: '',
      isOpen: false,
      topData: [],

      keyVal: 'gain',
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
        BackHandler.addEventListener('hardwareBackPress', () =>
          this.props.navigation.goBack(),
        )
        this.callFunction(this.state.keyVal)
      } else {
        t.props.navigation.navigate('Login')
      }
    })
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    )
  }
  checkSubscription () {
    let t = this
    // console.log('*********',t.state.token);
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

  callFunction (keyVal) {
    if (keyVal == 'gain') {
      this.setState({keyVal: keyVal})
      
      this.topGainers()
    } else {
      this.setState({keyVal: keyVal})
     
      this.topLooser()
    }
  }

  topGainers () {
    let t = this
    fetch(
      'https://mboum.com/api/v1/co/collections/?list=day_gainers&start=1&apikey=AZcVmnWTTChpdaFCodmkElNTyYdDT9bMrx6HvOwDX5n3S0U9DDOdeQPyl6wa',
      {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: '',
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        const limit = 5
        const newArray = responseJson.quotes.slice(0, limit)
        t.setState({topData: newArray})
      })
  }

  topLooser () {
    let t = this
    fetch(
      'https://mboum.com/api/v1/co/collections/?list=day_losers&start=1&apikey=AZcVmnWTTChpdaFCodmkElNTyYdDT9bMrx6HvOwDX5n3S0U9DDOdeQPyl6wa',
      {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: '',
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let limit = 5
        const newArray = responseJson.quotes.slice(0, limit)
        t.setState({topData: newArray})
      })
      .catch(err => {
        // console.log(err)
      })
  }
  getSingleStockData (data) {
    let t = this
    t.props.navigation.navigate('Quote', {
      singleData: data,
    })
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
              <Text style={styles.screenName}>EQUITY</Text>
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
          <View>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[
                  styles.keyState,
                  this.state.keyVal=='gain' ? styles.keyStateActive : '',
                ]}
                onPress={() => this.callFunction('gain')}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#fff',
                    padding: 10,
                    textAlign: 'center',
                  }}>
                  Top Gainers
                </Text>
              </Pressable>
              <Pressable
                 style={[
                    styles.keyState,
                    this.state.keyVal=='loose' ? styles.keyStateActive : '',
                  ]}
                onPress={() => this.callFunction('loose')}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#fff',
                    padding: 10,
                    textAlign: 'center',
                  }}>
                  Top Losers
                </Text>
              </Pressable>
            </View>

            <View style={styles.keyCon}>
              <Text style={styles.keyConSymbol}>Symbol</Text>
              <Text style={styles.keyConVol}>Volume</Text>

              <View style={styles.keyConLTP}>
                <Text style={styles.keyConLTPText}>LTP</Text>
                <View>
                  <Text style={styles.keyConLTPText}>Chg(Chg %)</Text>
                </View>
              </View>
            </View>

            {this.state.topData.map((res, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.keyStateList, styles.borderKeylist]}
                onPress={() => this.getSingleStockData(res)}>
                <Text style={styles.keyConSymName}>{res.symbol}</Text>
                <Text style={styles.keyConVolPrice}>1.10Cr</Text>
                <View style={{padding: 10, paddingRight: 15}}>
                  <Text style={styles.keyConLTPText}>
                    {res.regularMarketVolume}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Icon name='caret-up' size={12} color='green' />
                    <Text style={styles.mrktUD}>195.07</Text>
                    <Text style={styles.mrktUD}>(0.07%)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    fontSize: 11,
    color: '#fff',
    padding: 10,
    paddingRight: 70,
  },
  keyConSymName: {
    fontSize: 13,
    color: '#fff',
    padding: 10,
    width: 120,
  },
  keyConVol: {
    fontSize: 11,
    color: '#fff',
    padding: 10,
    paddingRight: 30,
  },
  keyConVolPrice: {
    fontSize: 13,
    color: '#fff',
    padding: 10,
    paddingRight: 30,
  },
  keyConLTP: {
    padding: 10,
    paddingLeft: 30,
  },
  keyConLTPText: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'right',
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
    width: '50%',
  },
  keyStateActive: {
    borderBottomWidth: 1,
    borderColor: '#fff',
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
    fontSize: 10,
  },
  keyCon: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  keyStateList: {
    backgroundColor: '#1A152A',
    flexDirection: 'row',
    marginHorizontal: 10,
    // borderBottomColor:'#ccc',
    // borderWidth:.2
  },
  borderKeylist: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.2,
  },
})
