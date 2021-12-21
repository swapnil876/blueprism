import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../common/assets/images/index';
import Fonts from '../../common/assets/fonts/index';
import {APICaller} from '../../util/apiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Menu from '../../common/component/navDrawer';
import GlobalVar from '../../global';
const SideMenu = require('react-native-side-menu').default;
export default class Home extends Component {
  constructor(props) {
    super(props);
    let t = this;
    this.state = {
      token: '',
      isOpen: false,
      topGainerData: [],
      topLooserData: [],
      loader: true,
    };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    let t = this;
    AsyncStorage.getItem('authToken').then((value) => {
      value = JSON.parse(value);
      if (value != null) {
        t.setState({token: value.token});
        t.checkSubscription();
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButton.bind(this),
        );

        if (t.state.token) {
          t.topGainers();
          t.topLooser();
        }
      } else {
        t.props.navigation.navigate('Login');
      }
    });
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  handleBackButton() {
    BackHandler.exitApp();
  }
  checkSubscription() {
    let t = this;
    APICaller('users/check-subscription/', 'Get', null, t.state.token).then(
      function (res) {
        console.log(res,"res**************");
        if (res.status != 'active') {
          t.props.navigation.navigate('PriceList');
        }
      },
    );
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({isOpen});
  }

  async fetchPrice(val) {
    let uri = [
      'https://stock-market-data.p.rapidapi.com/yfinance/price?ticker_symbol=' +
        val,
      'https://stock-market-data.p.rapidapi.com/stock/quote?ticker_symbol=' +
        val,
      'https://stock-market-data.p.rapidapi.com/stock/historical-prices?ticker_symbol=' +
        val,
    ];
    let result = uri.map((uri) => {
      return new Promise((resolve, reject) => {
        fetch(uri, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'x-rapidapi-key':
              '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
            'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
          },
        })
          .then((response) => response && response.json())
          .then((response) => {
            resolve(response);
          });
      });
    });
    return Promise.all(result);
  }
  async fetchOldPrice(val) {
    let uri = [
      'https://stock-market-data.p.rapidapi.com/stock/historical-prices?ticker_symbol=' +
        val,
    ];
    let result = uri.map((uri) => {
      return new Promise((resolve, reject) => {
        fetch(uri, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'x-rapidapi-key':
              '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
            'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
          },
        })
          .then((response) => response.json())
          .then((response) => {
            resolve(response);
          });
      });
    });
    return Promise.all(result);
  }
  async topGainers() {
    let t = this;
    fetch(
      'https://stock-market-data.p.rapidapi.com/market/screener/day-gainers',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-rapidapi-key':
            '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
        },
      },
    )
      .then((response) => response.json())
      .then((daydata) => {
        let limit = 5;
        let newArray = daydata.stocks.slice(0, limit);
        let stockArray = [];

        newArray.forEach(async (v, i) => {
          setTimeout(async () => {
            var allData = await t.fetchPrice(v);

            // let quotedata = await t.fetchQuote(v);
            // let oldPricedata = await t.fetchOldPrice(v);
            //  t.getClosingData(allData[2])

            if (allData) {
              let oldprice = t.getClosingData(allData[2]);
              let tempObj = {
                quote: allData && allData[1].quote ? allData[1].quote : {},
                symbol: v,
                price: allData && allData[0].price ? allData[0].price : {},
                oldprice: oldprice,
              };
              stockArray.push(tempObj);
              t.setState({topGainerData: stockArray});
              console.log(stockArray);
            }
          }, 100);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async topLooser() {
    let t = this;
    fetch(
      'https://stock-market-data.p.rapidapi.com/market/screener/day-losers',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-rapidapi-key':
            '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
        },
      },
    )
      .then((response) => response.json())
      .then((daydata) => {
        let limit = 5;
        let newArray = daydata.stocks.slice(0, limit);
        let stockArray = [];

        newArray.forEach(async (v, i) => {
          setTimeout(async () => {
            var allData = await t.fetchPrice(v);

            // let quotedata = await t.fetchQuote(v);
            // let oldPricedata = await t.fetchOldPrice(v);
            //  t.getClosingData(allData[2])

            if (allData) {
              let oldprice = t.getClosingData(allData[2]);
              let tempObj = {
                quote: allData && allData[1].quote ? allData[1].quote : {},
                symbol: v,
                price: allData && allData[0].price ? allData[0].price : {},
                oldprice: oldprice,
              };
              stockArray.push(tempObj);
              t.setState({topLooserData: stockArray});
              console.log(stockArray);
            }
          }, 100);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getClosingData(d) {
    let me = this;
    let val = Object.keys(d)[Object.keys(d).length - 1];
    return d[val];
  }

  getSingleStockData(data) {
    let t = this;
    t.props.navigation.navigate('Quote', {
      singleData: data,
    });
  }
  render() {
    var value = [];
    if (
      this.state.topGainerData.length > 0 &&
      this.state.topLooserData.length > 0
    ) {
      value = this.state.topGainerData;
      topLooserData = this.state.topLooserData;
    }
    return (
      <SideMenu
        menu={<Menu />}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}>
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
              <Text style={styles.screenName}>HOME</Text>
            </View>
            <View style={styles.rhead}>
              <Pressable
                style={styles.rhead}
                onPress={() => this.props.navigation.navigate('UserProfile')}>
                <Icon
                  name="user-circle"
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
          {this.state.topGainerData.length < 1 ? (
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
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'space-between',
                  backgroundColor: '#0E0B1A',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15, color: '#fff'}}>
                    MARKETS TODAY
                  </Text>
                  <Icon
                    name="edit"
                    size={15}
                    color="#7b788a"
                    style={{alignSelf: 'center', marginLeft: 8}}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{fontSize: 10, color: '#fff', alignSelf: 'center'}}>
                    09 MAR 2021 | 04:45PM
                  </Text>
                </View>
              </View>

              <View style={styles.marketTd}>
                <View style={styles.mrktC}>
                  <View style={styles.mrktO}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                        }}
                        source={Images.india}
                      />
                      <Text style={styles.mrktName}>Sensex</Text>
                    </View>
                    <View>
                      <Text style={styles.marktPrice}>50,441.07</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="caret-up" size={12} color="green" />
                      <Text style={styles.mrktUD}>50,441.07</Text>
                      <Text style={styles.mrktUD}>(0.07%)</Text>
                    </View>
                  </View>
                  <View style={styles.mrktT}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                        }}
                        source={Images.india}
                      />
                      <Text style={styles.mrktName}>Sensex</Text>
                    </View>
                    <View>
                      <Text style={styles.marktPrice}>50,441.07</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="caret-up" size={12} color="green" />
                      <Text style={styles.mrktUD}>50,441.07</Text>
                      <Text style={styles.mrktUD}>(0.07%)</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.mrktCt}>
                  <View style={styles.mrktTH}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                        }}
                        source={Images.india}
                      />
                      <Text style={styles.mrktName}>Sensex</Text>
                    </View>
                    <View>
                      <Text style={styles.marktPrice}>50,441.07</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="caret-up" size={12} color="green" />
                      <Text style={styles.mrktUD}>50,441.07</Text>
                      <Text style={styles.mrktUD}>(0.07%)</Text>
                    </View>
                  </View>
                  <View style={styles.mrktF}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                        }}
                        source={Images.india}
                      />
                      <Text style={styles.mrktName}>Sensex</Text>
                    </View>
                    <View>
                      <Text style={styles.marktPrice}>50,441.07</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="caret-up" size={12} color="green" />
                      <Text style={styles.mrktUD}>50,441.07</Text>
                      <Text style={styles.mrktUD}>(0.07%)</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'space-between',
                  backgroundColor: '#0E0B1A',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15, color: '#fff'}}>
                    KEY STATISTICS
                  </Text>
                </View>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate('keyState')}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#0AA793',
                      alignSelf: 'center',
                    }}>
                    VIEW ALL
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                <View>
                  <View style={styles.keyState}>
                    <Text style={{fontSize: 15, color: '#fff', padding: 10}}>
                      Top Gainers
                    </Text>
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

                  {value.map((res, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.keyStateList, styles.borderKeylist]}
                      onPress={() => this.getSingleStockData(res)}>
                      <Text style={styles.keyConSymName}>{res.symbol}</Text>
                      <Text style={styles.keyConVolPrice}>
                        {GlobalVar.numDifferentiation(
                          res.quote["Today's Volume"],
                        )}
                      </Text>
                      <View
                        style={{
                          padding: 10,
                          paddingRight: 15,
                          position: 'absolute',
                          right: 0,
                        }}>
                        <Text style={styles.keyConLTPText}>
                          {res.quote['Current Price']}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          {res.quote['Current Price'] >= res.oldprice.Close ? (
                            <Icon name="caret-down" size={12} color="red" />
                          ) : (
                            <Icon name="caret-up" size={12} color="green" />
                          )}
                          <Text
                            style={
                              res.quote['Current Price'] >= res.oldprice.Close
                                ? styles.mrktUDR
                                : styles.mrktUD
                            }>
                            {res.price.preMarketChange
                              ? res.price.preMarketChange.fmt
                              : '0.00'}
                          </Text>
                          <Text
                            style={
                              res.quote['Current Price'] >= res.oldprice.Close
                                ? styles.mrktUDR
                                : styles.mrktUD
                            }>
                            (
                            {res.price.preMarketChangePercent
                              ? res.price.preMarketChangePercent.fmt
                              : '0.00%'}
                            )
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <View>
                  <View style={styles.keyState}>
                    <Text style={{fontSize: 15, color: '#fff', padding: 10}}>
                      Top Losers
                    </Text>
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
                  {this.state.topLooserData.map((res, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.keyStateList, styles.borderKeylist]}
                      onPress={() => this.getSingleStockData(res)}>
                      <Text style={styles.keyConSymName}>{res.symbol}</Text>
                      <Text style={styles.keyConVolPrice}>
                        {GlobalVar.numDifferentiation(
                          res.quote["Today's Volume"],
                        )}
                      </Text>
                      <View
                        style={{
                          padding: 10,
                          paddingRight: 15,
                          position: 'absolute',
                          right: 0,
                        }}>
                        <Text style={styles.keyConLTPText}>
                          {res.quote['Current Price']}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          {res.quote['Current Price'] >= res.oldprice.Close ? (
                            <Icon name="caret-down" size={12} color="red" />
                          ) : (
                            <Icon name="caret-up" size={12} color="green" />
                          )}
                          <Text
                            style={
                              res.quote['Current Price'] >= res.oldprice.Close
                                ? styles.mrktUDR
                                : styles.mrktUD
                            }>
                            {res.price.preMarketChange
                              ? res.price.preMarketChange.fmt
                              : '0.00'}
                          </Text>
                          <Text
                            style={
                              res.quote['Current Price'] >= res.oldprice.Close
                                ? styles.mrktUDR
                                : styles.mrktUD
                            }>
                            (
                            {res.price.preMarketChangePercent
                              ? res.price.preMarketChangePercent.fmt
                              : '0.00%'}
                            )
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'space-between',
                  backgroundColor: '#0E0B1A',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15, color: '#fff'}}>
                    MARKET COMMENTARY
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#0AA793',
                      alignSelf: 'center',
                    }}>
                    VIEW ALL
                  </Text>
                </View>
              </View>
              <View style={{paddingVertical: 20}}>
                <View style={styles.keyState}>
                  <Text style={{fontSize: 12, color: '#fff', padding: 10}}>
                    JSPL: PROMOTER GROUP RELEASE 1M SHARES OR 0.10% STAKE OF
                    EQUALITY ON 9TH MARCH
                  </Text>
                  <View style={{flexDirection: 'row', padding: 10}}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#fff',
                        alignSelf: 'center',
                        opacity: 0.5,
                      }}>
                      09 MAR 2021 | 04:45PM
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SideMenu>
    );
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
    marginHorizontal: 10,
    borderRadius: 4,
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
  mrktUDR: {
    color: 'red',
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
});
