import { ReactText } from "react";
import { ImageData } from "data-types/response";

interface FollowedUser {
  id: ReactText;
  name: string;
  imageURL?: string;
}

//Likes
interface SetLikeAdd {
  type: "add";
  image: ImageData;
}
interface SetLikeRemove {
  type: "remove";
  image: ImageData;
}
type SetLikeData = SetLikeAdd | SetLikeRemove;
interface SetLikeAction {
  type: "USER_SET_LIKES";
  payload: SetLikeData;
}

//Collections
interface SetCollectionAdd {
  type: "add";
  image: ImageData;
}
interface SetCollectioRemove {
  type: "remove";
  image: ImageData;
}
type SetCollectioData = SetCollectionAdd | SetCollectioRemove;
interface SetCollectionAction {
  type: "USER_SET_COLLECTIONS";
  payload: SetCollectioData;
}

//Following
interface SetFollowingAdd {
  type: "add";
  user: FollowedUser;
}
interface SetFollowingRemove {
  type: "remove";
  user: FollowedUser;
}
type SetFollowingData = SetFollowingAdd | SetFollowingRemove;
interface SetFollowingAction {
  type: "USER_SET_FOLLOWING";
  payload: SetFollowingData;
}

type UserReducerAction =
  | SetLikeAction
  | SetCollectionAction
  | SetFollowingAction;

export { FollowedUser };
export { SetLikeData, SetCollectioData, SetFollowingData };
export default UserReducerAction;
