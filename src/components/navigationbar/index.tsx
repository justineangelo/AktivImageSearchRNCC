import React, { Component } from "react";
import { StyleSheet } from "react-native";

//components
import ViewComponent from "components/ViewComponent";
import NavButton from "./NavButton";
import { colors } from "assets";

interface NavigationBarProps {
  style?: {};
}

class NavigationBar extends Component<NavigationBarProps> {
  render() {
    const { style, children } = this.props;

    return (
      <ViewComponent style={{ ...styles.container, ...style }}>
        {children}
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 8,
    backgroundColor: colors.background.main,
    alignItems: "center",
  },
});

export { NavButton };
export default NavigationBar;
