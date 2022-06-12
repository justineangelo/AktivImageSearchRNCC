import React, { PureComponent } from "react";
import { StyleSheet, Text } from "react-native";

//assets
import { colors, svg } from "assets";

//components
import { ViewComponent, ImageComponent, SVG } from "components";

//data-types
import { ImageData } from "data-types/response";

//redux
import { mapDispatchToProps, StateToProps } from "store/reducers";
import { connect } from "react-redux";

const Constants = {
  countSize: 16,
  iconSize: { height: 20, width: 20 },
};

interface SearchImageProps extends StateToProps {
  style?: {};
  data: ImageData;
  autoResizing: boolean;
  onPress?: (data: ImageData) => void;
  onBookmarkPress?: (data: ImageData) => void;
  onLikePress?: (data: ImageData) => void;
  onCommentPress?: (data: ImageData) => void;
}

class SearchImage extends PureComponent<SearchImageProps> {
  static defaultProps = {
    autoResizing: false,
  };

  render() {
    const { style, data, userReducer } = this.props;
    const isCollected = userReducer!.collections[data.id] ? true : false;
    const isLiked = userReducer!.likes[data.id] ? true : false;

    return (
      <ViewComponent
        style={{ ...styles.container, ...this.autoResizeStyle(), ...style }}
        onPress={this.onPress}
      >
        <ImageComponent style={styles.image} imageURL={data.webformatURL} />
        <SVG
          style={styles.bookmarkIcon}
          obj={svg.bookmark}
          fill={isCollected ? colors.icon.active : colors.icon.inActive}
          enabled={true}
          {...Constants.iconSize}
          onPress={this.onBookmarkPress}
        />
        <ViewComponent
          style={styles.subContainer}
          colors={["#00000090", "#ffffff00"]}
        >
          <SVG
            style={{
              ...styles.icon,
              marginRight: 1,
              transform: [{ translateY: -2 }],
            }}
            obj={svg.like}
            fill={isLiked ? colors.icon.active : colors.icon.inActive}
            enabled={true}
            {...Constants.iconSize}
            onPress={this.onLikePress}
          />
          {data.likes ? (
            <Text style={styles.textCount}>
              {isLiked ? data.likes + 1 : data.likes}
            </Text>
          ) : null}
          <SVG
            style={{ ...styles.icon }}
            obj={svg.comment}
            fill={colors.icon.inActive}
            enabled={true}
            {...Constants.iconSize}
            onPress={this.onCommentPress}
          />
          <Text style={styles.textCount}>{data.comments}</Text>
        </ViewComponent>
      </ViewComponent>
    );
  }

  private onPress = () => {
    const { data, onPress } = this.props;

    onPress && onPress(data);
  };

  private onBookmarkPress = () => {
    const { data, onBookmarkPress } = this.props;

    onBookmarkPress && onBookmarkPress(data);
  };

  private onLikePress = () => {
    const { data, onLikePress } = this.props;

    onLikePress && onLikePress(data);
  };

  private onCommentPress = () => {
    const { data, onCommentPress } = this.props;

    onCommentPress && onCommentPress(data);
  };

  private autoResizeStyle = () => {
    const { autoResizing, data } = this.props;

    if (autoResizing && data.webformatWidth && data.webformatHeight) {
      return {
        flex: 0,
        height: 100,
        aspectRatio: data.webformatWidth / data.webformatHeight,
      };
    }
    return {};
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, height: 200, backgroundColor: "#ffffff" },
  image: { flex: 1 },
  bookmarkIcon: { position: "absolute", top: 8, right: 8 },
  subContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
  },
  icon: { marginLeft: 4 },
  textCount: {
    fontSize: Constants.countSize,
    color: colors.text.active,
    marginLeft: 1,
  },
});

const mapStateToProps = function (state: StateToProps): StateToProps {
  return { userReducer: state.userReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchImage);
