import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  MeasureOnSuccessCallback,
  MeasureInWindowOnSuccessCallback,
} from "react-native";
import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";

interface MeasureValue {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX?: number;
  pageY?: number;
}

interface ViewComponentProps {
  style?: any;
  colors?: string | string[];
  locations?: number[];
  disabled?: boolean;
  start?: LinearGradientPoint;
  end?: LinearGradientPoint;
  activeOpacity: number;
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  measure?: (value: MeasureValue) => void;
  measureInWindow?: (value: MeasureValue) => void;
}

class ViewComponent extends Component<ViewComponentProps> {
  static defaultProps = { activeOpacity: 0.2 };

  private touchableOpacity?: TouchableOpacity;
  private baseComponent?: BaseComponent;

  render() {
    const {
      style,
      colors,
      locations,
      disabled,
      activeOpacity,
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
    } = this.props;
    let gradientColors: string[] = [];
    let updatedStyle: any;
    const backgroundColors = colors ?? style?.backgroundColor;

    if (Array.isArray(backgroundColors) && backgroundColors.length > 0) {
      if (backgroundColors.length > 1) {
        gradientColors = backgroundColors;
        updatedStyle = {
          ...style,
          backgroundColor: undefined,
        };
      } else {
        updatedStyle = {
          ...style,
          backgroundColor: backgroundColors[0],
        };
      }
    } else {
      if (backgroundColors) {
        updatedStyle = {
          ...style,
          backgroundColor: backgroundColors,
        };
      } else {
        updatedStyle = style;
      }
    }

    if (onPress || onLongPress || onPressIn || onPressOut) {
      //touchable opacity opacity is not updated realtime when set to prop not until it is pressed
      return (
        <TouchableOpacity
          style={updatedStyle}
          disabled={disabled}
          activeOpacity={activeOpacity}
          ref={this.setupTRef}
          onLayout={this.onLayout}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <BaseComponent
            style={refineAbsStyle(updatedStyle)}
            props={this.props}
            colors={gradientColors}
            locations={locations}
          />
          {this.props.children}
        </TouchableOpacity>
      );
    } else {
      return (
        <BaseComponent
          disabled={disabled}
          props={this.props}
          colors={gradientColors}
          locations={locations}
          style={updatedStyle}
          ref={this.setupBRef}
          onLayout={this.onLayout}
        />
      );
    }
  }

  private onLayout = (event: LayoutChangeEvent) => {
    const { onLayout } = this.props;

    onLayout && onLayout(event);
    this.measure();
  };

  private setupTRef = (ref: TouchableOpacity) => {
    this.touchableOpacity = ref;
  };

  private setupBRef = (ref: BaseComponent) => {
    this.baseComponent = ref;
  };

  public measure = () => {
    const { measure, measureInWindow } = this.props;

    if (this.touchableOpacity) {
      if (measure) {
        this.touchableOpacity.measure((x, y, width, height, pageX, pageY) => {
          measure({ x, y, width, height, pageX, pageY });
        });
      }

      if (measureInWindow) {
        this.touchableOpacity.measureInWindow((x, y, width, height) => {
          measureInWindow({ x, y, width, height });
        });
      }
    }

    if (this.baseComponent) {
      if (measure) {
        this.baseComponent.measure((x, y, width, height, pageX, pageY) => {
          measure({ x, y, width, height, pageX, pageY });
        });
      }

      if (measureInWindow) {
        this.baseComponent.measureInWindow((x, y, width, height) => {
          measureInWindow({ x, y, width, height });
        });
      }
    }
  };
}

interface BaseComponentProps {
  style?: {};
  disabled?: boolean;
  props?: any;
  colors: string[];
  locations?: number[];
  onLayout?: (event: LayoutChangeEvent) => void;
  measure?: (value: MeasureValue) => void;
  measureInWindow?: (value: MeasureValue) => void;
}

class BaseComponent extends Component<BaseComponentProps> {
  private view?: View;

  render() {
    const { style, disabled, props, colors, locations, onLayout } = this.props;

    return (
      <View
        style={style}
        pointerEvents={disabled ? "none" : undefined}
        onLayout={onLayout}
        ref={this.setupVRef}
      >
        {colors.length > 0 ? (
          <LinearGradient
            style={refineAbsStyle(style)}
            colors={colors}
            locations={locations}
            start={props?.start ?? { x: 1, y: 0 }}
            end={props?.end ?? { x: 0, y: 1 }}
            onLayout={onLayout}
          />
        ) : null}
        {props?.onPress ? null : props?.children}
      </View>
    );
  }

  private setupVRef = (ref: View) => {
    this.view = ref;
  };

  public measure = (callback: MeasureOnSuccessCallback) => {
    this.view?.measure(callback);
  };

  public measureInWindow = (callback: MeasureInWindowOnSuccessCallback) => {
    this.view?.measureInWindow(callback);
  };
}

const refineAbsStyle = (style?: any) => {
  return {
    ...StyleSheet.absoluteFillObject,
    borderRadius: style?.borderRadius,
    borderTopLeftRadius: style?.borderTopLeftRadius,
    borderTopRightRadius: style?.borderTopRightRadius,
    borderBottomLeftRadius: style?.borderBottomLeftRadius,
    borderBottomRightRadius: style?.borderBottomRightRadius,
  };
};

export { MeasureValue };
export default ViewComponent;
