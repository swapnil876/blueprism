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
import {Storage} from '../../util/storage'
export default class UserProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      token: '',
      userData: {},
    }
  }
  componentWillMount () {
    let t = this
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    )
    AsyncStorage.getItem('authToken').then(value => {
      value = JSON.parse(value)
      if (value != null) {
        t.setState({token: value.token})
        t.getUserProfile()
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
  getUserProfile () {
    let t = this
    APICaller('users/get-profile/', 'get', null, this.state.token).then(
      function (res) {
        console.log('from Login', res)
        if (res) {
          t.setState({userData:res})
        }
      },
    )
  }
  editProfile () {
    let t = this
    t.props.navigation.navigate('EditProfile')
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View style={styles.head}>
            <View style={styles.rhead}>
              <TouchableOpacity
                style={{width: 20}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-left' size={20} color='#7b788a' />
              </TouchableOpacity>

              <Text style={styles.screenName}>My Profile</Text>
            </View>
          </View>

          <View style={styles.keyState}>
            <View>
              <Icon
                name='user-circle'
                size={35}
                color='#7b788a'
                style={{paddingHorizontal: 15, alignSelf: 'center'}}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  color: '#fff',
                  fontFamily: Fonts.type.RubikMedium,
                  paddingBottom: 10,
                }}>
                {this.state.userData.first_name} {this.state.userData.last_name}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: '#6f7782',
                  fontFamily: Fonts.type.RubikLight,
                  paddingVertical: 5,
                  alignSelf: 'center',
                }}>
                Current Plan :{' '}
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontFamily: Fonts.type.RubikMedium,
                    color: '#fff',
                    alignSelf: 'center',
                  }}>
                  Free
                </Text>
              </Text>
              <Pressable
                onPress={() =>
                  this.props.navigation.navigate('ChangePassword')
                }>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#0AA793',
                    fontFamily: Fonts.type.RubikMedium,
                  }}>
                  Change Password
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 10,
              backgroundColor: '#1A152A',
              marginHorizontal: 10,
            }}>
            <View style={{flexDirection: 'row', padding: 10}}>
              <Text style={{fontSize: 15, color: '#fff'}}>
                PERSONAL DETAILS
              </Text>
              <Pressable
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                onPress={() => this.editProfile()}
                style={{alignSelf: 'center'}}>
                <Icon
                  name='edit'
                  size={15}
                  color='#7b788a'
                  style={{alignSelf: 'center', paddingHorizontal: 15}}
                />
              </Pressable>
            </View>
            <View style={styles.keyStateList}>
              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  Mobile No.
                </Text>
              </View>

              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>

                   {this.state.userData.phone?(this.state.userData.phone):(<Text>Not found</Text>)}
                </Text>
              </View>
            </View>

            <View style={styles.keyStateList}>
              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  Email ID.
                </Text>
              </View>

              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  {this.state.userData.email}
                </Text>
              </View>
            </View>

            <View style={styles.keyStateList}>
              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  City
                </Text>
              </View>

              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  Mumbai
                </Text>
              </View>
            </View>
            <View style={styles.keyStateList}>
              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  Country
                </Text>
              </View>

              <View style={styles.keyStateListCon}>
                <Text
                  style={{
                    color: '#ccc',
                    opacity: 0.9,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.type.Rubik,
                  }}>
                  India
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buybtn: {
    backgroundColor: '#0aa793',
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '48%',
    borderRadius: 10,
  },
  sellbtn: {
    backgroundColor: '#de4c4c',
    width: '48%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
  container: {
    backgroundColor: '#0E0B1A',
    flex: 1,
  },

  keyConSymName: {
    fontSize: 13,
    color: '#fff',
    padding: 10,
    paddingTop: 5,
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

  keyState: {
    backgroundColor: '#1A152A',
    margin: 10,
    flexDirection: 'row',
    paddingVertical: 20,
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
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  keyStateListCon: {
    paddingVertical: 7,
  },
})
