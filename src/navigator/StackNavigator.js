import React from "react";
import {createStackNavigator} from 'react-navigation-stack';

import Home from '../screen/Home';
import Seacrh from '../screen/Search';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#9AC4F8",
      },
      headerTintColor: "white",
      headerBackTitle: "Back",
    }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Search" component={Seacrh} />
  </Stack.Navigator>
  );
}

export default MainStackNavigator;
