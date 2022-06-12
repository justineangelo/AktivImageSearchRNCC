import { colors, svg } from "assets";
import { SVG, ViewComponent } from "components";
import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";

const Constants = {
  fontSize: 16,
  iconSize: { height: 16, width: 16 },
};

interface ButtonUserAction {
  type: "Follow";
}

interface ButtonImageAction {
  type: "Like" | "Colletion";
  count?: number;
}

type ButtonAction = ButtonUserAction | ButtonImageAction;

interface ButtonProps {
  style?: {};
  action: ButtonAction;
  isSelected: boolean;
  onPress?: (action: ButtonAction) => void;
}

class Button extends Component<ButtonProps> {
  static defaultProps = {
    isSelected: false,
  };

  render() {
    const { style, action, isSelected } = this.props;

    return (
      <ViewComponent
        style={{
          ...styles.container,
          ...containerStyle(action, isSelected),
          ...style,
        }}
        onPress={this.onPress}
      >
        {renderContent(action, isSelected)}
      </ViewComponent>
    );
  }

  private onPress = () => {
    const { action, onPress } = this.props;

    onPress && onPress(action);
  };
}

const containerStyle = (buttonAction: ButtonAction, isSelected: boolean) => {
  switch (buttonAction.type) {
    case "Follow":
      return isSelected ? styles.actionButtonActive : null;
    case "Like":
    case "Colletion":
      return isSelected ? styles.actionButtonActive : null;
  }
};

const renderContent = (buttonAction: ButtonAction, isSelected: boolean) => {
  switch (buttonAction.type) {
    case "Follow":
      return (
        <Text style={styles.text}>{isSelected ? "Unfollow" : "Follow"}</Text>
      );
    case "Like":
      return (
        <ViewComponent style={styles.rowContainer}>
          <SVG obj={svg.like} fill={"#ffffff"} {...Constants.iconSize} />
          {buttonAction.count ? (
            <Text style={{ ...styles.text, marginLeft: 4, color: "#ffffff" }}>
              {isSelected ? buttonAction.count + 1 : buttonAction.count}
            </Text>
          ) : null}
        </ViewComponent>
      );
    case "Colletion":
      return (
        <ViewComponent style={styles.rowContainer}>
          <SVG obj={svg.bookmark} fill={"#ffffff"} {...Constants.iconSize} />
          {buttonAction.count ? (
            <Text style={{ ...styles.text, marginLeft: 4, color: "#ffffff" }}>
              {isSelected ? buttonAction.count + 1 : buttonAction.count}
            </Text>
          ) : null}
        </ViewComponent>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    minWidth: 60,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.button.inActive,
  },
  text: { fontSize: Constants.fontSize, color: "#ffffff" },
  actionButtonActive: { backgroundColor: colors.button.active },
  rowContainer: { flexDirection: "row", alignItems: "center" },
});

export { ButtonAction };
export default Button;
