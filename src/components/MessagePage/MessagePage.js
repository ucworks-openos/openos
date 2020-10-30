import React, { useEffect } from "react";
import "./MessagePage.css";
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  getInitialMessageLists,
  setCurrentMessageListsType,
} from "../../redux/actions/message_actions";

function MessagePage() {
  const dispatch = useDispatch();
  const currentMessageListType = useSelector(
    (state) => state.messages.currentMessageListType
  );

  useEffect(() => {
    dispatch(setCurrentMessageListsType("RECV"));
  }, []);

  useEffect(() => {
    dispatch(
      getInitialMessageLists(
        currentMessageListType ? currentMessageListType : "RECV"
      )
    );
    sessionStorage.setItem("currentMessageListType", currentMessageListType);
  }, [currentMessageListType]);

  return (
    <div className="message-contents-wrap">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default MessagePage;
