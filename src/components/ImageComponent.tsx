import { images } from "assets";
import React, { Component } from "react";
import {
  Image,
  ImageErrorEventData,
  NativeSyntheticEvent,
  StyleSheet,
} from "react-native";

//components
import ViewComponent from "./ViewComponent";

interface ImageComponentProps {
  style?: {};
  disabled: boolean;
  imageStyle?: {};
  image?: any;
  imageURL?: string;
  resizeMode: "cover" | "contain" | "stretch" | "repeat" | "center";
  onPress?: () => void;
  onLoadError?: () => void;
}

interface ImageComponentState {
  showPlaceholder: boolean;
}

class ImageComponent extends Component<
  ImageComponentProps,
  ImageComponentState
> {
  static defaultProps = {
    disabled: true,
    resizeMode: "cover",
  };

  constructor(props: ImageComponentProps) {
    super(props);

    this.state = {
      showPlaceholder: !this.props.image && !this.props.imageURL,
    };
  }

  componentDidUpdate(prevProps: ImageComponentProps) {
    const hasChanges =
      prevProps.image != this.props.image ||
      prevProps.imageURL != this.props.imageURL;

    if (hasChanges) {
      this.setState({
        showPlaceholder: !this.props.image && !this.props.imageURL,
      });
    }
  }

  render() {
    const {
      style,
      disabled,
      imageStyle,
      image,
      imageURL,
      resizeMode,
      onPress,
    } = this.props;
    const { showPlaceholder } = this.state;
    const imageSource =
      image ?? imageURL
        ? {
            uri: imageURL,
          }
        : images.defaultLoading;
    return (
      <ViewComponent
        style={{ ...styles.container, ...style }}
        disabled={disabled}
        onPress={onPress}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            defaultSource={images.defaultLoading}
            resizeMode={resizeMode}
            style={{ ...styles.image, ...imageStyle }}
            resizeMethod="auto"
            progressiveRenderingEnabled
            onLoad={this.onImageLoad}
            onError={this.onImageError}
          />
        ) : null}
        {showPlaceholder ? (
          <ViewComponent style={styles.placeholderContainer}>
            {/* add place holder */}
          </ViewComponent>
        ) : null}
      </ViewComponent>
    );
  }

  private onImageLoad = () => {
    this.setState({ showPlaceholder: false });
  };

  private onImageError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    const { imageURL, onLoadError } = this.props;

    if (imageURL) {
      console.log("imageURL:", imageURL, "error:", error.nativeEvent.error);
      onLoadError && onLoadError();
    }
    this.setState({ showPlaceholder: true });
  };
}

const styles = StyleSheet.create({
  container: {},
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  placeholderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageComponent;
