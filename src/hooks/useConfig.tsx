import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import {
  setTheme as RsetTheme,
  setScope as RsetScope,
  setLanguage as RsetLanguage,
  setFont as RsetFont,
  setInitialTab as RsetInitialTab,
  setAutoLaunch as RsetAutoLaunch,
  setAutoLoginWithLockMode as RsetAutoLoginWithLockMode,
  setLockMode as RsetLockMode,
  setDoubleClickBehavior as RsetDoubleClickBehavior,
  setUseProxy as RsetUseProxy,
} from "../reducer/config";

type TuseConfigReturnTypes = {
  states: TconfigState;
  theme: TconfigState["theme"];
  scope: TconfigState["scope"];
  language: TconfigState["language"];
  font: TconfigState["font"];
  initialTab: TconfigState["initialTab"];
  autoLaunch: TconfigState["autoLaunch"];
  autoLoginWithLockMode: TconfigState["autoLoginWithLockMode"];
  lockMode: TconfigState["lockMode"];
  doubleClickBehavior: TconfigState["doubleClickBehavior"];
  useProxy: TconfigState["useProxy"];
  setTheme: (theme: TconfigState["theme"]) => void;
  setScope: (scope: TconfigState["scope"]) => void;
  setLanguage: (code: TconfigState["language"]) => void;
  setFont: (font: TconfigState["font"]) => void;
  setInitialTab: (initialTab: TconfigState["initialTab"]) => void;
  setAutoLaunch: (boolean: TconfigState["autoLaunch"]) => void;
  setAutoLoginWithLockMode: (
    boolean: TconfigState["autoLoginWithLockMode"]
  ) => void;
  setLockMode: (boolean: TconfigState["lockMode"]) => void;
  setDoubleClickBehavior: (option: TconfigState["doubleClickBehavior"]) => void;
  setUseProxy: (boolean: TconfigState["useProxy"]) => void;
};

export default function useConfig(): TuseConfigReturnTypes {
  const states: TconfigState = useSelector((state: RootState) => state.config);
  const dispatch = useDispatch();

  const {
    theme,
    scope,
    language,
    font,
    initialTab,
    autoLaunch,
    autoLoginWithLockMode,
    lockMode,
    doubleClickBehavior,
    useProxy,
  } = states;

  const setTheme = useCallback(
    (theme: TconfigState["theme"]) => dispatch(RsetTheme(theme)),
    [dispatch]
  );

  const setScope = useCallback(
    (scope: TconfigState["scope"]) => dispatch(RsetScope(scope)),
    [dispatch]
  );

  const setLanguage = useCallback(
    (code: TconfigState["language"]) => dispatch(RsetLanguage(code)),
    [dispatch]
  );

  const setFont = useCallback(
    (font: TconfigState["font"]) => dispatch(RsetFont(font)),
    [dispatch]
  );

  const setInitialTab = useCallback(
    (initialTab: TconfigState["initialTab"]) =>
      dispatch(RsetInitialTab(initialTab)),
    [dispatch]
  );

  const setAutoLaunch = useCallback(
    (boolean: TconfigState["autoLaunch"]) => dispatch(RsetAutoLaunch(boolean)),
    [dispatch]
  );

  const setAutoLoginWithLockMode = useCallback(
    (boolean: TconfigState["autoLoginWithLockMode"]) =>
      dispatch(RsetAutoLoginWithLockMode(boolean)),
    [dispatch]
  );

  const setLockMode = useCallback(
    (boolean: TconfigState["lockMode"]) => dispatch(RsetLockMode(boolean)),
    [dispatch]
  );

  const setDoubleClickBehavior = useCallback(
    (option: TconfigState["doubleClickBehavior"]) =>
      dispatch(RsetDoubleClickBehavior(option)),
    [dispatch]
  );

  const setUseProxy = useCallback(
    (boolean: TconfigState["useProxy"]) => dispatch(RsetUseProxy(boolean)),
    [dispatch]
  );

  return {
    states,
    theme,
    scope,
    language,
    font,
    initialTab,
    autoLaunch,
    autoLoginWithLockMode,
    lockMode,
    doubleClickBehavior,
    useProxy,
    setTheme,
    setScope,
    setLanguage,
    setFont,
    setInitialTab,
    setAutoLaunch,
    setAutoLoginWithLockMode,
    setLockMode,
    setDoubleClickBehavior,
    setUseProxy,
  };
}
