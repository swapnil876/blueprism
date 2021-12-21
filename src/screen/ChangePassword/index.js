import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
  Pressable,
  TextInput,
  Switch,
  BackHandler
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Images from '../../common/assets/images/index'
import Fonts from '../../common/assets/fonts/index'
import {APICaller} from '../../util/apiCaller'
import {Storage} from '../../util/storage'
import Toast from 'react-native-custom-toast'
export default class ChangePassword extends Component {
  constructor (props) {
    super(props)
    // this.toggleSwitch = this.toggleSwitch.bind(this)
    this.state = {
      oldPass: '',
      newPass: '',
      repeatPass: '',
      showoldPass: false,
      shownewPass: false,
      showrepeatPass: false,
    }
  }

  changePassword () {
    let t = this
  }
  toggleSwitch (key) {
    if (key == 'oldPass') {
      this.setState({showoldPass: !this.state.showoldPass})
    } else if (key == 'newPass') {
      this.setState({shownewPass: !this.state.shownewPass})
    } else if (key == 'repeatPass') {
      this.setState({showrepeatPass: !this.state.showrepeatPass})
    }
  }
  componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    )
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.head}>
            <View style={styles.rhead}>
              <TouchableOpacity
                style={{width: 20}}
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-left' size={20} color='#7b788a' />
              </TouchableOpacity>

              <Text style={styles.screenName}>Change Password</Text>
            </View>
          </View>
          <View style={{marginTop: 50}}>
            <View style={styles.logo}>
              <Text style={styles.logotext}>Change Your Password</Text>
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
                placeholder='Enter Old Password'
                placeholderTextColor='#726F81'
                returnKeyType='go'
                secureTextEntry={this.state.showoldPass ? false : true}
                autoCorrect={false}
                onChangeText={text => this.setState({oldPass: text})}
              />

              <TouchableOpacity
                onPress={() => this.toggleSwitch('oldPass')}
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                style={{marginLeft: -50, alignSelf: 'center'}}>
                {this.state.showoldPass ? (
                  <Icon name='eye' size={20} color='#0AA793' style={{}} />
                ) : (
                  <Icon name='eye-slash' size={20} color='#0AA793' style={{}} />
                )}
              </TouchableOpacity>
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
                placeholder='Enter New Password'
                placeholderTextColor='#726F81'
                returnKeyType='go'
                secureTextEntry={this.state.shownewPass ? false : true}
                autoCorrect={false}
                onChangeText={text => this.setState({newPass: text})}
              />

              <TouchableOpacity
                onPress={() => this.toggleSwitch('newPass')}
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                style={{marginLeft: -50, alignSelf: 'center'}}>
                {this.state.shownewPass ? (
                  <Icon name='eye' size={20} color='#0AA793' style={{}} />
                ) : (
                  <Icon name='eye-slash' size={20} color='#0AA793' style={{}} />
                )}
              </TouchableOpacity>
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
                placeholder='Repeat Password'
                placeholderTextColor='#726F81'
                returnKeyType='go'
                secureTextEntry={this.state.showrepeatPass ? false : true}
                autoCorrect={false}
                onChangeText={text => this.setState({repeatPass: text})}
              />

              <TouchableOpacity
                onPress={() => this.toggleSwitch('repeatPass')}
                style={{marginLeft: -50, alignSelf: 'center'}}
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
                {this.state.showrepeatPass ? (
                  <Icon name='eye' size={20} color='#0AA793' style={{}} />
                ) : (
                  <Icon name='eye-slash' size={20} color='#0AA793' style={{}} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this.changePassword()}>
              <Text style={styles.loginText}>Reset Password</Text>
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
})
