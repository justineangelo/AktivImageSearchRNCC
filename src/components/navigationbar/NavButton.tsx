import ViewComponent from "components/ViewComponent";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "assets";

interface NavButtonProps {
  style?: {};
  icon: "chevron-left";
  onPress?: () => void;
}

class NavButton extends Component<NavButtonProps> {
  render() {
    const { style, icon, onPress } = this.props;

    return (
      <ViewComponent
        style={{ ...styles.container, ...style }}
        onPress={onPress}
      >
        <Entypo
          style={styles.icon}
          name={icon}
          size={24}
          color={colors.icon.active}
        />
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    backgroundColor: colors.button.main,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  icon: {},
});

export default NavButton;
