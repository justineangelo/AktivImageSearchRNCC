import RootNavigator from "navigation";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "store";
import { AsyncStorage } from "utils";
import Globals from "globals";

export default function App() {
  useEffect(() => {
    let prevUserReducer = store.getState().userReducer;

    //load user from local storage
    AsyncStorage.getValue(Globals.apiKey).then((userReducer) => {
      if (userReducer) {
        store.dispatch({ type: "USER_INIT", payload: userReducer });
        prevUserReducer = store.getState().userReducer;
      }
    });

    const unsubscribe = store.subscribe(() => {
      const { userReducer } = store.getState();

      //save to user if has changes
      if (prevUserReducer != userReducer) {
        AsyncStorage.setValue(userReducer, Globals.apiKey);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
