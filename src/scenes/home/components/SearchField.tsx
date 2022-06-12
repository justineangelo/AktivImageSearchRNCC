import React, { Component } from "react";
import { StyleSheet, TextInput } from "react-native";
import { colors, svg } from "assets";
import { SVG, ViewComponent } from "components";

interface SearchFieldProps {
  style?: {};
  value?: string;
  onChangeText?: (text: string) => void;
  onSearchPress?: () => void;
}

class SearchField extends Component<SearchFieldProps> {
  render() {
    const { style, value, onChangeText, onSearchPress } = this.props;

    return (
      <ViewComponent style={{ ...styles.container, ...style }}>
        <ViewComponent style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            value={value}
            placeholder={"Search"}
            returnKeyType={"search"}
            onChangeText={onChangeText}
            onSubmitEditing={onSearchPress}
          />
          <ViewComponent style={styles.searchButton} onPress={onSearchPress}>
            <SVG obj={svg.search} fill={"#ffffff"} height={20} width={20} />
          </ViewComponent>
        </ViewComponent>
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: { height: 140 },
  inputContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: "row",
    height: 48,
    borderRadius: 29,
    backgroundColor: "#ffffff",
    alignItems: "center",
    overflow: "hidden",
  },
  inputText: {
    flex: 1,
    fontSize: 20,
    marginHorizontal: 20,
    color: colors.text.main,
  },
  searchButton: {
    aspectRatio: 1,
    height: "100%",
    backgroundColor: colors.button.active,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchField;
