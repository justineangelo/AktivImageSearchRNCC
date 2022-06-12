import axios from "axios";
import Constants from "./Constants";

type APIServer = "primary";

class APIMethod {
  private method: string;
  private path: string;

  getMethod(): any {
    return this.method;
  }

  getPath(): string {
    return this.path;
  }

  static get(path?: string): APIMethod {
    return new APIMethod("get", path);
  }

  static post(path?: string): APIMethod {
    return new APIMethod("post", path);
  }

  static put(path?: string): APIMethod {
    return new APIMethod("put", path);
  }

  static patch(path?: string): APIMethod {
    return new APIMethod("patch", path);
  }

  static delete(path?: string): APIMethod {
    return new APIMethod("delete", path);
  }

  private constructor(method: string, path?: string) {
    this.method = method;
    this.path = path ?? "";
  }
}

interface APIResponse<T> {
  total: number;
  totalHits: number;
  hits: T[];
}

interface RequestAPIError {
  status: number;
  _response: string;
}

interface ResponseAPIError {
  status: number;
  data: { msg?: any; errors?: any };
}

class APIError {
  code: number;
  message: string;
  raw: any;

  constructor(code: number, message: string, raw: any = null) {
    this.code = code;
    this.message = message;
    this.raw = raw;
  }

  static loadError(error?: {
    request?: RequestAPIError;
    response?: ResponseAPIError;
    message?: string;
  }): APIError {
    if (error?.response) {
      // Logger.log("Error response:", error.request);
    } else if (error?.request) {
      // Logger.log("Error request:", error.request);
    }

    let responseError = new APIError(1, "Something went wrong.");
    if (error?.request) {
      const errorMessage = error.request._response;

      responseError.code = error.request.status;
      responseError.message = errorMessage;
      responseError.raw = error.request;
    }

    return responseError;
  }
}

class APIService<T> {
  requestName = "";
  private apiServer: APIServer = "primary";
  private source = axios.CancelToken.source();
  private apiMethod = APIMethod.get("");
  private headers: any = null;
  private queryParameters: any = null;
  private extraQueryParameters: Array<{ key: string; value: any }> = [];
  private requestBody: any = null;

  setAPIServer(apiServer: APIServer) {
    this.apiServer = apiServer;
    return this;
  }

  setMethod(apiMethod: APIMethod) {
    this.apiMethod = apiMethod;
    return this;
  }

  setHeaders(headers: any = null) {
    this.headers = headers;
    return this;
  }

  setQueryParameters(queryParameters: any = null) {
    this.queryParameters = queryParameters;
    return this;
  }

  setExtraQueryParameters(
    extraQueryParameters: Array<{ key: string; value: any }>
  ) {
    this.extraQueryParameters = extraQueryParameters;
    return this;
  }

  setRequestBody(requestBody: any = null) {
    this.requestBody = requestBody;
    return this;
  }

  private updateParamsIfNeeded(params: any): any {
    //Include extra params if possible
    let updatedParams = params;
    let extraKey: string = "";
    const extraParams = this.extraQueryParameters.map((dict, indx) => {
      if (indx === 0) {
        extraKey = dict.key;
        return `${dict.value}`;
      } else {
        return `${dict.key}=${dict.value}`;
      }
    });
    if (extraKey.length > 0) {
      updatedParams[extraKey] = extraParams.join("&");
    }
    return updatedParams;
  }

  private paramSerializer(params: any): string {
    const serializeParams = Object.keys(params)
      .filter((key) => (params[key] ?? "kamotengKahoy") != "kamotengKahoy")
      .map((key) => {
        const value = params[key];

        if (key.includes("![]")) {
          return `${key.replace("![]", "")}=${value.replace(/\!\[\]/g, "")}`; //![] removed
        } else if (key.includes("[]")) {
          return `${key}=${value}`;
        } else {
          return `${key}=${encodeURIComponent(value)}`;
        }
      })
      .join("&");
    return serializeParams;
  }

  private updatedHeaders() {
    const userAgent = `aktiv/${Constants.userAgentAppName}/${Constants.userAgentSDKVersion}/${Constants.userAgentOSVersion}`;

    if (this.headers) {
      const updatedHeaders = this.headers;

      updatedHeaders["User-Agent"] = userAgent;
      return updatedHeaders;
    } else {
      return { "User-Agent": userAgent };
    }
  }

  private reset() {
    this.headers = null;
    this.queryParameters = null;
    this.extraQueryParameters = [];
    this.requestBody = null;
  }

  public execute(
    successHandler: (response: T) => void,
    failureHandler: (error: APIError) => void
  ) {
    Logger.log(
      "<=============================================================================================>"
    );
    Logger.log(`${this.requestName ? this.requestName : ""} Operation started`);
    const api = generateServer(this.apiServer);

    api.interceptors.request.use((request) => {
      request.params = this.updateParamsIfNeeded(request.params);
      if (Constants.isRequestShown) {
        console.log(
          `${this.requestName ? this.requestName : ""} Request:`,
          request
        );
      }
      this.reset(); //reset request
      return request;
    });
    api.interceptors.response.use((response) => {
      Logger.log(
        `${this.requestName ? this.requestName : ""} Response URL:`,
        response.request.responseURL
      );
      if (Constants.isResponseShown) {
        console.log(
          `${this.requestName ? this.requestName : ""} Response:`,
          response
        );
      }
      return response;
    });
    this.source = axios.CancelToken.source(); //renew  cancel source
    api({
      cancelToken: this.source.token,
      headers: this.updatedHeaders(),
      method: this.apiMethod.getMethod(),
      url: this.apiMethod.getPath(),
      params: this.queryParameters,
      paramsSerializer: this.paramSerializer,
      data: this.requestBody,
    })
      .then((response) => {
        successHandler(response.data);
      })
      .catch((error) => {
        const responseError = APIError.loadError(error);

        failureHandler(responseError);
      })
      .then(() => {
        Logger.log(
          `${this.requestName ? this.requestName : ""} Operation finished`
        );
        Logger.log(
          "<=============================================================================================>"
        );
      });
  }

  public cancel(message?: string | null) {
    if (message) {
      this.source.cancel(message);
    } else {
      this.source.cancel(
        `${
          this.requestName ? this.requestName : ""
        } Operation is forcefully cancelled`
      );
    }
  }

  constructor() {}
}

const generateServer = (server: APIServer) => {
  switch (server) {
    case "primary":
      return axios.create({ baseURL: Constants.servers.primary });
  }
};

class Logger {
  static log(message: any, ...optionalParams: any) {
    if (Constants.loggingEnabled) {
      console.log(message, ...optionalParams);
    }
  }
}

export { APIServer };
export { APIMethod };
export { APIError };

export default APIService;
