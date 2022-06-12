import { Identifiable } from "data-types";
import { ReactText } from "react";

type ImageType = "photo" | "illustration" | "vector/ai" | "vector/svg";

interface ImageData extends Identifiable {
  type: ImageType;
  tags?: string;
  views?: number;
  downloads?: number;
  collections?: number;
  likes?: number;
  comments?: number;
  user_id?: ReactText;
  user?: string;
  userImageURL?: string;
  previewURL?: string;
  webformatURL?: string;
  webformatWidth?: number;
  webformatHeight?: number;
}

export { ImageData };
