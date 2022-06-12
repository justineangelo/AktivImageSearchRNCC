import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";

//colors
import { colors } from "assets";

//components
import { ViewComponent } from "components";

interface LoaderProps {
  style?: {};
  hasMore: boolean;
  errorMesage?: string;
}

class Loader extends Component<LoaderProps> {
  render() {
    const { style, hasMore, errorMesage } = this.props;

    return (
      <ViewComponent style={{ ...styles.container, ...style }}>
        <ActivityIndicator animating={hasMore} />
        {!hasMore ? (
          <Text style={styles.text}>{errorMesage ?? "No more contents"}</Text>
        ) : null}
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: { height: 40, alignItems: "center", justifyContent: "center" },
  text: {
    fontSize: 16,
    color: colors.text.active,
  },
});

export default Loader;
