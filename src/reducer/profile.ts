const initialState: TProfileState = {
  myInfo: {},
};

export const SET_MY_INFO = `profile/SET_MY_INFO` as const;

export const setMyInfo = (userData: TUser) => ({
  type: SET_MY_INFO,
  payload: userData,
});

type TProfileAction = ReturnType<typeof setMyInfo>;

export default function profile(
  state: TProfileState = initialState,
  action: TProfileAction
) {
  switch (action.type) {
    case SET_MY_INFO:
      return { ...state, myInfo: action.payload };
    default:
      return { ...state };
  }
}
