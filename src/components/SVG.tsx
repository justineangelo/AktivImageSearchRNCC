import React, { Component, ReactText } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, rgbaArray, Stop } from "react-native-svg";

interface SVGObject {
  svg: JSX.Element;
  viewBox: string;
}

interface SVGProps {
  obj: SVGObject;
  x?: number;
  y?: number;
  height?: ReactText;
  width?: ReactText;
  strokeWidth?: number;
  fill?: string | string[];
  style?: StyleProp<ViewStyle>;
  fillRule?: "nonzero" | "evenodd";
  stroke?: string | number | rgbaArray;
  enabled?: boolean;
  onPress?: () => void;
}

class SVG extends Component<SVGProps> {
  static defaultProps = {
    strokeWidth: 1,
  };
  render() {
    const {
      obj,
      x,
      y,
      height,
      width,
      strokeWidth,
      fill,
      style,
      fillRule,
      stroke,
      enabled,
      onPress,
    } = this.props;
    let fillColor = fill ?? "#ffffff";
    let fillColorCount = 0;

    if (Array.isArray(fill) && fill.length > 0) {
      fillColorCount = fill.length;
      if (fillColorCount > 1) {
        fillColor = "url(#gradient)";
      } else {
        fillColor = fill[0];
      }
    }

    return (
      <Svg
        x={x}
        y={y}
        height={height}
        width={width}
        viewBox={obj.viewBox}
        style={style}
        disabled={!enabled}
        onPress={onPress}
      >
        <LinearGradientComponent fill={fill} fillCount={fillColorCount} />
        {React.cloneElement(obj.svg, {
          fill: fillColor,
          fillRule: fillRule,
          stroke: stroke,
          strokeWidth: strokeWidth,
        })}
      </Svg>
    );
  }
}

const LinearGradientComponent = (props: {
  fill?: string[] | string;
  fillCount: number;
}) => {
  if (Array.isArray(props.fill) && props.fillCount > 1) {
    const increment = 1 / (props.fillCount - 1);

    return (
      <Defs>
        <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
          {props.fill.map((color, index) => {
            return (
              <Stop
                key={index}
                offset={(increment * index).toString()}
                stopColor={color}
                stopOpacity="1"
              />
            );
          })}
        </LinearGradient>
      </Defs>
    );
  } else {
    return null;
  }
};

export { SVGObject };
export default SVG;
