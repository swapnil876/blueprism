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

} from 'react-native'
import {APICaller} from '../../util/apiCaller'
import Toast from 'react-native-custom-toast'
import Icon from 'react-native-vector-icons/FontAwesome'
import Fonts from '../../common/assets/fonts/index'
// import {
//   Fonts,
// } from '../../common/assets/fonts/index';
export default class forgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      success: false,
    }
  }
  forgotPass = () => {
    let t = this
    let data = {
      email: this.state.email,
    }

    if (this.state.email == '') {
      t.refs.customToast.showToast('Please enter your email !', 5000)
    } else {
      APICaller('users/request-forgot-password/', 'post', data).then(function (
        res,
      ) {
        console.log('from Login', res)
        if (res.success) {
          t.setState({success: true})
          t.refs.customToast.showToast(
            'Please check your email to reset password !',
            8000,
          )
        } else {
          t.refs.customToast.showToast('Email is not registered !', 5000)
        }
      })
    }
  }
 

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logotext}>Forgot Password</Text>
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
            placeholderTextColor='#726F81'
            onChangeText={text => this.setState({email: text})}
          />
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.forgotPass()}>
          <Text style={styles.loginText}>Submit</Text>
        </TouchableOpacity>
        <View style={styles.newusrCon}>
          <Text style={styles.newUser}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.newText}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newusrCon}>
          <Text style={styles.newUser}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Signup')}>
            <Text style={styles.newText}>Sign up</Text>
          </TouchableOpacity>
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
    flex: 1,
    backgroundColor: '#0B091C',
    alignItems: 'center',
    justifyContent: 'center',
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
  inputText: {
    color: '#fff',
    fontSize: 17,
  },
  forgottext: {
    color: '#ccc',
    position: 'absolute',
    left: '16%',
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
})
