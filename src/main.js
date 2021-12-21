import React, {Component} from 'react';
import {Text, View, Linking, TextInput,LogBox} from 'react-native';
import AppNavigation from './navigator';
export default class App extends Component {
  async componentDidMount() {
    LogBox.ignoreAllLogs (true);
    this.fontScalling();
  }

  fontScalling() {
    TextInput.defaultProps = {
      ...(TextInput.defaultProps || {}),
      allowFontScaling: false,
    };
    Text.defaultProps = {
      ...(Text.defaultProps || {}),
      allowFontScaling: false,
    };
  }



  render() {
    return (
      <View style={{flex: 1}}>
        <AppNavigation />
      </View>
    );
  }
}