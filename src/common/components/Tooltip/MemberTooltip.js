import React, { useEffect, useState } from "react";
import { getUserInfos } from "../../ipcCommunication/ipcOrganization";
import imgHolder from "../../../assets/images/img_imgHolder.png";
import { EuserState } from "../../../enum";
import "./MemberTooltip.css";

function MemberTooltip({ userIds, style, type }) {
  const [userInfos, setUserInfos] = useState([]);

  useEffect(() => {
    let chatUserIds = userIds;
    getUserInfos(chatUserIds).then(function (results) {
      if (results.data.items && results.data.items.node_item !== "") {
        setUserInfos(
          Array.isArray(results.data.items.node_item)
            ? results.data.items.node_item
            : [results.data.items.node_item]
        );
      }
    });
  }, [userIds]);

  const renderUserItem =
    userInfos &&
    userInfos.map((user) => (
      <li class="user-single" key={user.user_id.value}>
        <div class="user-profile-state-wrap">
          <div class="user-pic-wrap">
            <img
              src={
                user.user_picture_pos
                  ? user.user_picture_pos.value
                  : "./images/img_imgHolder.png"
              }
              style={{ width: `48px`, height: `48px` }}
              alt="user-profile-picture"
            />
          </div>
          <div
            className={`user-state ${
              EuserState[Number(user?.user_state.value)]
            }`}
          ></div>
        </div>
        <div class="to-ppl-user-info-wrap">
          <div class="row1">
            <h6 class="user-name">{user.user_name && user.user_name.value}</h6>
            {/* <span class="ppl-position">사원</span> */}
            <span class="user-department">
              {user.user_group_name && user.user_group_name.value}
            </span>
          </div>
          {/* <div class="row2">
            <span class="read-info-state">읽음</span>
          </div> */}
        </div>
      </li>
    ));

  return (
    <ul class="list-dropdown to-ppl-list" style={style}>
      <h6 class="list-dropdown-label">{`${
        type === `chat` ? `참여자 목록` : `수신인 목록`
      }(${userInfos?.length})`}</h6>
      {renderUserItem}
    </ul>
  );
}

export default MemberTooltip;

{
  /* <li class="user-single">
<div class="user-profile-state-wrap">
    <div class="user-pic-wrap">
        <img src="./images/img_imgHolder.png" alt="user-profile-picture" />
    </div>
    <div class="user-state online"></div>
</div>
<div class="to-ppl-user-info-wrap">
    <div class="row1">
        <h6 class="user-name">김철수</h6>
        <span class="ppl-position">과장</span>
        <span class="user-department">개발팀</span>
    </div>
    <div class="row2">
        <span class="read-info-date unread"></span>
        <span class="read-info-state unread">안 읽음</span>
    </div>
</div>
</li> */
}
