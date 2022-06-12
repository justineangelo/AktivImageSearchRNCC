import { ImageData } from "data-types/response";

interface SetMessageAction {
  type: "HOME_SET_MESSAGE";
  payload: string;
}

interface SetImagesNew {
  type: "new";
  images: ImageData[];
}
interface SetImagesAdd {
  type: "add";
  images: ImageData[];
}
interface SetImagesClear {
  type: "clear";
}
type SetImagesData = SetImagesNew | SetImagesAdd | SetImagesClear;
interface SetImagesAction {
  type: "HOME_SET_IMAGES";
  payload: SetImagesData;
}

type HomeReducerAction = SetMessageAction | SetImagesAction;

export { SetImagesData };
export default HomeReducerAction;
