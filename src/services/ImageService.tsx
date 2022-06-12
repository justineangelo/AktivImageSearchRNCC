import APIService, { APIServer, APIMethod } from "./APIService";
import Constants from "./Constants";
import { ImageType } from "data-types/request";

interface ImagesResponse<T> {
  total: number;
  totalHits: number;
  hits: T[];
}

class ImageService<T> extends APIService<T> {
  get(params?: {
    query?: string;
    imageType?: ImageType;
    pageOpt?: { page: number; pageSize: number };
  }): ImageService<T> {
    this.requestName = "ImageService: get()";
    this.setMethod(APIMethod.get());
    this.setQueryParameters({
      key: Constants.apiKey,
      q: params?.query,
      ...(params?.pageOpt
        ? { page: params.pageOpt.page, per_page: params.pageOpt.pageSize }
        : null),
    });

    return this;
  }

  constructor() {
    super();

    this.setAPIServer("primary");
  }

  static init<T>() {
    return new ImageService<T>();
  }
}

export { ImagesResponse };
export default ImageService;
