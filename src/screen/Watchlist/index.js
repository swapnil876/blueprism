import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../common/assets/images/index';
import Fonts from '../../common/assets/fonts/index';
import Menu from '../../common/component/navDrawer';
import {APICaller} from '../../util/apiCaller';
import Quote from '../Quote';
import axios from 'axios';
import GlobalVar from '../../global';

import AsyncStorage from '@react-native-async-storage/async-storage';
const SideMenu = require('react-native-side-menu').default;
const {useState, useEffect} = React;
export default class Watchlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isOpen: false,
      token: '',
      userId: '',
      watchlistTitle: '',
      watchListData: [],
      watchListStockData: [],
      loader: false,
      nodata: '',
      stockloader: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  componentWillMount() {
    let t = this;
    t.setState({loader: true});

    AsyncStorage.getItem('authToken').then((value) => {
      value = JSON.parse(value);
      if (value != null) {
        t.setState({token: value.token});
        if (t.state.token) {
          t.getwatchlist(t.state.token);
          this._subscribe = this.props.navigation.addListener(
            'didFocus',
            () => {
              t.getwatchlist(t.state.token);
            },
          );
        }
      } else {
        t.props.navigation.navigate('Login');
      }
    });
    AsyncStorage.getItem('userData').then((obj) => {
      let userObj = JSON.parse(obj);
      t.setState({userId: userObj.id});
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  updateMenuState(isOpen) {
    this.setState({isOpen});
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
          let watchlistObj = [];
          let temObj = {};
          watchlistObj = t.state.watchListData;
          temObj = res;
          temObj.active = false;
          watchlistObj.push(temObj);
          t.setState({watchListData: watchlistObj});
        }
      },
    );
  }
  checkStatus(value) {
    let t = this;
    watchlistObj = [];
    t.state.watchListData.forEach((data) => {
      data.active = false;
      value.active = true;
      watchlistObj.push(data);
    });
    t.setState({watchListData: watchlistObj});
    if (value.active) {
      t.getwatchlistsStock(value.id);
    }
  }
  getwatchlist(token) {
    let t = this;
    APICaller('master/watchlist/getall/', 'GET', {}, token).then(function (
      res,
    ) {
      let tempData = [];
      res.forEach((value, i) => {
        if (i == 0) {
          value.active = true;
          t.getwatchlistsStock(value.id);
        } else {
          value.active = false;
        }
        tempData.push(value);
        if (res.length == i + 1) {
          t.setState({loader: false});
          t.setState({watchListData: tempData});
        }
      });
      if (res.length < 1) {
        t.setState({loader: false});
      }
    });
  }
  getwatchlistsStock(value) {
    let t = this;

    t.setState({stockloader: true});
    APICaller(
      'master/watchlist-stock/getall/?watchlist=' + value,
      'get',
      {},
      t.state.token,
    ).then(function (res) {
      
      let tempwatchListStockData = [];
      t.setState({watchListStockData: []});
      res.forEach((val, i) => {
        let symbol = val.symbol;
        if (symbol != null) {
          // const quote = {
          //   method: 'GET',
          //   url:
          //     'https://stock-market-data.p.rapidapi.com/stock/quote?ticker_symbol=' +
          //     symbol,

          //   headers: {
          //     'x-rapidapi-key':
          //       '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          //     'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
          //   },
          // };

          // axios
          // .request(quote)
          // .then(function (quoteRes) {
          //   if (quoteRes != null) {
          //     const Info = {
          //       method: 'GET',
          //       url:
          //         'https://stock-market-data.p.rapidapi.com/stock/company-info?ticker_symbol=' +
          //         symbol,
          //       headers: {
          //         'x-rapidapi-key':
          //           '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          //         'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
          //       },
          //     };

          //     axios
          //       .request(Info)
          //       .then(function (infoRes) {
          //         tempAry = {};
          //         tempAry = {
          //           info: infoRes.data.company_profile,
          //           quote: quoteRes.data.quote,
          //           symbol: symbol,
          //         };
          //         console.log(tempAry.symbol);

          //         tempwatchListStockData.push(tempAry);
          //         t.setState({watchListStockData: tempwatchListStockData});
          //         console.log('stock data hhhh', t.state.watchListStockData);
          //       })
          //       .catch(function (error) {
          //         console.error(error);
          //       });
          //   }
          // })
          // .catch(function (error) {
          //   console.error(error);
          // });
          const options = {
            method: 'GET',
            url:'https://mboum-finance.p.rapidapi.com/qu/quote',
            params: {symbol: symbol},
            headers: {
              'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
              'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
            },
          };
          t.setState({loading: false});
          let arr = []
          axios.request(options).then(function (response) {
            console.log('*********',response.data);
              const price_options = {
                method: 'GET',
                url:'https://mboum-finance.p.rapidapi.com/mo/module/',
                params: {symbol: symbol,module: 'asset-profile,financial-data'},
                headers: {
                  'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
                  'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
                },
              };
              // arr = response.data;
              axios.request(price_options).then(function (xtraInfoResponse) {
                let tempAry = {};
                tempAry = {
                  symbol: symbol,
                  info:xtraInfoResponse.data,
                  basic:response.data[0]
                };
                tempwatchListStockData.push(tempAry);
                if(res.length-1 == i){
                   t.setState({watchListStockData: tempwatchListStockData,stockloader: false});
                }
              }); 
          }) 
        }
      });
      if (res.length < 1) {
        t.setState({stockloader: false});
        t.setState({nodata: 'No data found'});
      }
    });
  }

  render() {
    let t = this;
    return (
      <SideMenu
        menu={<Menu />}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}>
        <View style={styles.container}>
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
              <Text style={styles.screenName}>Watchlist</Text>
            </View>
            <View style={styles.rhead}>
              <Pressable
                onPress={() =>
                  this.props.navigation.navigate('ManageWatchlist')
                }>
                <Icon
                  name="cogs"
                  size={22}
                  color="#7b788a"
                  style={{paddingHorizontal: 15, alignSelf: 'center'}}
                />
              </Pressable>
              <Icon
                name="bell"
                size={22}
                color="#7b788a"
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>

          {this.state.loader ? (
            <ActivityIndicator
              color="green"
              size="large"
              style={{marginVertical: '60%'}}
            />
          ) : (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#1A152A',
                  paddingHorizontal: 15,
                }}>
                <ScrollView style={{flexDirection: 'row'}} horizontal={true}>
                  {this.state.watchListData.map((res, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        paddingHorizontal: 10,
                        borderBottomColor: res.active ? '#0AA793' : '#1A152A',
                        borderBottomWidth: 1,
                        textAlign: 'center',
                      }}
                      onPress={() => this.checkStatus(res)}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#fff',
                          paddingVertical: 10,
                          textAlign: 'center',
                        }}>
                        {res.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Pressable
                  style={{
                    paddingHorizontal: 10,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    this.toggleModal(true);
                  }}>
                  <Icon
                    name="plus-circle"
                    size={15}
                    color="#0AA793"
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      alignSelf: 'center',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#0AA793',
                      alignSelf: 'center',
                    }}>
                    WATCHLIST
                  </Text>
                </Pressable>
              </View>
              {/* <View style={styles.search}>
                <Icon
                  name="search"
                  size={20}
                  color="#7b788a"
                  style={{paddingHorizontal: 10, alignSelf: 'center'}}
                />
                <TextInput
                  style={styles.serachinput}
                  placeholder="Enter text to search"
                  placeholderTextColor="#726F81"
                />
                <Icon
                  name="filter"
                  size={20}
                  color="#7b788a"
                  style={{
                    paddingHorizontal: 10,
                    alignSelf: 'center',
                    position: 'absolute',
                    right: 0,
                  }}
                />
              </View> */}

              {this.state.stockloader ? (
                <View>
                  {/* <ActivityIndicator
                    color="green"
                    size="large"
                    style={{marginVertical: '60%'}}
                  /> */}
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {this.state.watchListStockData.map((res, index) => (
                    <TouchableOpacity style={styles.keyStateList} key={index}>
                      <View>
                        <Text style={styles.keyConSymbol}>{res.symbol}</Text>
                        <Text style={styles.keyConVol}>
                          {res.basic.exchange}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.keyConLTPText}>
                         {res.info.financialData.currentPrice.raw}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          {res.basic.regularMarketPreviousClose >= res.info.financialData.currentPrice.raw?(<Icon
                            name="caret-up"
                            size={12}
                            color="green"
                            style={{alignSelf: 'center'}}
                          />):
                          (<Icon
                            name="caret-down"
                            size={12}
                            color="red"
                            style={{alignSelf: 'center'}}
                          />)}
                          <Text style={styles.mrktUD}>{GlobalVar.numDifferentiation(res.basic.regularMarketPreviousClose)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
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
                            this.state.watchlistTitle != ''
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
          </View>
        </View>
      </SideMenu>
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
    marginLeft: 0,
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
    elevation: 5,
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
  serachinput: {
    width: '100%',
    color: '#fff',
  },
  search: {
    flexDirection: 'row',
    backgroundColor: '#312d42',
    height: 50,
    margin: 8,
    borderRadius: 10,
  },
  keyStateList: {
    backgroundColor: '#1A152A',
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  keyConSymbol: {
    fontSize: 16,
    color: '#fff',
  },
  keyConVol: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.6,
  },

  keyConLTPText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'right',
  },
  mrktUD: {
    color: 'green',
    marginLeft: 5,
    fontSize: 11,
  },
});
