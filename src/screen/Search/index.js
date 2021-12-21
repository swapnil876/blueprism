import React, {Component, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalVar from '../../global';
// import {
//   Fonts,
// } from '../../common/assets/fonts/index';
import axios from 'axios';
import {APICaller} from '../../util/apiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from "lodash";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      searchdata: [],
      token: '',
      serachText: '',
    };
    this.changeTextDebouncer = debounce(this.makeRemoteRequest, 500);
  }

  componentWillMount() {
    let t = this;
    AsyncStorage.getItem('authToken').then((value) => {
      value = JSON.parse(value);
      if (value != null) {
        t.setState({token: value.token});
        // if (t.state.token) {
        //   this.makeRemoteRequest()
        //   // this._interval = setInterval(() => {

        //   // }, 2000)
        // }
      }
    });
  }
  makeRemoteRequest = (text) => {
    let t = this;
    // console.log(text);
    t.setState({
      dataSource: [],
      loading: true
    });
    if(text != ''){
      const options = {
        method: 'GET',
        url:'https://mboum-finance.p.rapidapi.com/qu/quote',
        params: {symbol: text},
        headers: {
          'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
          'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
        },
      };
      t.setState({loading: false});
      let arr = []
      axios.request(options).then(function (response) {
        if(response.data.length > 0){
          const price_options = {
            method: 'GET',
            url:'https://mboum-finance.p.rapidapi.com/mo/module/',
            params: {symbol: text,module: 'asset-profile,financial-data'},
            headers: {
              'x-rapidapi-key': '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
              'x-rapidapi-host': 'mboum-finance.p.rapidapi.com',
            },
          };
          // arr = response.data;
          axios.request(price_options).then(function (xtraInfoResponse) {
            console.log(xtraInfoResponse.data)
            arr.push(xtraInfoResponse.data);
            arr[0].basic = response.data[0];
            console.log('arr',arr);
            t.setState({
              dataSource: arr,
              loading: false
            });
          });
          
        }
      }).catch(function (error) {
        console.error('catcherror',error);
        t.setState({loading: false});
      });
    }
    
    // axios
    // .request(options)
    // .then(function (symRes) {
    //   console.log(symRes.data);
    //   if (symRes.data != null && symRes.data.ticker_symbol!= null) {
    //     const info = {
    //       method: 'GET',
    //       url:
    //         'https://stock-market-data.p.rapidapi.com/stock/company-info?ticker_symbol=' +
    //         symRes.data.ticker_symbol,
    //       headers: {
    //         'x-rapidapi-key':
    //           '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
    //         'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
    //       },
    //     };
    //     axios.request(info).then(function (infoRes) {
          
    //       if (infoRes.data != null) {
    //         const options = {
    //           method: 'GET',
    //           url:
    //             'https://stock-market-data.p.rapidapi.com/stock/quote?ticker_symbol=' +
    //             symRes.data.ticker_symbol,
    //           headers: {
    //             'x-rapidapi-key':
    //               '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
    //             'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
    //           },
    //         };
    //         axios
    //         .request(options)
    //         .then(function (qutRes) {
    //             let tempRes = {};
    //             let temArry = [];
    //             tempRes = {
    //               data: qutRes.data.quote,
    //               sym: symRes.data,
    //               info: infoRes.data.company_profile,
    //             };
    //             temArry.push(tempRes);
    //             if (tempRes.data!=null && tempRes.sym.ticker_symbol!=null && tempRes.info.Exchange!=null) {
    //               t.setState({
    //                 dataSource: temArry,
    //               });
    //               console.log('bh', t.state.dataSource);
    //             }
    //             else{
    //               t.setState({
    //                 dataSource: []
    //               });
    //             }
    //             t.setState({loading: false});
    //         })
    //         .catch(function (error) {
    //           // console.error(error);
    //         });
    //       }
    //       else{
    //         t.setState({loading: false,dataSource: []});
    //       }
    //     });
    //   }
    //   else{
    //     t.setState({loading: false,dataSource: []});
    //   }
    // })
    // .catch(function (error) {
    //   // console.error(error);
    // });
  };
  getSingleStockData(data) {
    let t = this;
    console.log('####',data)
    t.props.navigation.navigate('Quote', {
      singleData: data,
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.search}>
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
            onChangeText={(text) => {
              this.changeTextDebouncer(text);
            }}
          />
        </View>

        {<ScrollView showsVerticalScrollIndicator={false}>
          {this.state.loading ? (
            <ActivityIndicator
              color="green"
              size="large"
              style={{marginVertical: '60%'}}
            />
          ) : (
            <FlatList
              style={{
                borderRadius: 5,
                marginBottom: 15,
                borderWidth: this.state.dataSource.length < 1 ? 0 : 0.2,

                width: '100%',
              }}
              data={this.state.dataSource}
              renderItem={({item}) => (
                <ScrollView showsVerticalScrollIndicator={true}>
                  {this.state.dataSource.length == 0 ? (
                    <View>No Match Found</View>
                  ) : (
                    <TouchableOpacity style={styles.keyStateList}  onPress={() => this.getSingleStockData(item)}>
                      <View style={{width: '30%'}}>
                        <Text style={styles.keyConSymbol}>
                          {item.basic.shortName}
                        </Text>
                      </View>
                      <View style={{width: '30%'}}>
                        <Text style={styles.keyConLTPText}>
                           {item.financialData.currentPrice.raw}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          {item.basic.regularMarketPreviousClose >= item.financialData.currentPrice.raw?(<Icon
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
                          <Text style={styles.mrktUD}>
                          {GlobalVar.numDifferentiation(item.basic.regularMarketPreviousClose)}
                            {/*(
                              {item.data["Today's Change"]
                                ? item.data["Today's Change"].toFixed(2)
                                : '0.00'}
                              %)*/}
                          </Text>
                        </View>
                      </View>
                      <View style={{width: '40%'}}>
                        <Text style={styles.keyConLTPText}>
                          {item.assetProfile.country}
                        </Text>
                        <Text style={styles.keyConVol}>
                          {item.financialData.financialCurrency}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
              ItemSeparatorComponent={this.renderSeparator}
            />
          )}
        </ScrollView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E0B1A',
    flex: 1,
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
    fontSize: 12,
    color: '#fff',
  },
  keyConVol: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.6,
    textAlign: 'right',
  },

  keyConLTPText: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'right',
  },
  mrktUD: {
    color: 'green',
    marginLeft: 5,
    fontSize: 11,
  },
});

// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// // import {
// //   Fonts,
// // } from '../../common/assets/fonts/index';
// import axios from 'axios';
// import {APICaller} from '../../util/apiCaller';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// export default class Search extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: true,
//       dataSource: [],
//       searchdata: [],
//       token: '',
//     };
//   }

//   componentWillMount() {
//     let t = this;
//     AsyncStorage.getItem('authToken').then((value) => {
//       value = JSON.parse(value);
//       if (value != null) {
//         t.setState({token: value.token});
//         if (t.state.token) {
//           this.makeRemoteRequest(t.state.token);
//           // this._interval = setInterval(() => {

//           // }, 2000)
//         }
//       }
//     });
//   }
//   makeRemoteRequest = (token) => {
//     let t = this;
//     APICaller('master/stock-list/', 'get', null, token).then(function (
//       res,
//     ) {
//       let tempSearchData = [];

//       res.forEach((val, index) => {
//         console.log(val);
//         const options = {
//           method: 'GET',
//           url:
//             'https://stock-market-data.p.rapidapi.com/stock/quote?ticker_symbol=' +
//             val.symbol,
//           headers: {
//             'x-rapidapi-key':
//               '912411aa03msh275607bdd0f1eb9p17cb14jsn3e1998709d5b',
//             'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
//           },
//         };
//         axios
//           .request(options)
//           .then(function (qutRes) {
//             tempSearchData.push(val,qutRes);
//           })
//           .catch(function (error) {
//             console.error(error);
//           });
//       });

//       t.setState({
//         searchdata: res,
//       });
//     });
//   };

//   handleSearch = (text) => {
//     let t = this;
//     if (text != '') {
//       const lowerCased = text.toLowerCase();
//       let list = t.state.searchdata.filter((v) =>
//         v.name.toLowerCase().includes(lowerCased),
//       );
//       t.setState({
//         dataSource: list,
//       });
//       console.log(list);
//     } else {
//     }
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.search}>
//           <Icon
//             name="search"
//             size={20}
//             color="#7b788a"
//             style={{paddingHorizontal: 10, alignSelf: 'center'}}
//           />
//           <TextInput
//             style={styles.serachinput}
//             placeholder="Enter text to search"
//             placeholderTextColor="#726F81"
//             onChangeText={(text) => {
//               this.handleSearch(text);
//             }}
//           />
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={{padding: 10}}>
//             <Text
//               style={{
//                 textAlign: 'center',
//                 color: '#fff',
//                 fontSize: 15,
//                 opacity: 0.5,
//               }}>
//               Recently Searched
//             </Text>
//           </View>

//           <FlatList
//             style={{
//               borderRadius: 5,
//               marginBottom: 15,
//               borderWidth: this.state.dataSource.length < 1 ? 0 : 0.2,

//               width: '100%',
//             }}
//             data={this.state.dataSource}
//             renderItem={({item}) => (
//               <ScrollView showsVerticalScrollIndicator={true}>
//                 <TouchableOpacity
//                   onPress={() => this.selecetdStock(item)}
//                   style={styles.keyStateList}>
//                   <View style={{width: '30%'}}>
//                     <Text style={styles.keyConSymbol}>{item.name}</Text>
//                   </View>
//                   <View style={{width: '30%'}}>
//                     <Text style={styles.keyConLTPText}>971.30</Text>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'flex-end',
//                       }}>
//                       <Icon
//                         name="caret-up"
//                         size={12}
//                         color="green"
//                         style={{alignSelf: 'center'}}
//                       />
//                       <Text style={styles.mrktUD}>195.07</Text>
//                       <Text style={styles.mrktUD}>(0.07%)</Text>
//                     </View>
//                   </View>
//                   <View style={{width: '40%'}}>
//                     <Text style={styles.keyConLTPText}>{item.country}</Text>
//                     <Text style={styles.keyConVol}>{item.exchange}</Text>
//                   </View>
//                 </TouchableOpacity>
//               </ScrollView>
//             )}
//             ItemSeparatorComponent={this.renderSeparator}
//           />
//         </ScrollView>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#0E0B1A',
//     flex: 1,
//   },
//   serachinput: {
//     width: '100%',
//     color: '#fff',
//   },
//   search: {
//     flexDirection: 'row',
//     backgroundColor: '#312d42',
//     height: 50,
//     margin: 8,
//     borderRadius: 10,
//   },
//   keyStateList: {
//     backgroundColor: '#1A152A',
//     marginHorizontal: 10,
//     marginVertical: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//   },
//   keyConSymbol: {
//     fontSize: 12,
//     color: '#fff',
//   },
//   keyConVol: {
//     fontSize: 11,
//     color: '#fff',
//     opacity: 0.6,
//     textAlign: 'right',
//   },

//   keyConLTPText: {
//     fontSize: 10,
//     color: '#fff',
//     textAlign: 'right',
//   },
//   mrktUD: {
//     color: 'green',
//     marginLeft: 5,
//     fontSize: 11,
//   },
// });
