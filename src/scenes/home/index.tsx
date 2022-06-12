import React, { Component } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";

import { ImageData } from "data-types/response";

//components
import { BaseView, BaseFlatList, ViewComponent } from "components";
import SearchField from "./components/SearchField";
import SearchImage from "./components/SearchImage";
import Loader from "./components/Loader";

//service
import ImageService, { ImagesResponse } from "services/ImageService";

//redux
import {
  DispatchToProps,
  mapDispatchToProps,
  StateToProps,
} from "store/reducers";
import { connect } from "react-redux";

interface HomeScreenProps
  extends NavigationProps,
    StateToProps,
    DispatchToProps {}

interface HomeScreenState {
  isLoading: boolean;
  totalHits?: number;
  query?: string;
  page: number;
  pageSize: number;
}

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
  constructor(props: HomeScreenProps) {
    super(props);

    this.state = { isLoading: false, page: 1, pageSize: 20 };
  }

  private imageService?: ImageService<ImagesResponse<ImageData>>;

  componentDidMount() {
    this.setState({ isLoading: true }, this.getImages);
  }

  componentWillUnmount() {
    this.imageService?.cancel();
  }

  render() {
    const { homeReducer } = this.props;
    const { query, isLoading } = this.state;

    return (
      <BaseView useSafeArea={true}>
        <ViewComponent style={styles.container}>
          <BaseFlatList
            contentContainerStyle={{ paddingTop: 130 }}
            data={homeReducer!.images}
            isLoading={isLoading}
            numColumns={2}
            renderItem={this.renderItem}
            handleOnRefresh={this.handleOnRefresh}
            handleEndScroll={this.handleEndScroll}
            renderFooter={this.renderFooter}
          />
          <SearchField
            style={styles.searchField}
            value={query}
            onChangeText={this.onChangeText}
            onSearchPress={this.onSearchPress}
          />
        </ViewComponent>
      </BaseView>
    );
  }

  private onChangeText = (text: string) => {
    this.setState({ query: text });
  };

  private onSearchPress = () => {
    const { query } = this.state;

    Keyboard.dismiss();
    if (query) {
      this.handleOnRefresh();
    }
  };

  private renderItem = (item: ImageData, index: number) => {
    return (
      <SearchImage
        data={item}
        onPress={this.onImagePresss}
        onBookmarkPress={this.onBookmarkPress}
        onLikePress={this.onLikePress}
        onCommentPress={this.onCommentPress}
      />
    );
  };

  private onImagePresss = (data: ImageData) => {
    this.props.navigation?.navigate("Details", { data });
  };

  private onBookmarkPress = (data: ImageData) => {
    const { userReducer } = this.props;

    this.props.setUserCollections({
      type: userReducer!.collections[data.id] ? "remove" : "add",
      image: data,
    });
  };

  private onLikePress = (data: ImageData) => {
    const { userReducer } = this.props;

    this.props.setUserLikes({
      type: userReducer!.likes[data.id] ? "remove" : "add",
      image: data,
    });
  };

  private onCommentPress = (data: ImageData) => {
    this.props.navigation?.navigate("Details", { data, action: "comment" });
  };

  private handleOnRefresh = () => {
    this.props.setDataImages({ type: "clear" });
    this.setState(
      { isLoading: true, totalHits: undefined, page: 1, pageSize: 20 },
      () => {
        this.getImages();
      }
    );
  };

  private handleEndScroll = () => {
    this.getImages();
  };

  private renderFooter = () => {
    const { isLoading, totalHits, query, page, pageSize } = this.state;

    if (totalHits == undefined) return null;

    const hasMore = totalHits > page * pageSize;

    if (totalHits == 0 && !isLoading) {
      return (
        <Loader hasMore={hasMore} errorMesage={`No results for "${query}"`} />
      );
    }
    return <Loader hasMore={hasMore} />;
  };

  private getImages() {
    const { totalHits, query, page, pageSize } = this.state;

    if (totalHits && totalHits <= page * pageSize) {
      return;
    }
    this.imageService?.cancel();
    this.imageService = ImageService.init();
    this.imageService
      .get({ query, imageType: "photo", pageOpt: { page, pageSize } })
      .execute(
        (response) => {
          switch (page) {
            case 1:
              this.props.setDataImages({ type: "new", images: response.hits });
              break;
            default:
              this.props.setDataImages({ type: "add", images: response.hits });
              break;
          }

          this.setState({
            isLoading: false,
            totalHits: response.totalHits,
            page: page + 1,
          });
        },
        (error) => {
          console.log("Error", error.message);
          this.setState({ isLoading: false });
        }
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchField: { position: "absolute", top: 0, left: 0, right: 0 },
});

const mapStateToProps = function (state: StateToProps): StateToProps {
  return { homeReducer: state.homeReducer, userReducer: state.userReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
