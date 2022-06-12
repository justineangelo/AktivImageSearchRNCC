import React, { Component } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Platform,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Identifiable } from "data-types";

interface BaseFlatListProps<T> {
  style?: {};
  onLayout?: (event: LayoutChangeEvent) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isLoading: boolean;
  numColumns?: number;
  horizontal?: boolean;
  pagingEnabled?: boolean;
  decelerationRate?: number | "fast" | "normal";
  itemSeparatorSize?: number;
  itemSeparatorStyle?: {};
  stickyHeaderIndices?: number[];
  alwaysBounceVertical?: boolean;
  alwaysBounceHorizontal?: boolean;
  removeClippedSubviews?: boolean;
  initialNumToRender?: number;
  scrollEnabled?: boolean;
  data: T[];
  renderHeader?: () => JSX.Element | null;
  renderItem: (item: T, index: number) => JSX.Element | null;
  renderSeparator?: (
    highlighted: boolean,
    leadingItem: T
  ) => JSX.Element | null;
  renderFooter?: () => JSX.Element | null;
  handleOnRefresh?: () => void;
  onEndReachedThreshold?: number;
  handleEndScroll?: () => void;
}

interface BaseFlatListState<T> {
  ref?: FlatList<T>;
}

class BaseFlatList<T extends Identifiable> extends Component<
  BaseFlatListProps<T>,
  BaseFlatListState<T>
> {
  static defaultProps = {
    isLoading: false,
    scrollEnabled: true,
  };

  render() {
    const {
      isLoading,
      style,
      onLayout,
      contentContainerStyle,
      numColumns,
      horizontal,
      pagingEnabled,
      decelerationRate,
      stickyHeaderIndices,
      alwaysBounceVertical,
      alwaysBounceHorizontal,
      removeClippedSubviews,
      initialNumToRender,
      data,
      scrollEnabled,
      renderHeader,
      renderFooter,
      handleOnRefresh,
      onEndReachedThreshold,
      handleEndScroll,
    } = this.props;

    return (
      <FlatList
        style={style}
        ref={this.ref}
        onLayout={onLayout}
        contentContainerStyle={contentContainerStyle}
        numColumns={numColumns}
        horizontal={horizontal}
        pagingEnabled={pagingEnabled}
        decelerationRate={decelerationRate}
        stickyHeaderIndices={stickyHeaderIndices}
        scrollEnabled={scrollEnabled}
        removeClippedSubviews={
          Platform.OS == "android" ? removeClippedSubviews : false
        }
        data={data}
        ListHeaderComponent={renderHeader}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={renderFooter}
        refreshControl={
          handleOnRefresh ? (
            <RefreshControl
              refreshing={isLoading}
              tintColor={"red"}
              onRefresh={handleOnRefresh}
            />
          ) : undefined
        }
        alwaysBounceVertical={alwaysBounceVertical ?? horizontal ? false : true}
        alwaysBounceHorizontal={
          alwaysBounceHorizontal ?? horizontal ? true : false
        }
        initialNumToRender={initialNumToRender}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={handleEndScroll}
      />
    );
  }

  private ref = (ref: FlatList<T>) => {
    this.setState({ ref });
  };

  private keyExtractor = (item: T, _: number) => {
    return item.id.toString();
  };

  private renderItem = (info: { item: T; index: number }) => {
    const { renderItem } = this.props;
    const { index, item } = info;

    return renderItem(item, index);
  };

  private renderSeparator = (info: {
    highlighted: boolean;
    leadingItem: T;
  }) => {
    const {
      horizontal,
      renderSeparator,
      itemSeparatorSize,
      itemSeparatorStyle,
    } = this.props;

    if (renderSeparator !== undefined) {
      return renderSeparator(info.highlighted, info.leadingItem);
    }

    // if (itemSeparatorSize) {
    //   if (horizontal) {
    //     return (
    //       <ViewComponent
    //         style={{ ...{ width: itemSeparatorSize }, ...itemSeparatorStyle }}
    //       />
    //     );
    //   }
    //   return (
    //     <ViewComponent
    //       style={{ ...{ height: itemSeparatorSize }, ...itemSeparatorStyle }}
    //     />
    //   );
    // }
    return null;
  };

  scrollToOffset = (params: { animated?: boolean; offset: number }) => {
    const { ref } = this.state;

    ref?.scrollToOffset(params);
  };

  scrollToIndex = (params: {
    animated?: boolean;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => {
    const { ref } = this.state;

    ref?.scrollToIndex(params);
  };
}

export default BaseFlatList;
