import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./stack-navigator";

class RootNavigator extends Component {
  render() {
    return (
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    );
  }
}

export default RootNavigator;
