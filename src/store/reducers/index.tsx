import HomeReducerAction, { SetImagesData } from "../actions/home.action";
import homeReducer, { HomeReducerState } from "./home.reducer";

import UserReducerAction, {
  SetLikeData,
  SetCollectioData,
  SetFollowingData,
} from "store/actions/user.action";
import userReducer, { UserReducerState } from "./user.reducer";

//add actions here
type Action = HomeReducerAction | UserReducerAction;

type DispatchActionCompletion = (action: Action) => void;

//add reducers here
interface StateToProps {
  homeReducer?: HomeReducerState;
  userReducer?: UserReducerState;
}

//add setter here
//data.reducer setter
interface DispatchToProps {
  setDataMessage: (payload: string) => void;
  setDataImages: (payload: SetImagesData) => void;
}

//user.reducer setter
interface DispatchToProps {
  setUserLikes: (payload: SetLikeData) => void;
  setUserCollections: (payload: SetCollectioData) => void;
  setUserFollowings: (payload: SetFollowingData) => void;
}

//define setter here
const mapDispatchToProps = function (
  dispatch: DispatchActionCompletion
): DispatchToProps {
  return {
    //data.reducer setter
    setDataMessage: (payload) =>
      dispatch({ type: "HOME_SET_MESSAGE", payload }),
    setDataImages: (payload) => dispatch({ type: "HOME_SET_IMAGES", payload }),
    //user.reducer setter
    setUserLikes: (payload) => dispatch({ type: "USER_SET_LIKES", payload }),
    setUserCollections: (payload) =>
      dispatch({ type: "USER_SET_COLLECTIONS", payload }),
    setUserFollowings: (payload) =>
      dispatch({ type: "USER_SET_FOLLOWING", payload }),
  };
};

//types - extends to props interface to use setter and get reducer
export { StateToProps, DispatchToProps };

//actions
export { mapDispatchToProps };

//store reducers
export { homeReducer, userReducer };
