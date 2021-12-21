import React, {Component} from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalVar from '../../global';
// import {
//   Fonts,
// } from '../../common/assets/fonts/index';
import {APICaller} from '../../util/apiCaller'
import {Storage} from '../../util/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-custom-toast'
import Fonts from '../../common/assets/fonts/index'
export default class Signup extends Component {
  constructor (props) {
    super(props)
    this.toggleSwitch = this.toggleSwitch.bind(this)
    this.state = {
      email: '',
      password: '',
      lname: '',
      fname: '',
      phone: '',
      password: '',
      company: '',
      showPass: false,
      success: false,
      showloader: false,
    }
  }

  signUp = () => {
    let t = this
    t.setState({showloader: true})
    let data = {
      email: t.state.email,
      password: t.state.password,
      last_name: t.state.lname,
      first_name: t.state.fname,
      company: t.state.company,
      phone: t.state.phone,
    }
    console.log('data******',data);
    if(data.email == '' || !GlobalVar.validateEmail(data.email)){
      t.refs.customToast.showToast(
        'Enter valid email address',
        5000,
      )
      t.setState({showloader: false})
      return false;
    }
    if(data.first_name == ''){
      t.refs.customToast.showToast(
        'Enter First Name',
        5000,
      )
      t.setState({showloader: false})
      return false;
    }
    if(data.last_name == ''){
      t.refs.customToast.showToast(
        'Enter Last Name',
        5000,
      )
      t.setState({showloader: false})
      return false;
    }
    if(data.phone == '' || data.phone.length < 10 || data.phone.length > 10){
      t.refs.customToast.showToast(
        'Phone should be 10 digit number',
        5000,
      )
      t.setState({showloader: false})
      return false;
    }
    //   data.email == '' ||
    //   data.password == '' ||
    //   data.last_name == '' ||
    //   data.first_name == '' ||
    //   data.phone == ''
    // ) {
    //   t.refs.customToast.showToast('Please fill all the fields !', 5000)
    //   t.setState({showloader: false})
    // } else {
      APICaller('users/register/', 'post', data).then(function (res) {
        console.log('from Login', res)
        if (res.hasErr) {
          if (res.message.password) {
            t.refs.customToast.showToast('Ensure password has atleast 5 characters',
              5000,
            )
          } else if (res.message.email) {
            t.refs.customToast.showToast(res.message.email, 5000)
          }
          t.setState({showloader: false})
        } else {
          t.setState({success: true})
          APICaller('users/login/', 'post', data).then(function (res) {
            console.log('resss', res)
            t.setState({showloader: false})
            let obj = {token: res.token}
            t.setState({success: true})
            Storage._storeData('authToken', obj)
            t.props.navigation.navigate('TabHome')
            t.refs.customToast.showToast('Successfully Registered !', 5000)
          })
        }
      })
    // }
  }
  toggleSwitch () {
    this.setState({showPass: !this.state.showPass})
  }
  render () {
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          style={{width: '100%'}}>
          <View style={styles.logo}>
            <Text style={styles.logotext}>Create new account</Text>
            <Text style={styles.logosmtext}>
              Please fill in the form to continue
            </Text>
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
              placeholder='your_email@gmail.com'
              autoCapitalize = 'none'
              placeholderTextColor='#726F81'
              onChangeText={text => this.setState({email: text})}
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
              onChangeText={text => this.setState({lname: text})}
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
              placeholder='Company'
              placeholderTextColor='#726F81'
              onChangeText={text => this.setState({company: text})}
            />
          </View>

          <View style={styles.inputView}>
            <Icon
              name='lock'
              size={25}
              color='#0AA793'
              style={{marginTop: 12, marginRight: 10, width: 25}}
            />
            <TextInput
              style={styles.inputText}
              placeholder='Password'
              placeholderTextColor='#726F81'
              returnKeyType='go'
              secureTextEntry={this.state.showPass ? false : true}
              autoCorrect={false}
              onChangeText={text => this.setState({password: text})}
            />
            <TouchableOpacity
              onPress={() => this.toggleSwitch()}
              style={{marginLeft: -50, alignSelf: 'center'}}
              hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
              {this.state.showPass ? (
                <Icon name='eye' size={20} color='#0AA793' style={{}} />
              ) : (
                <Icon name='eye-slash' size={20} color='#0AA793' style={{}} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.signUp()}
            disabled={this.state.showloader ? true : false}>
            {this.state.showloader ? (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.loginText}>Loading</Text>
                <ActivityIndicator
                  color={'#fff'}
                  style={{marginHorizontal: 10}}
                />
              </View>
            ) : (
              <Text style={styles.loginText}>Sign up</Text>
            )}
          </TouchableOpacity>
          <View style={styles.newusrCon}>
            <Text style={styles.newUser}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.newText}>Sign in</Text>
            </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#0B091C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    justifyContent: 'center',
    padding: 20,
    alignSelf: 'center',
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
    textShadowColor: '#0AA793',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 15,

    shadowColor: '#0AA793',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
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
  showToastBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'stretch',
    marginHorizontal: 25,
    marginVertical: 10,
  },

  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
})
