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
  KeyboardAvoidingView,
  Pressable,
  Switch,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {APICaller} from '../../util/apiCaller'
import {Storage} from '../../util/storage'
// import Toast from 'react-native-root-toast'
import Fonts from '../../common/assets/fonts/index'
// import Toast from 'react-native-toast-message';
import GlobalVar from '../../global'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-custom-toast'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin'

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk'

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.toggleSwitch = this.toggleSwitch.bind(this)
    this.state = {
      email: '',
      password: '',
      pushData: [],
      loggedIn: false,
      userInfo: {},
      visible: false,
      emailErr: false,
      success: false,
      showPass: false,
      showloader: false,
      token: '',
    }
  }

  componentDidMount () {
    let t = this
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    })

    AsyncStorage.getItem('authToken').then(value => {
      value = JSON.parse(value)
      // console.log(value)
      if (value != null) {
        t.setState({token: value.token})
        APICaller('users/get-profile/', 'get', null, value.token).then(
          function (res) {
            // console.log('from Login', res)
            Storage._storeData('userData', res)
          },
        )
        t.props.navigation.navigate('TabHome')
      } else {
        t.props.navigation.navigate('Login')
      }
    })
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      this.setState({userInfo: userInfo, loggedIn: true})
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently()
      this.setState({userInfo})
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({loggedIn: false})
      } else {
        // some other error
        this.setState({loggedIn: false})
      }
    }
  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      this.setState({user: null, loggedIn: false}) // Remember to remove the user from your app's state as well
    } catch (error) {
      // console.error(error)
    }
  }

  logoutWithFacebook = () => {
    LoginManager.logOut()
    this.setState({userInfo: {}})
  }

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name',
      },
    }
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          // console.log('login info has error: ' + error)
        } else {
          this.setState({userInfo: user})
          // console.log('result:', user)
        }
      },
    )
    new GraphRequestManager().addRequest(profileRequest).start()
  }

  loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled')
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString()
            this.getInfoFromToken(accessToken)
          })
        }
      },
      error => {
        console.log('Login fail with error: ' + error)
      },
    )
  }

  signInFunction = () => {
    let t = this
    t.setState({showloader: true})
    let data = {
      email: this.state.email,
      password: this.state.password,
    }
    if(data.email == '' || !GlobalVar.validateEmail(data.email)){
      t.refs.customToast.showToast(
        'Enter valid email address',
        5000,
      )
      t.setState({showloader: false})
      return false;
    }
    if(data.password.length < 5){
      t.refs.customToast.showToast(
        'Password must has at least 5 characters !',
        5000,
      )
      t.setState({showloader: false})
      return false;
    }
    // if (this.state.email == '' || this.state.password == '') {
    //   t.refs.customToast.showToast('Please fill all the fields !', 5000)
    //   t.setState({showloader: false})
    // } else {
      APICaller('users/login/', 'post', data).then(function (res) {
        // console.log('from Login', res)
        if (res.token) {
          t.getUserProfile(res.token)
          t.setState({showloader: false})
          let obj = {token: res.token}
          t.setState({success: true})
          Storage._storeData('authToken', obj)
          t.refs.customToast.showToast('Successfully Login!', 5000)
          t.props.navigation.navigate('TabHome')
        } else {
          t.setState({showloader: false})
          t.refs.customToast.showToast(res.message.non_field_errors, 5000)
        }
      })
    // }
  }
  getUserProfile (token) {
    let t = this
    APICaller('users/get-profile/', 'get', null, token).then(function (
      res,
    ) {
      // console.log('from Login', res)
      Storage._storeData('userData', res)
    })
  }
  toggleSwitch () {
    this.setState({showPass: !this.state.showPass})
  }

  render () {
    const isLogin = this.state.userInfo.name
    const buttonText = isLogin ? 'Logout With Facebook' : 'Sign in'
    const onPressButton = isLogin
      ? this.logoutWithFacebook
      : this.loginWithFacebook
    return (
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <View style={styles.logo}>
            <Text style={styles.logotext}>Login Now</Text>
            <Text style={styles.logosmtext}>
              Please sign in to your account
            </Text>
          </View>

          <View
            style={
              this.state.emailErr ? styles.inputTextErr : styles.inputView
            }>
            <Icon
              name='envelope'
              size={20}
              color='#0AA793'
              style={{marginTop: 15, marginRight: 10}}
            />
            <TextInput
              style={styles.inputText}
              placeholder='your_email@gmail.com'
              autoCapitalize = 'none'
              placeholderTextColor={this.state.emailErr ? '#ED4F32' : '#726F81'}
              onChangeText={text => this.setState({email: text})}
            />
          </View>

          <View style={styles.inputView}>
            <Icon
              name='lock'
              size={20}
              color='#0AA793'
              style={{marginTop: 15, marginRight: 15}}
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
        </View>

        <Pressable
          onPress={() => this.props.navigation.navigate('forgotPassword')}
          style={styles.frgCon}>
          <Text style={styles.forgottext}>Forgot Password?</Text>
        </Pressable>
        <View style={styles.loginBox}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.signInFunction()}
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
              <Text style={styles.loginText}>Sign in</Text>
            )}
          </TouchableOpacity>
          <View style={styles.socialcon}>
            <GoogleSigninButton
              style={{width: '50%', borderRadius: 50}}
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.white}
              onPress={this._signIn}
              disabled={this.state.isSigninInProgress}
            />
            <TouchableOpacity
              onPress={onPressButton}
              style={{
                backgroundColor: '#42549A',
                width: '50%',
                borderRadius: 2,
                marginVertical: 3,
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'row',
              }}>
              <Icon name='facebook' size={20} color='#fff' />
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  marginRight: 20,
                  fontWeight: 'bold',
                }}>
                {' '}
                {buttonText}
              </Text>
            </TouchableOpacity>
            {this.state.userInfo.name && (
              <Text style={{fontSize: 16, marginVertical: 16}}>
                Logged in As {this.state.userInfo.name}
              </Text>
            )}
          </View>

          <View style={styles.newusrCon}>
            <Text style={styles.newUser}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={styles.newText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast
          ref='customToast'
          backgroundColor={this.state.success ? '#28a745' : 'red'}
          position='bottom'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B091C',
    justifyContent: 'center',
    height: '100%',
  },
  loginBox: {
    alignItems: 'center',
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
  },
  inputTextErr: {
    width: '90%',
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginBottom: 20,
    paddingRight: 0,
    paddingLeft: 15,
    borderWidth: 0.2,
    borderColor: '#ED4F32',
    flexDirection: 'row',
  },
  inputText: {
    color: '#fff',
    fontSize: 17,
    width: '90%',
  },
  forgottext: {
    textAlign: 'right',
    color: '#0AA793',
  },
  frgCon: {
    // position: 'absolute',
    // right: 20,
    paddingHorizontal: 20,
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

    textShadowColor: '#0AA793',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 15,
    elevation: 50,

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
  socialcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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
