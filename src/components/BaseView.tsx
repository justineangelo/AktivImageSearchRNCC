import { colors } from "assets";
import React, { Component } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//components
import ViewComponent from "./ViewComponent";

interface BaseViewProps {
  style?: StyleProp<ViewStyle>;
  useSafeArea?: boolean;
  headerContent?: JSX.Element;
  onLayout?: (layoutEvent: LayoutChangeEvent) => void;
}

class BaseView extends Component<BaseViewProps> {
  static defaultProps = {
    useSafeArea: true,
  };

  render() {
    const { style, useSafeArea, headerContent, children, onLayout } =
      this.props;

    return (
      <ViewComponent
        style={Object.assign({}, styles.container, style)}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        onLayout={onLayout}
      >
        {useSafeArea ? (
          <SafeAreaView style={{ flex: 1 }}>
            {headerContent}
            {children}
          </SafeAreaView>
        ) : (
          <>
            {headerContent}
            {children}
          </>
        )}
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.main },
});

export default BaseView;
