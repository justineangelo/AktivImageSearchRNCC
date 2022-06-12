import { ReactText } from "react";
import UserReducerAction, { FollowedUser } from "store/actions/user.action";
import { ImageData } from "data-types/response";

interface Comment {
  id: ReactText;
  time: string;
  message: string;
}

interface UserReducerState {
  likes: { [imageID: ReactText]: ImageData };
  collections: { [imageID: ReactText]: ImageData };
  comments: { [imageID: ReactText]: Comment[] };
  following: { [userID: ReactText]: FollowedUser };
}

const initialState: UserReducerState = {
  likes: {},
  collections: {},
  comments: {},
  following: {},
};

interface SetUserData {
  type: "USER_INIT";
  payload: UserReducerState;
}

const userReducer = (
  state = initialState,
  action: UserReducerAction | SetUserData
): UserReducerState => {
  switch (action.type) {
    case "USER_INIT":
      return { ...state, ...action.payload };
    case "USER_SET_LIKES":
      const likes = { ...state.likes };

      switch (action.payload.type) {
        case "add":
          likes[action.payload.image.id] = action.payload.image;
          return { ...state, likes };
        case "remove":
          delete likes[action.payload.image.id];
          return { ...state, likes };
      }
    case "USER_SET_COLLECTIONS":
      const collections = { ...state.collections };

      switch (action.payload.type) {
        case "add":
          collections[action.payload.image.id] = action.payload.image;
          return { ...state, collections };
        case "remove":
          delete collections[action.payload.image.id];
          return { ...state, collections };
      }
    case "USER_SET_FOLLOWING":
      const following = { ...state.following };

      switch (action.payload.type) {
        case "add":
          following[action.payload.user.id] = action.payload.user;
          return { ...state, following };
        case "remove":
          delete following[action.payload.user.id];
          return { ...state, following };
      }
    default:
      return state;
  }
};

export { Comment, FollowedUser };
export { UserReducerState };
export default userReducer;
