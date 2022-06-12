import React, { Component } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { ImageData } from "data-types/response";

//components
import { BaseView, ViewComponent, ImageComponent } from "components";
import NavigationBar, { NavButton } from "components/navigationbar";

//redux
import {
  DispatchToProps,
  mapDispatchToProps,
  StateToProps,
} from "store/reducers";
import { connect } from "react-redux";
import Button, { ButtonAction } from "./components/Button";
import { colors } from "assets";

interface DetailScreenProps
  extends NavigationProps,
    StateToProps,
    DispatchToProps {}

interface DetailScreenState {
  imageData?: ImageData;
  storedAction?: "comment";
}

class DetailScreen extends Component<DetailScreenProps, DetailScreenState> {
  constructor(props: DetailScreenProps) {
    super(props);

    this.state = {
      imageData: props.route?.params?.data,
      storedAction: props.route?.params?.action,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { userReducer } = this.props;
    const { imageData } = this.state;

    return (
      <BaseView
        headerContent={
          <NavigationBar>
            <NavButton icon={"chevron-left"} onPress={this.onBackPress} />
          </NavigationBar>
        }
        useSafeArea={true}
      >
        <ScrollView style={styles.container}>
          <ImageComponent
            style={{ ...styles.image, ...aspectRatio(imageData) }}
            imageURL={imageData?.webformatURL}
          />
          <ViewComponent style={styles.contentContainer}>
            <ViewComponent
              style={{ ...styles.rowContainer, justifyContent: "space-evenly" }}
            >
              <Button
                action={{ type: "Like", count: imageData?.likes }}
                isSelected={
                  userReducer!.likes[imageData?.id ?? ""] ? true : false
                }
                onPress={this.onButtonActionPress}
              />
              <Button
                action={{ type: "Colletion" }}
                isSelected={
                  userReducer!.collections[imageData?.id ?? ""] ? true : false
                }
                onPress={this.onButtonActionPress}
              />
            </ViewComponent>
            <ViewComponent style={styles.separator} />
            <ViewComponent style={styles.rowContainer}>
              <ImageComponent
                style={styles.userImage}
                imageURL={imageData?.userImageURL}
              />
              <ViewComponent
                style={{ marginLeft: 12, justifyContent: "space-between" }}
              >
                <Text style={styles.userNameText}>{imageData?.user}</Text>
                <Button
                  action={{ type: "Follow" }}
                  isSelected={
                    userReducer!.following[imageData?.user_id ?? ""]
                      ? true
                      : false
                  }
                  onPress={this.onButtonActionPress}
                />
              </ViewComponent>
            </ViewComponent>
            <ViewComponent style={styles.separator} />
            <ViewComponent style={styles.detailsContainer}>
              <ViewComponent style={styles.rowContainer}>
                <Text style={styles.detailsText}>Image type</Text>
                <Text
                  style={{ ...styles.detailsText, textTransform: "uppercase" }}
                >
                  {getFileExtn(imageData?.webformatURL, imageData?.type)}
                </Text>
              </ViewComponent>
              <ViewComponent style={styles.rowContainer}>
                <Text style={styles.detailsText}>Resolution</Text>
                <Text style={styles.detailsText}>
                  {imageData?.webformatWidth}x{imageData?.webformatHeight}
                </Text>
              </ViewComponent>
              <ViewComponent style={styles.rowContainer}>
                <Text style={styles.detailsText}>Tags</Text>
                <Text style={styles.detailsText}>{imageData?.tags}</Text>
              </ViewComponent>
              <ViewComponent style={styles.rowContainer}>
                <Text style={styles.detailsText}>Views</Text>
                <Text style={styles.detailsText}>{imageData?.views}</Text>
              </ViewComponent>
              <ViewComponent style={styles.rowContainer}>
                <Text style={styles.detailsText}>Downloads</Text>
                <Text style={styles.detailsText}>{imageData?.downloads}</Text>
              </ViewComponent>
            </ViewComponent>
          </ViewComponent>
        </ScrollView>
      </BaseView>
    );
  }

  private onBackPress = () => {
    this.props.navigation?.goBack();
  };

  private onButtonActionPress = (action: ButtonAction) => {
    const { userReducer } = this.props;
    const { imageData } = this.state;

    switch (action.type) {
      case "Like":
        if (imageData?.id) {
          this.props.setUserLikes({
            type: userReducer!.likes[imageData.id] ? "remove" : "add",
            image: imageData,
          });
        }
        break;
      case "Colletion":
        if (imageData?.id) {
          this.props.setUserCollections({
            type: userReducer!.collections[imageData.id] ? "remove" : "add",
            image: imageData,
          });
        }
        break;
      case "Follow":
        if (imageData?.user_id && imageData.user && imageData.userImageURL) {
          this.props.setUserFollowings({
            type: userReducer!.following[imageData.user_id] ? "remove" : "add",
            user: {
              id: imageData.user_id,
              name: imageData.user,
              imageURL: imageData.userImageURL,
            },
          });
        }
        break;
    }
  };
}

const aspectRatio = (data?: ImageData) => {
  if (data?.webformatHeight && data.webformatWidth) {
    return { aspectRatio: data.webformatWidth / data.webformatHeight };
  }
  return { aspectRatio: 960 / 600 };
};

const getFileExtn = (url?: string, type?: string) => {
  if (url?.includes(".")) {
    const sArr = url.split(".");

    if (type?.includes("vector")) {
      const vArr = type.split("/");

      return `${sArr[sArr.length - 1]} / ${vArr[1]}`;
    }
    return sArr[sArr.length - 1];
  }
  return "";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.background.secondary,
  },
  image: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#00000030",
  },
  contentContainer: { flex: 1 },
  rowContainer: { flex: 1, flexDirection: "row", padding: 8 },
  userImage: { height: 60, width: 60, borderRadius: 50, overflow: "hidden" },
  userNameText: { fontSize: 16, color: colors.text.main },
  detailsContainer: { backgroundColor: "#f6f5fa", margin: 8 },
  detailsText: { flex: 1, fontSize: 16, color: colors.text.main },
  separator: { height: 1, backgroundColor: "#00000030" },
});

const mapStateToProps = function (state: StateToProps): StateToProps {
  return { userReducer: state.userReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen);
