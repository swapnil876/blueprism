import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../common/assets/images/index';
import Fonts from '../../common/assets/fonts/index';
import {APICaller} from '../../util/apiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-custom-toast';
export default class ManageWatchlist extends Component {
  constructor(props) {
    super(props);
    let t = this;
    this.state = {
      modalVisible: false,
      isOpen: false,
      token: '',
      userId: '',
      watchlistTitle: '',
      watchListData: [],
      watchlistId: '',
      success: false,
      editCall: false,
      watchlistIndex: '',
      loader: false,
      deletemodal: false,
      deleteId: '',
      deleteIndex: '',
    };
  }

  componentWillMount() {
    let t = this;
    BackHandler.addEventListener('hardwareBackPress', () =>
      t.props.navigation.goBack(),
    );
    AsyncStorage.getItem('authToken').then((value) => {
      value = JSON.parse(value);
      if (value != null) {
        t.setState({token: value.token});
        APICaller('master/watchlist/getall/', 'GET', {}, t.state.token).then(
          function (res) {
            t.setState({watchListData: res});
          },
        );
      } else {
        t.props.navigation.navigate('Login');
      }
    });
    AsyncStorage.getItem('userData').then((obj) => {
      let userObj = JSON.parse(obj);
      t.setState({userId: userObj.id});
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
  }
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  toggleDelete(id, index) {
    this.setState({deletemodal: true});
    this.setState({deleteId: id});
    this.setState({deleteIndex: index});
  }
  deleteWatchlist(id, index) {
    let t = this;
    t.setState({loader: true});
    // success=true
    APICaller('master/watchlist/' + t.state.deleteId + '/', 'delete', {}, t.state.token).then(
      function (res) {
        console.log('**************************************',res);
        let watchlistTempdata = [];
        watchlistTempdata = t.state.watchListData;
        watchlistTempdata.splice(t.state.deleteIndex, 1);
        t.setState({watchListData: watchlistTempdata});
        // success=true
        t.setState({deletemodal: false});
        t.setState({loader: false});
        t.refs.customToast.showToast('Deleted Successfully !', 5000);
        return t.state.watchListData;
      },
    );
  }
  saveWatchlist() {
    let t = this;
    t.setState({loader: true});
    let data = {
      title: t.state.watchlistTitle,
      user: t.state.userId,
    };
    APICaller('master/watchlist/create/', 'post', data, t.state.token).then(
      function (res) {
        if (res != null || !res == undefined) {
          t.setState({loader: false});
          t.setState({modalVisible: false});
          t.setState({success: false});
          let watchlistObj = [];
          let temObj = {};
          watchlistObj = t.state.watchListData;
          temObj = res;
          temObj.active = false;
          watchlistObj.push(temObj);
          t.setState({watchListData: watchlistObj});
        }
        console.log('from saveWatchlist', watchListData);
      },
    );
  }
  editWatchlist(data, index) {
    let t = this;
    t.setState({editCall: true});
    t.setState({watchlistTitle: data.title});
    t.setState({watchlistId: data.id});
    t.setState({watchlistIndex: index});
    t.toggleModal(true);
  }
  editsaveWatchlist() {
    let t = this;
    t.setState({loader: true});
    let data = {
      title: t.state.watchlistTitle,
      user: t.state.userId,
    };
    console.log(t.state.watchlistId);
    APICaller(
      'master/watchlist/' + t.state.watchlistId + '/',
      'PATCH',
      data,
      t.state.token,
    ).then(function (res) {
      t.setState({modalVisible: false});
      t.setState({success: false});
      let watchlistObj = [];
      let temObj = {};
      watchlistObj = t.state.watchListData;
      temObj = res;
      t.setState({loader: false});
      watchlistObj[t.state.watchlistIndex] = temObj;
      t.setState({watchListData: watchlistObj});
    });
  }
  render() {
    let t = this;
    return (
      <View style={styles.container}>
        <View style={styles.head}>
          <View style={styles.rhead}>
            <TouchableOpacity
              style={{width: 20}}
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-left" size={20} color="#7b788a" />
            </TouchableOpacity>
            <Text style={styles.screenName}>MANAGE WATCHLIST</Text>
          </View>
        </View>
         
          <ScrollView>
            {t.state.watchListData.map((res, index) => (
              <View style={styles.keyState}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#fff',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                  }}>
                  {res.title}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      this.editWatchlist(res, index);
                    }}>
                    <Icon
                      name="edit"
                      size={22}
                      color="#0AA793"
                      style={{paddingHorizontal: 10, alignSelf: 'center'}}
                    />
                  </Pressable>
                  <Pressable
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      this.toggleDelete(res.id, index);
                    }}>
                    <Icon
                      name="trash-o"
                      size={22}
                      color="#0AA793"
                      style={{paddingHorizontal: 10, alignSelf: 'center'}}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
            <Pressable
              style={styles.newbtnWatch}
              onPress={() => {
                this.toggleModal(true);
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#0AA793',
                  paddingVertical: 10,
                }}>
                CREATE NEW WATCHLIST
              </Text>
            </Pressable>
          </ScrollView>
        

        <View style={styles.centeredView}>
          {this.state.editCall ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                // Alert.alert('Modal has been closed.')
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Create Watchlist</Text>
                  <TextInput
                    style={styles.watchlistInput}
                    placeholder="Enter watchlist name"
                    placeholderTextColor="#ccc"
                    autoCorrect={false}
                    onChangeText={(text) =>
                      this.setState({watchlistTitle: text})
                    }
                    defaultValue={this.state.watchlistTitle}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() =>
                        this.toggleModal(!this.state.modalVisible)
                      }>
                      <Text style={[styles.textStyle]}>CANCEL</Text>
                    </Pressable>
                    {this.state.loader ? (
                      <ActivityIndicator color="green" size="large" />
                    ) : (
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={
                          () => this.editsaveWatchlist()
                          // this.toggleModal(!this.state.modalVisible)
                        }>
                        <Text
                          style={
                            this.state.watchlistTitle
                              ? styles.textStyle
                              : styles.savebtn
                          }>
                          UPADTE
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                // Alert.alert('Modal has been closed.')
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Create Watchlist</Text>
                  <TextInput
                    style={styles.watchlistInput}
                    placeholder="Enter watchlist name"
                    placeholderTextColor="#ccc"
                    autoCorrect={false}
                    onChangeText={(text) =>
                      this.setState({watchlistTitle: text})
                    }
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() =>
                        this.toggleModal(!this.state.modalVisible)
                      }>
                      <Text style={[styles.textStyle]}>CANCEL</Text>
                    </Pressable>

                    {this.state.loader ? (
                      <ActivityIndicator color="green" size="large" />
                    ) : (
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={
                          () => this.saveWatchlist()
                          // this.toggleModal(!this.state.modalVisible)
                        }>
                        <Text
                          style={
                            this.state.watchlistTitle
                              ? styles.textStyle
                              : styles.savebtn
                          }>
                          SAVE
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>

        <View style={styles.centeredView}>
          {!this.state.deletemodal ? (
            <View />
          ) : (
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.delete}
              onRequestClose={() => {
                // Alert.alert('Modal has been closed.')
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Are you sure you want to delete?
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => this.setState({deletemodal: false})}>
                      <Text style={[styles.textStyle]}>CANCEL</Text>
                    </Pressable>

                    {this.state.loader ? (
                      <ActivityIndicator color="green" size="large" />
                    ) : (
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => this.deleteWatchlist()}>
                        <Text style={styles.textStyle}>DELETE</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>

        <Toast
          ref="customToast"
          backgroundColor={'#28a745'}
          position="bottom"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  savebtn: {
    color: '#ccc',
  },
  watchlistInput: {
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    height: 50,
    marginTop: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    marginHorizontal: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,

    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 50,
  },
  button: {
    paddingVertical: 10,
    elevation: 2,
    width: 80,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },

  textStyle: {
    color: '#0AA793',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  modalText: {
    textAlign: 'left',
    color: '#000',
    fontSize: 18,
    opacity: 0.6,
  },

  container: {
    backgroundColor: '#0E0B1A',
    flex: 1,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1A152A',
    marginBottom: 10,
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
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  newbtnWatch: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#0AA793',
    borderRadius: 10,
    marginTop: 50,
  },
});
