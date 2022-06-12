import React, { Component } from "react";
import {
  Keyboard,
  Animated,
  KeyboardEvent,
  StyleSheet,
  View,
  LayoutChangeEvent,
  Dimensions,
  EmitterSubscription,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedView = Animated.createAnimatedComponent(View);

interface KeyboardPresenterProps {
  useSafeArea: boolean;
  overrideBottomOffset?: number;
  keyboardDidShow?: () => void;
  keyboardDidHide?: () => void;
}

interface KeyboardPresenterState {
  bottomMeasureOffset: number;
  bottomOffset: Animated.Value;
}

class KeyboardPresenterView extends Component<
  KeyboardPresenterProps,
  KeyboardPresenterState
> {
  static defaultProps = { useSafeArea: true };

  constructor(props: KeyboardPresenterProps) {
    super(props);

    this.state = {
      bottomMeasureOffset: 0,
      bottomOffset: new Animated.Value(0),
    };
  }

  private view?: View;
  private showEmitter?: EmitterSubscription;
  private hideEmitter?: EmitterSubscription;

  componentDidMount() {
    this.showEmitter = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.hideEmitter = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.showEmitter?.remove();
    this.hideEmitter?.remove();
  }

  render() {
    const { useSafeArea, children } = this.props;
    const { bottomOffset } = this.state;

    return (
      <View
        style={styles.container}
        ref={this.containerRef}
        onLayout={this.onLayout}
      >
        <AnimatedView
          style={{ ...styles.keyboardContainer, bottom: bottomOffset }}
        >
          {useSafeArea ? (
            <SafeAreaView style={styles.safeContainer}>{children}</SafeAreaView>
          ) : (
            children
          )}
        </AnimatedView>
      </View>
    );
  }

  private onLayout = (event: LayoutChangeEvent) => {
    this.measure();
  };

  private containerRef = (ref: View) => {
    this.view = ref;
  };

  private measure = (completion?: () => void) => {
    this.view?.measure((x, y, width, height, pageX, pageY) => {
      const bottomMeasureOffset =
        Dimensions.get("window").height - (pageY + height);

      this.setState({ bottomMeasureOffset }, completion);
    });
  };

  private keyboardWillShow = (event: KeyboardEvent) => {
    const { overrideBottomOffset, keyboardDidShow } = this.props;
    const { bottomMeasureOffset, bottomOffset } = this.state;

    Animated.timing(bottomOffset, {
      duration: event.duration,
      toValue:
        event.endCoordinates.height -
        (overrideBottomOffset ?? bottomMeasureOffset),
      useNativeDriver: false,
    }).start(keyboardDidShow);
  };

  private keyboardWillHide = (event: KeyboardEvent) => {
    const { keyboardDidHide } = this.props;
    const { bottomOffset } = this.state;

    Animated.timing(bottomOffset, {
      duration: event.duration,
      toValue: 0,
      useNativeDriver: false,
    }).start(keyboardDidHide);
  };
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  keyboardContainer: { ...StyleSheet.absoluteFillObject },
  safeContainer: { flex: 1 },
});

export default KeyboardPresenterView;
