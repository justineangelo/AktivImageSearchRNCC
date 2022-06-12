import HomeReducerAction from "../actions/home.action";
import { ImageData } from "data-types/response";

interface HomeReducerState {
  message: string;
  images: ImageData[];
}

const initialState: HomeReducerState = {
  message: "Initial Message",
  images: [],
};

const homeReducer = (
  state = initialState,
  action?: HomeReducerAction
): HomeReducerState => {
  switch (action?.type) {
    case "HOME_SET_MESSAGE":
      return { ...state, message: action.payload };
    case "HOME_SET_IMAGES":
      switch (action.payload.type) {
        case "new":
          return { ...state, images: action.payload.images };
        case "add":
          return {
            ...state,
            images: [...state.images, ...action.payload.images],
          };
        case "clear":
          return { ...state, images: [] };
      }
  }

  return state;
};

export { HomeReducerState };
export default homeReducer;
