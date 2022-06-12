import AsyncStorage from "@react-native-async-storage/async-storage";

const Constants = { transformPrefix: "jsonString:=>" };

const transformValue = (value: any) => {
  if (typeof value == "string" || typeof value == "number") {
    return value.toString();
  }
  const jsonString = JSON.stringify(value);

  return Constants.transformPrefix + jsonString;
};

const revertValue = (value: string) => {
  const subsCheck = value.substring(0, Constants.transformPrefix.length);

  if (subsCheck == Constants.transformPrefix) {
    const jsonString = value.slice(Constants.transformPrefix.length);

    return JSON.parse(jsonString);
  }
  return value;
};

const setValue = async (value: any, forKey: string) => {
  if (forKey.length == 0) return false;

  try {
    if (value) {
      const transformedValue = transformValue(value);

      await AsyncStorage.setItem(forKey, transformedValue);
    } else {
      await AsyncStorage.removeItem(forKey);
    }
    console.log("Syncronized");
  } catch (error) {
    error &&
      console.log(
        value ? "error saving key:" : "error removing key:",
        forKey,
        "with value:",
        value,
        "error:",
        error
      );
    return false;
  }
  AsyncStorage.getAllKeys().then;
  return true;
};

const getValue = async (forKey: string) => {
  if (forKey.length == 0) return null;

  try {
    const value = await AsyncStorage.getItem(forKey);

    if (value) {
      const revertedValue = revertValue(value);

      return revertedValue;
    }
  } catch (error) {
    error &&
      console.log("error getting value for key:", forKey, "error:", error);
  }
  return null;
};

const getKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    return keys;
  } catch (error) {
    error && console.log("error getting keys:", error);

    return [];
  }
};

export default { setValue, getValue, getKeys };
