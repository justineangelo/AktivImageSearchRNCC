type NavigationUnsubscriber = () => void;

type NavigationListenerName = "focus" | "blur" | "state";

interface NavigationProps {
  navigation?: {
    popToTop: () => void;
    goBack: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    navigate: (screen: string, params?: any) => void;
    addListener: (
      name: NavigationListenerName,
      callback?: (event: any) => void
    ) => NavigationUnsubscriber;
  };
  route?: { key: string; name: string; params: any };
}
