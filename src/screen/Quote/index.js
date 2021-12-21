import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  BackHandler,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../common/assets/images/index';
import Fonts from '../../common/assets/fonts/index';
import {APICaller} from '../../util/apiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-custom-toast';
import GlobalVar from '../../global';
import axios from 'axios';
import {MaterialTopTabBar} from 'react-navigation-tabs';
import Watchlist from '../Watchlist';
export default class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      watchListData: [],
      token: '',
      success: false,
      singleStockData: {},
      dateToday: '',
      quoteData: {},
      loader: true,
    };
  }
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  componentWillMount() {
    let t = this;
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
    let tempsingleStockData = this.props.navigation.state.params.singleData;
    console.log('*****',tempsingleStockData)
    t.setState({singleStockData:tempsingleStockData});
    if(tempsingleStockData.basic.symbol)
      t.getQuotation(tempsingleStockData.basic.symbol);
    // if (tempsingleStockData.symbol != null) {
    //   t.getQuote(tempsingleStockData.symbol);
    // }
    // else if(tempsingleStockData.sym.ticker_symbol){
    //   t.getQuote(tempsingleStockData.sym.ticker_symbol);
    // }
    // t.setState({singleStockData: tempsingleStockData});
    AsyncStorage.getItem('authToken').then((value) => {
      value = JSON.parse(value);
      if (value != null) {
        t.setState({token: value.token});
        APICaller('master/watchlist/getall/', 'GET', {}, value.token).then(
          function (res) {
            t.setState({watchListData: res});
          },
        );
      } else {
        t.props.navigation.navigate('Login');
      }
    });
    let today = new Date();
    let todayDate = GlobalVar.dateToYMD(today);
    t.setState({dateToday: todayDate});
    this.setState({loader:false});
  }
  getQuotation(key){
    let t = this;
    const options = {
      method: 'GET',
      url:'https://mboum-finance.p.rapidapi.com/qu/quote',
      params: {symbol: key},
      headers: {
        'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
        'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
      },
    };
    // t.setState({loading: false});
    let arr = []
    axios.request(options).then(function (response) {
      if(response.data.length > 0){
        const price_options = {
          method: 'GET',
          url:'https://mboum-finance.p.rapidapi.com/mo/module/',
          params: {symbol: key,module: 'asset-profile,financial-data'},
          headers: {
            'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
            'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
          },
        };
        // arr = response.data;
        axios.request(price_options).then(function (xtraInfoResponse) {
          console.log('xtraInfo',xtraInfoResponse.data)
          arr.push(xtraInfoResponse.data);
          arr[0].basic = response.data[0];
          console.log('arr',arr);
          t.setState({
            singleStockData: arr[0],
            loading: false
          });
        });      }
    }).catch(function (error) {
      console.error('catcherror',error);
      // t.setState({loading: false});
    });
  }
  // getQuote(symbol) {
  //   let t = this;
  //   const options = {
  //     method: 'GET',
  //     url:
  //       'https://stock-market-data.p.rapidapi.com/stock/quote?ticker_symbol=' +
  //       symbol,
  //     headers: {
  //       'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
  //       'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
  //     },
  //   };
  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       const optionsOld = {
  //         method: 'GET',
  //         url:
  //           'https://stock-market-data.p.rapidapi.com/stock/historical-prices?ticker_symbol=' +
  //           symbol,
  //         headers: {
  //           'x-rapidapi-key':
  //             '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
  //           'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
  //         },
  //       };
  //       axios
  //         .request(optionsOld)
  //         .then(function (responseOld) {
  //           const optionsPri = {
  //             method: 'GET',
  //             url:
  //               'https://stock-market-data.p.rapidapi.com/yfinance/price?ticker_symbol=' +
  //               symbol,
  //             headers: {
  //               'x-rapidapi-key':
  //                 '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
  //               'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
  //             },
  //           };
  //           axios
  //             .request(optionsPri)
  //             .then(function (responsePri) {
  //               let turnover=responsePri.data.price.regularMarketVolume.raw/response.data.quote['Shares Outstanding']
               

  //               let oldprice = t.getClosingData(responseOld.data);
  //               let objData = {};
  //               objData.quote = response.data.quote;
  //               objData.oldprice = oldprice;
  //               objData.turnover=turnover;
  //               if (objData.quote && objData.oldprice && turnover) {
  //                 t.setState({quoteData: objData});
  //                 console.log(turnover);
  //               }
  //             })
  //             .catch(function (error) {
  //               console.error(error);
  //             });
  //         })
  //         .catch(function (error) {
  //           console.error(error);
  //         });
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
  }

  getClosingData(d) {
    let me = this;
    let val = Object.keys(d)[Object.keys(d).length - 1];
    return d[val];
  }
  addWatchlistGroup(value) {
    let t = this;
    console.log(t.state.singleStockData.basic.symbol);
    let data = {
      watchlist: value.id,
      symbol: t.state.singleStockData.basic.symbol,
    };
    APICaller(
      'master/watchlist-stock/create/',
      'post',
      data,
      t.state.token,
    ).then(function (res) {
      if (!res.hasErr) {
        t.setState({modalVisible: false,success: true});
        t.refs.customToast.showToast(
          data.symbol + ' added successfully !',
          5000,
        );
      }
      else if(res.hasErr){
        t.setState({showloader: false,success: false})
        t.refs.customToast.showToast(
          res.message,
          5000,
        )
        return false;
      }

      console.log('getwatchlistsStock', res);
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.head}>
            <View style={styles.rhead}>
              <TouchableOpacity
                style={{width: 20}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#7b788a" />
              </TouchableOpacity>

              <Text style={styles.screenName}>Quote</Text>
            </View>
            <View style={styles.rhead}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  alignSelf: 'center',
                }}>
                <Pressable
                  hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                  onPress={() => {
                    this.toggleModal(true);
                  }}>
                  <Icon
                    name="list-alt"
                    size={22}
                    color="#7b788a"
                    style={{alignSelf: 'center'}}
                  />
                </Pressable>

                <Icon
                  name="plus"
                  size={13}
                  color="#0E0B1A"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 12,
                    borderRadius: 50,
                    width: 11,
                    height: 12,
                    backgroundColor: '#7b788a',
                  }}
                />
              </View>

              <Icon
                name="bell"
                size={20}
                color="#7b788a"
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>
          {this.state.loader? (
            <ActivityIndicator
              color="green"
              size="large"
              style={{marginVertical: '60%'}}
            />
          ) : (
            <View>
              <View style={styles.keyState}>
                <Text style={{fontSize: 15, color: '#fff', padding: 10}}>
                  {this.state.singleStockData.basic.shortName}
                </Text>
                <View
                  style={{
                    padding: 10,
                    paddingRight: 15,
                    flexDirection: 'row',
                    paddingTop: 0,
                  }}>
                  <Text style={{fontSize: 15, color: '#fff'}}>
                   {this.state.singleStockData.financialData.currentPrice.raw}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      paddingHorizontal: 15,
                    }}>
                    {this.state.singleStockData.basic.regularMarketPreviousClose >= this.state.singleStockData.financialData.currentPrice.raw?(<Icon
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
                    <Text style={styles.mrktUD}></Text>
                    <Text style={styles.mrktUD}>
                      {/*({this.state.quoteData.quote["Today's Change"].toFixed(2)}
                      %)*/}
                      {(this.state.singleStockData.basic.regularMarketPreviousClose-this.state.singleStockData.financialData.currentPrice.raw).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 0}}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#fff',
                      opacity: 0.4,
                      alignSelf: 'center',
                      padding: 10,
                    }}>
                    {this.state.dateToday}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  backgroundColor: '#1A152A',
                  marginHorizontal: 10,
                }}>
                <View style={styles.keyStateList}>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Open
                    </Text>
                    <Text style={styles.keyConSymName}>
                      {this.state.singleStockData.basic.regularMarketOpen}
                    </Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      High
                    </Text>
                    <Text style={styles.keyConSymName}>
                      {this.state.singleStockData.basic.regularMarketDayHigh}
                    </Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Low
                    </Text>
                    <Text style={styles.keyConSymName}>
                      {this.state.singleStockData.basic.regularMarketDayLow}
                    </Text>
                  </View>
                </View>
                <View style={styles.keyStateList}>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Close
                    </Text>
                    <Text style={styles.keyConSymName}>
                       {this.state.singleStockData.basic.regularMarketPreviousClose}
                    </Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Volume
                    </Text>
                    <Text style={styles.keyConSymName}>
                     {this.state.singleStockData.basic.regularMarketVolume} 
                    </Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Turnover
                    </Text>
                    <Text style={styles.keyConSymName}>{GlobalVar.numDifferentiation(this.state.singleStockData.financialData.totalRevenue.raw)}</Text>
                  </View>
                </View>
                <View style={styles.keyStateList}>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Market Cap.(Cr)
                    </Text>
                    <Text style={styles.keyConSymName}>
                      {GlobalVar.numDifferentiation(
                        this.state.singleStockData.basic.marketCap
                      )}
                    </Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      ATP
                    </Text>
                    <Text style={styles.keyConSymName}>772.59</Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      EPS
                    </Text>
                    <Text style={styles.keyConSymName}>3.08</Text>
                  </View>
                </View>
                {/* <View style={styles.keyStateList}>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Lower Circuit
                    </Text>
                    <Text style={styles.keyConSymName}>659.75</Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Lower Circuit
                    </Text>
                    <Text style={styles.keyConSymName}>659.75</Text>
                  </View>
                  <View style={styles.keyStateListCon}>
                    <Text
                      style={{
                        color: '#ccc',
                        opacity: 0.6,
                        fontSize: 11,
                        paddingHorizontal: 10,
                      }}>
                      Lower Circuit
                    </Text>
                    <Text style={styles.keyConSymName}>659.75</Text>
                  </View>
                </View> */}
              </View>
              <View style={styles.centeredView}>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {}}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View>
                        {this.state.watchListData.length < 1 ? (
                          <View>
                            <Text style={styles.modalText}>
                              No watchlist found:
                            </Text>
                            <TouchableOpacity
                              style={styles.watchlistGroup}
                              onPress={() =>
                                this.props.navigation.navigate('Watchlist')
                              }>
                              <Text>Create Watchlist</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View>
                            {this.state.watchListData.map((res, index) => (
                              <View>
                                <Text style={styles.modalText}>
                                  Select watchlist group to add scripts:
                                </Text>
                                <TouchableOpacity
                                  key={index}
                                  style={styles.watchlistGroup}
                                  onPress={() => this.addWatchlistGroup(res)}>
                                  <Text>{res.title}</Text>
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

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
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}
        </ScrollView>

        <Toast
          ref="customToast"
          backgroundColor={this.state.success ? '#28a745' : 'red'}
          position="bottom"
        />
      </View>
    );
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
    // borderBottomColor:'#ccc',
    // borderWidth:.2
  },
  keyStateListCon: {
    width: '36%',
    paddingVertical: 7,
  },
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
    marginBottom: 10,
  },
  watchlistGroup: {
    paddingVertical: 10,
  },
});
