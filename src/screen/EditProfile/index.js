import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  BackHandler,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Images from '../../common/assets/images/index'
import Fonts from '../../common/assets/fonts/index'
import {APICaller} from '../../util/apiCaller'
import {Storage} from '../../util/storage'
import Toast from 'react-native-custom-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default class EditProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      last_name: '',
      first_name: '',
      phone: '',
      token: '',
      showloader:false,
      userData: {},
    }
  }
  componentDidMount () {
    let t = this
    AsyncStorage.getItem('authToken').then(value => {
      value = JSON.parse(value)
      if (value != null) {
        t.setState({token: value.token})
        t.getUserProfile()
      } else {
        t.props.navigation.navigate('Login')
      }
    })
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    )
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
          t.setState({userData: res})
        }
      },
    )
  }
  updateProfile = () => {
    let t = this
    t.setState({showloader:true})
    let data = {
      email: t.state.email,
      last_name: t.state.lname,
      first_name: t.state.fname,
      phone:t.state.phone
    }
    console.log(t.state.token)
    // if (data.email == '' || data.last_name == '' || data.first_name == '') {
    //     t.refs.customToast.showToast('Please fill all the fields !', 5000)
    // } else {
    APICaller('users/update-profile/', 'post', data, t.state.token).then(
      function (res) {
        console.log('from Login', res)
        if (res.message) {
          t.setState({showloader:false})
          t.setState({success: true})
          t.refs.customToast.showToast('Successfully Updated !', 5000)
        } else {
          t.setState({showloader:false})
          t.refs.customToast.showToast(res.detail, 5000)
        }
      },
    )
    // }
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

              <Text style={styles.screenName}>Edit Profile</Text>
            </View>
          </View>
          <View style={{marginTop: 50}}>
            <View style={styles.logo}>
              <Text style={styles.logotext}>Update Your Profile</Text>
            </View>

            <View style={styles.inputView}>
              <Icon
                name='envelope'
                size={20}
                color='#0AA793'
                style={{marginTop: 15, marginRight: 10, width: 25}}
              />
              <TextInput
                style={styles.inputText}
                placeholder='Your_email@gmail.com'
                placeholderTextColor='#726F81'
                onChangeText={text => this.setState({email: text})}
                defaultValue={this.state.userData.email}
              />
            </View>
            <View style={styles.inputView}>
              <Icon
                name='address-card'
                size={20}
                color='#0AA793'
                style={{marginTop: 15, marginRight: 10, width: 25}}
              />
              <TextInput
                style={styles.inputText}
                placeholder='Enter first name'
                placeholderTextColor='#726F81'
                onChangeText={text => this.setState({fname: text})}
                defaultValue={this.state.userData.first_name}
              />
            </View>
            <View style={styles.inputView}>
              <Icon
                name='address-card'
                size={20}
                color='#0AA793'
                style={{marginTop: 15, marginRight: 10, width: 25}}
              />
              <TextInput
                style={styles.inputText}
                placeholder='Enter last name'
                placeholderTextColor='#726F81'
                onChangeText={last_name => this.setState({last_name})}
                defaultValue={this.state.userData.last_name}
              />
            </View>
            <View style={styles.inputView}>
              <Icon
                name='mobile'
                size={30}
                color='#0AA793'
                style={{marginTop: 10, marginRight: 10, width: 25}}
              />
              <TextInput
                style={styles.inputText}
                placeholder='phone'
                placeholderTextColor='#726F81'
                onChangeText={text => this.setState({phone: text})}
                defaultValue={this.state.userData.phone}
              />
            </View>

            <Pressable
              style={styles.loginBtn}
              onPress={() => this.updateProfile()}>
              {this.state.showloader ? (
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.loginText}>Loading</Text>
                  <ActivityIndicator
                    color={'#fff'}
                    style={{marginHorizontal: 10}}
                  />
                </View>
              ) : (
                <Text style={styles.loginText}>Update</Text>
              )}
            </Pressable>
          </View>
          <Toast
            ref='customToast'
            backgroundColor={this.state.success ? '#28a745' : 'red'}
            position='bottom'
          />
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

  logo: {
    justifyContent: 'center',
    padding: 20,
  },
  logotext: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputView: {
    width: '90%',
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginBottom: 20,
    paddingRight: 0,
    paddingLeft: 15,
    borderWidth: 0.2,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  inputText: {
    color: '#fff',
    fontSize: 17,
    width: '90%',
  },

  logosmtext: {
    color: '#ccc',
    textAlign: 'center',
    paddingVertical: 5,
  },
  loginBtn: {
    width: '90%',
    backgroundColor: '#0AA793',
    borderRadius: 7,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    alignSelf: 'center',
  },
  newusrCon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newUser: {
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 5,
  },
  newText: {
    color: '#0AA793',
    paddingHorizontal: 5,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    fontFamily: Fonts.type.RubikMedium,
  },
})
