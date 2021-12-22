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
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {ListItem, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../common/assets/images/index';
import Fonts from '../../common/assets/fonts/index';
import {APICaller} from '../../util/apiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dash from 'react-native-dash';
import Menu from '../../common/component/navDrawer';
import GlobalVar from '../../global';
const SideMenu = require('react-native-side-menu').default;
import Toast from 'react-native-custom-toast';
import filter from 'lodash.filter';
export default class TredingPortfolio extends Component {
  constructor(props) {
    super(props);
    let t = this;
    this.state = {
      token: '',
      topGainerData: [],
      topLooserData: [],
      keyVal: '',
      modalVisible: false,
      loading: false,
      data: [],
      error: null,

      query: '',
      fullData: [],

      stockSymbol: '',
      stockName: '',
      symbolPrice: null,
      qty: null,
      stockId: '',
      success: false,
      clicks: 1,
      show: true,
      actualPrice: null,
      stockQuantity: null,
      userId: '',
      currentValue:0,
      investedValue:0,
      daygl:0,
      overalgl:0
    };
    this.arrayholder = [];
  }

  componentWillMount() {
    let t = this;
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
    let key = this.props.navigation.state.params.keyVal;
    console.log(key);
    t.setState({keyVal: key});
    AsyncStorage.getItem('authToken').then((value) => {
      value = JSON.parse(value);
      if (value != null) {
        t.setState({token: value.token});
        if (t.state.token != null) {
          this.makeRemoteRequest();
          if (key == 'sell') {
            t.sellList(t.state.token);
          } else {
            t.buyList(t.state.token);
          }
        }
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
    clearInterval(this._interval);
  }

  toggleModal(visible) {
    let t =this;
    t.setState({modalVisible: visible});
    t.setState({stockId: ''});
    t.setState({stockSymbol: ''});
    t.setState({symbolPrice: ''});
    t.setState({stockQuantity: ''});
    t.setState({stockName: ''});
  }
  sellList(token) {
    let t = this;
    APICaller('master/sell/getall/', 'get', null, token).then(function (res) {
      t.setState({topLooserData: res});
      t.calculateSellCurrentValue();
      t.calculateSellInvestedValue();
      console.log(res)
    });
  }

  buyList(token) {
    let t = this;
    APICaller('master/buy/getall/', 'get', null, token).then(function (res) {
      t.setState({topGainerData: res});
      t.calculateBuyCurrentValue();
      t.calculateBuyInvestedValue();
    });
  }

  getSingleStockData(data) {
    let t = this;
  }
  getSingleSellData(data) {
    let t = this;
    this.toggleModal(true);
    const lowerCased = data.symbol.toLowerCase();
    let list = t.state.fullData.filter((v) =>
      v.symbol.toLowerCase().includes(lowerCased),
    );

    t.setState({
      stockSymbol: data.symbol,
      stockName: list[0].name,
      symbolPrice: data.price,
      stockQuantity: data.qty,
      stockId: data.stock,
    });
    // console.log(data)
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  makeRemoteRequest = () => {
    let t = this;
    APICaller('master/stock-list/', 'Get', null, t.state.token).then(function (
      res,
    ) {
      t.setState({fullData: res});
    });
  };

  handleSearch = (text) => {
    let t = this;
    t.setState({stockName: text});
    if (text != '') {
      let data = t.state.fullData.filter(function (v) {
        return v.name.toLowerCase().includes(text) ? v : null;
      });
      t.setState({data: data});
    } else {
      t.setState({data: []});
    }
  };
  selecetdStock(stock) {
    let t = this;
    // this._interval = setInterval(() => {

    //   // console.log('call')
    // }, 2000)
    // this._interval = setInterval(() => {
    t.getSymbolData(stock.symbol);
    // }, 1000);

    t.setState({stockId: stock.id});
    t.setState({stockName: stock.name});
    t.setState({stockSymbol: stock.symbol});
    t.setState({data: []});
  }

  getSymbolData(symbol) {
    let t = this;
      const price_options = {
        method: 'GET',
        url:'https://mboum-finance.p.rapidapi.com/qu/quote/financial-data',
        params: {symbol: symbol},
        headers: {
          'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
        },
      };
      // arr = response.data;
      axios.request(price_options).then(function (res) {
        let finance = res.data.financialData;
        t.setState({
            symbolPrice: finance.currentPrice.raw,
            actualPrice: finance.currentPrice.raw,
         });
      });
  }
  getCurrentPrice(symbol,v){
    let t = this;
    let finance;
    const price_options = {
        method: 'GET',
        url:'https://mboum-finance.p.rapidapi.com/qu/quote/financial-data',
        params: {symbol: symbol},
        headers: {
          'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
        },
      };
      // arr = response.data;
      axios.request(price_options).then(function (res) {
        finance = res.data.financialData;
        let value = t.state.currentValue+(finance.currentPrice.raw*v.qty);
        t.setState({currentValue:value});
      });
  }
  onChangedQty(qty) {
    let basePrice = this.state.actualPrice;
    let tempPrice = this.state.symbolPrice * qty;
    this.setState({stockQuantity: qty});
    if (qty == '' || qty <= 0 || qty == null) {
      this.setState({symbolPrice: basePrice});
    } else {
      this.setState({symbolPrice: tempPrice});
    }
  }
  saveBuy() {
    let t = this;
    let today = new Date();
    let todayDate = GlobalVar.dateToYMD(today);
    let data = {
      user: this.state.userId,
      stock: this.state.stockId,
      symbol: this.state.stockSymbol,
      price: this.state.symbolPrice,
      qty: this.state.stockQuantity,
      buy_date: todayDate,
    };
    APICaller('master/buy/create/', 'post', data, this.state.token).then(
      function (res) {
        if (res) {
          let buyResObj = {};
          buyResObj = res;
          let tempResAry = [];
          tempResAry = t.state.topGainerData;
          tempResAry.push(buyResObj);
          t.setState({topGainerData: tempResAry});
          t.setState({modalVisible: false});

          t.setState({success: true});
          t.refs.customToast.showToast(
            data.symbol + ' Buy successfully !',
            5000,
          );
         
        }
      },
    );
  }
  saveSell() {
    let t = this;
    let today = new Date();
    let todayDate = GlobalVar.dateToYMD(today);
    let data = {
      user: this.state.userId,
      stock: this.state.stockId,
      symbol: this.state.stockSymbol,
      price: this.state.symbolPrice,
      qty: this.state.stockQuantity,
      sell_date: todayDate,
    };
    APICaller('master/sell/create/', 'post', data, this.state.token).then(
      function (res) {
        if (res) {
          let buyResObj = {};
          buyResObj = res;
          let tempResAry = [];
          tempResAry = t.state.topLooserData;
          tempResAry.push(buyResObj);
          t.setState({topLooserData: tempResAry});
          t.setState({modalVisible: false});

          t.setState({success: true});
          t.refs.customToast.showToast(
            data.symbol + ' Sell successfully !',
            5000,
          );
        }
      },
    );
  }

  calculateBuyCurrentValue(){
    let t = this;
    t.setState({currentValue:0});
    let currentValue = 0;
    t.state.topGainerData.map((v,i)=>{
      t.getCurrentPrice(v.symbol,v);
    });
  }

  calculateBuyInvestedValue(){
    let t = this;
    t.setState({investedValue:0});
    let invested = 0;
    t.state.topGainerData.map((v,i)=>{
      console.log(v);
      invested = invested+v.price;
      if(i==t.state.topGainerData.length-1)
        t.setState({investedValue:invested});
    });
  }

  async calculateSellCurrentValue(){
    let t = this;
    t.setState({currentValue:0});
    let currentValue = 0;
    t.state.topLooserData.map((v,i)=>{
      t.getCurrentPrice(v.symbol,v);
    });
  }

  calculateSellInvestedValue(){
    let t = this;
    t.setState({investedValue:0});
    let invested = 0;
    t.state.topLooserData.map((v,i)=>{
      invested = invested+v.price;
      if(i==t.state.topLooserData.length-1)
        t.setState({investedValue:invested});
    });
  }
  render() {
    let t = this;
    return (
      <View>
        <ScrollView style={styles.container}>
          <View style={styles.head}>
            <View style={styles.rhead}>
              <TouchableOpacity
                style={{width: 20}}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#7b788a" />
              </TouchableOpacity>
              <Text style={styles.screenName}>{this.state.keyVal}</Text>
            </View>
            <View style={styles.rhead}>
              <Icon
                name="bell"
                size={20}
                color="#7b788a"
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>
          {this.state.keyVal == 'buy' ? (
            <View>
              <View>
                <View style={styles.keyState}>
                  <Text style={{fontSize: 15, color: '#fff', padding: 10}}>
                    BUY
                  </Text>
                  <TouchableOpacity
                    style={{width: 40, alignSelf: 'center'}}
                    onPress={() => {
                      this.toggleModal(true);
                    }}>
                    <Icon name="plus-circle" size={25} color="#0aa793" />
                  </TouchableOpacity>
                </View>
                <View style={styles.keyCon}>
                  <Text style={styles.keyConSymbol}>Symbol</Text>
                  <Text style={styles.keyConSymbol}>Price </Text>
                  <Text style={styles.keyConSymbol}>QTY </Text>
                  <Text style={styles.keyConSymbol}>Buy Date </Text>
                </View>
                {this.state.topGainerData.map((res, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.keyStateList, styles.borderKeylist]}
                    onPress={() => this.getSingleStockData(res)}>
                    <Text style={[styles.keyConSymbol, styles.symbol]}>
                      {res.symbol}
                    </Text>
                    <Text style={[styles.keyConSymbol, styles.price]}>
                      {res.price}
                    </Text>
                    <Text style={[styles.keyConSymbol, styles.qty]}>{res.qty}</Text>
                    <Text style={[styles.keyConSymbol, styles.date]}>
                      {res.buy_date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{padding: 10}}>
                <Dash
                  style={{flexDirection: 'row'}}
                  dashStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#fff',
                      marginVertical: 10,
                      fontFamily: Fonts.type.RubikMedium,
                    }}>
                    Buying Averages
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        opacity: 0.5,
                        alignSelf: 'center',
                      }}>
                      Current value
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        alignSelf: 'center',
                      }}>
                      {this.state.currentValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        opacity: 0.5,
                        alignSelf: 'center',
                      }}>
                      Invested value
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        alignSelf: 'center',
                      }}>
                      {this.state.investedValue}
                    </Text>
                  </View>
                  
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        opacity: 0.5,
                        alignSelf: 'center',
                      }}>
                      Net Worth
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        alignSelf: 'center',
                      }}>
                      55,000
                    </Text>
                  </View>
                </View>
                <Dash
                  style={{flexDirection: 'row'}}
                  dashStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}
                />
              </View>
            </View>
          ) : (
            <View>
              <View>
                <View style={styles.keyState}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#fff',
                      padding: 10,
                      fontFamily: Fonts.type.RubikBold,
                    }}>
                    SELL
                  </Text>
                  <TouchableOpacity
                    style={{width: 40, alignSelf: 'center'}}
                    onPress={() => {
                      this.toggleModal(true);
                    }}>
                    <Icon name="plus-circle" size={25} color="#0aa793" />
                  </TouchableOpacity>
                </View>
                <View style={styles.keyCon}>
                  <Text style={styles.keyConSymbol}>Symbol</Text>
                  <Text style={styles.keyConSymbol}>Price </Text>
                  <Text style={styles.keyConSymbol}>QTY </Text>
                  <Text style={styles.keyConSymbol}>Sell Date </Text>
                </View>
                {this.state.topLooserData.map((res, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.keyStateList, styles.borderKeylist]}
                    onPress={() => this.getSingleSellData(res)}>
                    <Text style={[styles.keyConSymbol, styles.symbol]}>
                      {res.symbol}
                    </Text>
                    <Text style={[styles.keyConSymbol, styles.price]}>
                    {res.price}
                    </Text>
                    <Text style={[styles.keyConSymbol, styles.qty]}>{res.qty}</Text>
                    <Text style={[styles.keyConSymbol, styles.date]}>
                      {res.sell_date}
                     
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{padding: 10}}>
                <Dash
                  style={{flexDirection: 'row'}}
                  dashStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#fff',
                      marginVertical: 10,
                    }}>
                    Selling Averages
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        opacity: 0.5,
                        alignSelf: 'center',
                      }}>
                      Current value
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        alignSelf: 'center',
                      }}>
                      {this.state.currentValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        opacity: 0.5,
                        alignSelf: 'center',
                      }}>
                      Invested value
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        alignSelf: 'center',
                      }}>
                      {this.state.investedValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        opacity: 0.5,
                        alignSelf: 'center',
                      }}>
                      Net Worth
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        alignSelf: 'center',
                      }}>
                      55,000
                    </Text>
                  </View>
                </View>
                <Dash
                  style={{flexDirection: 'row'}}
                  dashStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.centeredView}>
          {this.state.keyVal == 'sell' ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}>
              <View style={styles.modalView}>
                <Text style={styles.logotext}>Sell Now</Text>
                <View style={styles.loginBox}>
                  <View style={styles.inputView}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={this.handleSearch}
                      style={{
                        width: '95%',
                        fontSize: 14,
                      }}
                      placeholder="Stock"
                      textStyle={{color: '#000'}}
                      value={this.state.stockName}
                    />
                  </View>

                  <FlatList
                    style={{
                      marginTop: -20,
                      borderRadius: 5,
                      marginBottom: 15,
                      borderWidth: this.state.data.length < 1 ? 0 : 0.2,
                      height: this.state.data.length < 1 ? 0 : 200,
                      width: '90%',
                    }}
                    data={this.state.data}
                    renderItem={({item}) => (
                      <ScrollView showsVerticalScrollIndicator={true}>
                        <TouchableOpacity
                          onPress={() => this.selecetdStock(item)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              padding: 16,
                            }}>
                            <Text
                              style={{
                                color: '#000',
                              }}>{`${item.name}`}</Text>
                          </View>
                        </TouchableOpacity>
                      </ScrollView>
                    )}
                    ItemSeparatorComponent={this.renderSeparator}
                  />

                  <View style={styles.inputView}>
                    <TextInput
                      style={{color: '#000'}}
                      placeholder="Symbol"
                      editable={false}
                      value={this.state.stockSymbol}
                    />
                  </View>
                  <View style={styles.inputView}>
                    <TextInput
                      style={{color: '#000'}}
                      placeholder="Price"
                      editable={false}
                      value={
                        this.state.symbolPrice != null
                          ? this.state.symbolPrice.toString()
                          : ''
                      }
                    />
                  </View>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Quantity"
                      keyboardType="numeric"
                      onChangeText={(text) => this.onChangedQty(text)}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 15,
                    justifyContent: 'flex-end',
                  }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.toggleModal(!this.state.modalVisible)}>
                    <Text style={[styles.textStyle]}>CANCEL</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    disabled={
                      (!this.state.stockName ? true : false,
                      !this.state.stockSymbol ? true : false,
                      !this.state.price ? true : false,
                      this.state.stockQuantity <= 0 ? true : false,
                      !this.state.stockQuantity ? true : false)
                    }
                    onPress={() => this.saveSell()}>
                    <Text
                      style={
                        (!this.state.stockName
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        !this.state.stockSymbol
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        !this.state.price
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        this.state.stockQuantity <= 0
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        !this.state.stockQuantity
                          ? styles.savebtn
                          : styles.textStyleEnable)
                      }>
                      SAVE
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          ) : (
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}>
              <View style={styles.modalView}>
                <Text style={styles.logotext}>Buy Now</Text>
                <View style={styles.loginBox}>
                  <View style={styles.inputView}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={this.handleSearch}
                      style={{
                        width: '95%',
                        fontSize: 14,
                      }}
                      placeholder="Stock"
                      textStyle={{color: '#000'}}
                      value={this.state.stockName}
                    />
                  </View>

                  <FlatList
                    style={{
                      marginTop: -20,
                      borderRadius: 5,
                      marginBottom: 15,
                      borderWidth: this.state.data.length < 1 ? 0 : 0.2,
                      height: this.state.data.length < 1 ? 0 : 200,
                      width: '90%',
                    }}
                    data={this.state.data}
                    renderItem={({item}) => (
                      <ScrollView showsVerticalScrollIndicator={true}>
                        <TouchableOpacity
                          onPress={() => this.selecetdStock(item)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              padding: 16,
                            }}>
                            <Text
                              style={{
                                color: '#000',
                              }}>{`${item.name}`}</Text>
                          </View>
                        </TouchableOpacity>
                      </ScrollView>
                    )}
                    ItemSeparatorComponent={this.renderSeparator}
                  />

                  <View style={styles.inputView}>
                    <TextInput
                      style={{color: '#000'}}
                      placeholder="Symbol"
                      editable={false}
                      value={this.state.stockSymbol}
                    />
                  </View>
                  <View style={styles.inputView}>
                    <TextInput
                      style={{color: '#000'}}
                      placeholder="Price"
                      editable={false}
                      value={
                        this.state.symbolPrice != null
                          ? this.state.symbolPrice.toString()
                          : ''
                      }
                    />
                  </View>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Quantity"
                      keyboardType="numeric"
                      onChangeText={(text) => this.onChangedQty(text)}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 15,
                    justifyContent: 'flex-end',
                  }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.toggleModal(!this.state.modalVisible)}>
                    <Text style={[styles.textStyle]}>CANCEL</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    disabled={
                      (!this.state.stockName ? true : false,
                      !this.state.stockSymbol ? true : false,
                      !this.state.price ? true : false,
                      this.state.stockQuantity <= 0 ? true : false,
                      !this.state.stockQuantity ? true : false)
                    }
                    onPress={() => this.saveBuy()}>
                    <Text
                      style={
                        (!this.state.stockName
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        !this.state.stockSymbol
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        !this.state.price
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        this.state.stockQuantity <= 0
                          ? styles.savebtn
                          : styles.textStyleEnable,
                        !this.state.stockQuantity
                          ? styles.savebtn
                          : styles.textStyleEnable)
                      }>
                      SAVE
                    </Text>
                  </Pressable>
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
  container: {
    backgroundColor: '#0E0B1A',
    height: '100%',
  },
  keyConSymbol: {
    fontSize: 12,
    color: '#fff',
    width: 70,
    paddingVertical: 15,
  },
  symbol: {
    fontSize: 13,
  },
  price: {
    fontSize: 13,
    color: '#fff',
  },
  qty: {
    fontSize: 13,
    color: '#fff',
  },
  date: {
    fontSize: 12,
    color: '#fff',
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
    textTransform: 'capitalize',
  },
  marketTd: {
    backgroundColor: '#1A152A',
    marginHorizontal: 10,
    borderRadius: 4,
  },
  keyState: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1A152A',
    margin: 10,
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
    fontSize: 13,
  },
  keyCon: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  keyStateList: {
    backgroundColor: '#1A152A',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  borderKeylist: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.2,
  },

  keyConLTPText: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'right',
  },

  // modal
  savebtn: {
    color: '#ccc',
  },
  watchlistInput: {
    borderColor: '#ccc',
    borderWidth: 0.5,
    height: 35,
    marginTop: 0,
    marginLeft: 0,
    borderRadius: 5,
  },
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
    // marginHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,

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

  textStyleEnable: {
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
  //end modal
  // form
  loginBox: {
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    padding: 20,
  },
  logotext: {
    color: '#0AA793',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  inputView: {
    width: '90%',
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginBottom: 20,
    paddingRight: 0,
    borderWidth: 0.2,
    borderColor: '#333333',
  },

  inputText: {
    color: '#fff',
    fontSize: 14,
    width: '95%',
  },
  //form ends
});
