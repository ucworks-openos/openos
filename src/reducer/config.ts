const initialState: TconfigState = {
  theme: `default`,
  scope: `default-size`,
  language: `KR`,
  font: `본고딕`,
  initialTab: `favorite`,
  autoLaunch: false,
  autoLoginWithLockMode: false,
  lockMode: false,
  doubleClickBehavior: `chat`,
  useProxy: false,
};

export const SET_THEME = `config/SET_THEME` as const;
export const SET_SCOPE = `config/SET_SCOPE` as const;
export const SET_LANGUAGE = `config/SET_LANGUAGE` as const;
export const SET_FONT = `config/SET_FONT` as const;
export const SET_INITIAL_TAB = `config/SET_INITIAL_TAB` as const;
export const SET_AUTOLAUNCH = `config/SET_AUTOLAUNCH` as const;
export const SET_AUTOLOGIN_WITH_LOCKMODE = `config/SET_AUTOLOGIN_WITH_LOCKMODE` as const;
export const SET_LOCKMODE = `config/SET_LOCKMODE` as const;
export const SET_DOUBLE_CLICK_BEHAVIOR = `config/SET_DOUBLE_CLICK_BEHAVIOR` as const;
export const SET_USE_PROXY = `config/SET_USE_PROXY` as const;

export const setTheme = (theme: TconfigState["theme"]) => ({
  type: SET_THEME,
  payload: theme,
});

export const setScope = (scope: TconfigState["scope"]) => ({
  type: SET_SCOPE,
  payload: scope,
});

export const setLanguage = (code: TconfigState["language"]) => ({
  type: SET_LANGUAGE,
  payload: code,
});

export const setFont = (font: TconfigState["font"]) => ({
  type: SET_FONT,
  payload: font,
});

export const setInitialTab = (initialTab: TconfigState["initialTab"]) => ({
  type: SET_INITIAL_TAB,
  payload: initialTab,
});

export const setAutoLaunch = (boolean: TconfigState["autoLaunch"]) => ({
  type: SET_AUTOLAUNCH,
  payload: boolean,
});

export const setAutoLoginWithLockMode = (
  boolean: TconfigState["autoLoginWithLockMode"]
) => ({
  type: SET_AUTOLOGIN_WITH_LOCKMODE,
  payload: boolean,
});

export const setLockMode = (boolean: TconfigState["lockMode"]) => ({
  type: SET_LOCKMODE,
  payload: boolean,
});

export const setDoubleClickBehavior = (
  option: TconfigState["doubleClickBehavior"]
) => ({
  type: SET_DOUBLE_CLICK_BEHAVIOR,
  payload: option,
});

export const setUseProxy = (boolean: TconfigState["useProxy"]) => ({
  type: SET_USE_PROXY,
  payload: boolean,
});

type TconfigAction = ReturnType<
  | typeof setTheme
  | typeof setScope
  | typeof setLanguage
  | typeof setFont
  | typeof setInitialTab
  | typeof setAutoLaunch
  | typeof setAutoLoginWithLockMode
  | typeof setLockMode
  | typeof setDoubleClickBehavior
  | typeof setUseProxy
>;

export default function tree(
  state: TconfigState = initialState,
  action: TconfigAction
): TconfigState {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };
    case SET_SCOPE:
      return { ...state, scope: action.payload };
    case SET_LANGUAGE:
      return { ...state, language: action.payload };
    case SET_FONT:
      return { ...state, font: action.payload };
    case SET_INITIAL_TAB:
      return { ...state, initialTab: action.payload };
    case SET_AUTOLAUNCH:
      return { ...state, autoLaunch: action.payload };
    case SET_AUTOLOGIN_WITH_LOCKMODE:
      return { ...state, autoLoginWithLockMode: action.payload };
    case SET_LOCKMODE:
      return { ...state, lockMode: action.payload };
    case SET_DOUBLE_CLICK_BEHAVIOR:
      return { ...state, doubleClickBehavior: action.payload };
    case SET_USE_PROXY:
      return { ...state, useProxy: action.payload };
    default:
      return { ...state };
  }
}
