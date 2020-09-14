import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import { setMyInfo as RsetMyInfo } from "../reducer/profile";

type TuseProfileReturnTypes = {
  myInfo: TUser;
  setMyInfo: (userData: TUser) => void;
};

export default function useProfile(): TuseProfileReturnTypes {
  const states: TProfileState = useSelector(
    (state: RootState) => state.profile
  );
  const dispatch = useDispatch();

  const setMyInfo = useCallback(
    (userData: TUser) => dispatch(RsetMyInfo(userData)),
    [dispatch]
  );

  return {
    myInfo: states.myInfo,
    setMyInfo,
  };
}
