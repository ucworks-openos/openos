import React, { useEffect, useState } from "react";
import { getUserInfos } from "../../ipcCommunication/ipcOrganization";
import imgHolder from "../../../assets/images/img_imgHolder.png";

function MemberTooltip({ userIds, RecvCounts }) {
  const [userInfos, setUserInfos] = useState([]);

  useEffect(() => {
    let convertedUserIds = userIds.split("|");
    getUserInfos(convertedUserIds).then(function (results) {
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
                user.user_picture_post
                  ? user.user_picture_post.value
                  : imgHolder
              }
              alt="user-profile-picture"
            />
          </div>
          <div class="user-state online"></div>
        </div>
        <div class="to-ppl-user-info-wrap">
          <div class="row1">
            <h6 class="user-name">{user.user_name && user.user_name.value}</h6>
            {/* <span class="ppl-position">사원</span> */}
            <span class="user-department">
              {user.user_group_name && user.user_group_name.value}
            </span>
          </div>
          <div class="row2">
            <span class="read-info-state">읽음</span>
          </div>
        </div>
      </li>
    ));

  return (
    <ul
      class="list-dropdown to-ppl-list"
      style={{ maxHeight: "315px", overflowY: "auto" }}
    >
      <h6 class="list-dropdown-label">{`수신인 목록(${RecvCounts})`}</h6>
      {renderUserItem}
    </ul>
  );
}

export default MemberTooltip;

{
  /* <li class="user-single">
<div class="user-profile-state-wrap">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
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
