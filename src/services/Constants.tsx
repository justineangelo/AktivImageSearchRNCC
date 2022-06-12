import Globals from "globals";
import { Platform } from "react-native";
import app from "../../app.json";

class Constants {
  static loggingEnabled = true;
  static isRequestShown = false;
  static isResponseShown = false;

  static userAgentAppName = app.expo.name;
  static userAgentSDKVersion = app.expo.version;
  static userAgentOSVersion = `${Platform.OS}${Platform.Version}`;
  static readonly servers = {
    primary: "https://pixabay.com/api/",
  };
  static readonly apiKey = Globals.apiKey;
}

export default Constants;
