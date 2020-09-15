import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./FavoritePage.css";
import "../../assets/css/Tree.scss";
import SignitureCi from "../../common/components/SignitureCi";
import AddGroupModal from "../../common/components/Modal/AddGroupModal";
import Modal from "react-modal";
import HamburgerButton from "../../common/components/HamburgerButton";
import Node from "./FavoriteNode";
import Tree, { TreeNode } from "rc-tree";
import {
  getBuddyList,
  setStatusMonitor,
  getUserInfos,
  searchOrgUsers,
} from "../ipcCommunication/ipcCommon";
import useTree from "../../hooks/useTree";
import useProfile from "../../hooks/useProfile";
import useSearch from "../../hooks/useSearch";

Modal.setAppElement("#root");
let _orgCode: string = ``;
let _userSchema: TUser[] = [];

export default function FavoritePage() {
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState(false);
  const {
    searchMode,
    searchKeyword,
    searchResult,
    setSearchMode,
    setSearchKeyword,
    setSearchResult,
  } = useSearch({ type: `favorite` });
  const {
    treeData,
    expandedKeys,
    selectedNode,
    setTreeData,
    setExpandedKeys,
    setSelectedNode,
  } = useTree({
    type: `favorite`,
  });
  const { setMyInfo } = useProfile();

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

  useEffect(() => {
    // 친구 + 개인 그룹 1deps로 가져오기.
    const getBuddy = async () => {
      const {
        data: {
          contacts: { node: response },
        },
      } = await getBuddyList();

      // 로그인한 아이디 가져오기
      const loginId = sessionStorage.getItem(`loginId`);

      // 친구 id만 추출
      const userIds = response
        .filter((v: any) => v.gubun === `U`)
        .map((v: any) => v.id);

      // 개인 그룹만 추출
      const keyIds = response
        .filter((v: any) => v.gubun === `G`)
        .map((v: any) => v.id);

      // 로그인 id + 추출한 친구 id로 사용자 상세 정보 가져오기
      const {
        data: {
          items: { node_item: userSchemaMaybeArr },
        },
      } = await getUserInfos([loginId, ...userIds]);

      // 사용자 상세 정보가 하나일 경우를 가정하여 배열로 감쌈.
      const userSchema = Array.isArray(userSchemaMaybeArr)
        ? userSchemaMaybeArr
        : [userSchemaMaybeArr];

      // 프로필 상세 정보 추출
      const result = userSchema?.find((v: any) => v.user_id.value === loginId);

      // 검색을 위해 userSchema 저장
      _userSchema = userSchema;

      // 프로필 상세 정보 myInfo에 매핑.
      const myInfo: TUser = {
        classMaxCode: result.class_max_code?.value,
        connectType: result.connect_type?.value,
        expiredPwdYn: result.expired_pwd_yn?.value,
        orgCode: result.org_code?.value,
        sipId: result.sip_id?.value,
        smsUsed: result.sms_used?.value,
        syncOpt: result.sync_opt?.value,
        userAliasName: result.user_aliasname?.value,
        userBirthGubun: result.user_birth_gubun?.value,
        userBirthday: result.user_birthday?.value,
        userCertify: result.user_certify?.value,
        userEmail: result.user_email?.value,
        userExtState: result.user_extstate?.value,
        userField1: result.user_field1?.value,
        userField2: result.user_field2?.value,
        userField3: result.user_field3?.value,
        userField4: result.user_field4?.value,
        userField5: result.user_field5?.value,
        userGroupCode: result.user_group_code?.value,
        userGroupName: result.user_group_name?.value,
        userGubun: result.user_gubun?.value,
        userId: result.user_id?.value,
        userIpphoneDbGroup: result.user_ipphone_dbgroup?.value,
        userName: result.user_name?.value,
        userPass: result.user_pass?.value,
        userPayclName: result.user_paycl_name?.value,
        userPhoneState: result.user_phone_state?.value,
        userPicturePos: result.user_picture_pos?.value,
        userState: result.user_state?.value,
        userTelCompany: result.user_tel_company?.value,
        userTelFax: result.user_tel_fax?.value,
        userTelIpphone: result.user_tel_ipphone?.value,
        userTelMobile: result.user_tel_mobile?.value,
        userTelOffice: result.user_tel_office?.value,
        userViewOrgGroup: result.user_view_org_groups?.value,
        userWorkName: result.user_work_name?.value,
        userXmlPic: result.user_xml_pic?.value,
        viewOpt: result.view_opt?.value,
      };
      // 프로필 상세 정보를 트리 형태로 저장.
      const myProfile = [
        {
          gubun: `G`,
          title: `내 프로필`,
          key: `myProfile`,
          children: [
            { title: myInfo.userName, key: `me`, gubun: `U`, ...myInfo },
          ],
        },
      ];
      // 즐겨찾기 트리 생성
      const root = response.reduce((prev: TTreeNode[], cur: any) => {
        // pid (parent id)가 없을 경우 루트 노드(그룹)로 간주
        if (!cur.pid) {
          return [
            ...prev,
            {
              gubun: cur.gubun,
              title: cur.name,
              key: cur.id,
              pid: cur.pid,
              children: [],
            },
          ];
        } else {
          // 재귀함수 (children에 하위 노드 삽입)
          return append(prev, cur, userSchema);
        }
      }, []);
      setTreeData([...myProfile, ...root]);
      // 페이지 진입 시 내 프로필 그룹 + 개인 그룹은 펼침
      setExpandedKeys([`myProfile`, ...keyIds]);
      // 상태 바뀔 시 푸시 알림 요청
      setStatusMonitor(userIds);
      setMyInfo(myInfo);
      _orgCode = myInfo.orgCode!;
    };
    !treeData.length && getBuddy();
  }, []);

  // 재귀함수 (children에 하위 노드 삽입)
  const append = (
    prev: TTreeNode[],
    child: any,
    userSchema: any
  ): TTreeNode[] =>
    prev.map((v: any) => {
      // 즐겨찾기 밑에 a부서가 있다면, 아래 분기문에 잡힌다.
      if (v.key === child.pid) {
        // gubun: G (Group)
        if (child.gubun === `G`) {
          return {
            ...v,
            children: [
              ...v.children,
              {
                title: child.name,
                key: child.id,
                gubun: child.gubun,
                children: [],
                pid: child.pid,
              },
            ],
          };
        } else {
          // gubun: U (User)
          // userSchema에서 검색하여 상세 정보를 userV에 담는다.
          const userV = userSchema?.find(
            (v: any) => v.user_id.value === child.id
          );
          console.log(`userV: `, userV);
          return {
            ...v,
            children: [
              ...v.children,
              {
                title: child.name,
                key: child.id,
                gubun: child.gubun,
                pid: child.pid,

                classMaxCode: userV.class_max_code?.value,
                connectType: userV.connect_type?.value,
                expiredPwdYn: userV.expired_pwd_yn?.value,
                nodeEnd: userV.node_end?.value,
                nodeStart: userV.node_start?.value,
                orgCode: userV.org_code?.value,
                sipId: userV.sip_id?.value,
                smsUsed: userV.sms_used?.value,
                syncOpt: userV.sync_opt?.value,
                userAliasName: userV.user_aliasname?.value,
                userBirthGubun: userV.user_birth_gubun?.value,
                userBirthday: userV.user_birthday?.value,
                userCertify: userV.user_certify?.value,
                userEmail: userV.user_email?.value,
                userExtState: userV.user_extstate?.value,
                userField1: userV.user_field1?.value,
                userField2: userV.user_field2?.value,
                userField3: userV.user_field3?.value,
                userField4: userV.user_field4?.value,
                userField5: userV.user_field5?.value,
                userGroupCode: userV.user_group_code?.value,
                userGroupName: userV.user_group_name?.value,
                userGubun: userV.user_gubun?.value,
                userId: userV.user_id?.value,
                userIpphoneDbGroup: userV.user_ipphone_dbgroup?.value,
                userName: userV.user_name?.value,
                userPass: userV.user_pass?.value,
                userPayclName: userV.user_paycl_name?.value,
                userPhoneState: userV.user_phone_state?.value,
                userPicturePos: userV.user_picture_pos?.value,
                userState: userV.user_state?.value,
                userTelCompany: userV.user_tel_company?.value,
                userTelFax: userV.user_tel_fax?.value,
                userTelIpphone: userV.user_tel_ipphone?.value,
                userTelMobile: userV.user_tel_mobile?.value,
                userTelOffice: userV.user_tel_office?.value,
                userViewOrgGroup: userV.user_view_org_groups?.value,
                userWorkName: userV.user_work_name?.value,
                userXmlPic: userV.user_xml_pic?.value,
                viewOpt: userV.view_opt?.value,
              },
            ],
          };
        }
        //
      } else if (v.children) {
        return {
          ...v,
          children: append(
            // 부서 내 사용자 이름 순 정렬
            // v.children.sort((a: any, b: any) => {
            //   if (a.gubun === `G` || b.gubun === `G`) {
            //     return 0;
            //   }
            //   const nameA = a.userName.toUpperCase(); // ignore upper and lowercase
            //   const nameB = b.userName.toUpperCase(); // ignore upper and lowercase
            //   if (nameA < nameB) {
            //     return -1;
            //   }
            //   if (nameA > nameB) {
            //     return 1;
            //   }
            // }),
            v.children,
            child,
            userSchema
          ),
        };
      }
      return v;
    });

  const handleKeywordChange = (e: any) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (e: any) => {
    const which = e.which;
    const keyword = e.target.value;

    const getSearchResult = () => {
      // 사용자명, 사용자 id, 부서명, 직위, 직책, 직급, 핸드폰 번호로 검색 가능
      // user_name, user_id, user_group_name, user_paycl_name, _, _, user_tel_mobile
      const reg = new RegExp(keyword, `g`);
      const searchResult = _userSchema.filter(
        (v: any) =>
          reg.test(v.user_name.value) ||
          reg.test(v.user_id.value) ||
          reg.test(v.user_group_name.value) ||
          reg.test(v.user_paycl_name.value) ||
          reg.test(v.user_tel_mobile.value)
      );

      const userSchema = searchResult.map((v: any) => ({
        title: v.user_name?.value,
        key: v.user_id.value,
        gubun: v.gubun.value,
        orgCode: v.org_code.value,
        classMaxCode: v.class_max_code?.value,
        connectType: v.connect_type?.value,
        pullClassId: v.pull_class_id?.value,
        pullGroupName: v.pull_group_name?.value,
        sipId: v.sip_id?.value,
        smsUsed: v.sms_used?.value,
        syncOpt: v.sync_opt?.value,
        userAliasName: v.user_aliasname?.value,
        userBirthGubun: v.user_birth_gubun?.value,
        userBirthday: v.user_birthday?.value,
        userCertify: v.user_certify?.value,
        userEmail: v.user_email?.value,
        userEtcState: v.user_etc_state?.value,
        userExtState: v.user_extstate?.value,
        userGroupCode: v.user_group_code?.value,
        userGroupName: v.user_group_name?.value,
        userGubun: v.user_gubun?.value,
        userId: v.user_id?.value,
        userIpphoneDbGroup: v.user_ipphone_dbgroup?.value,
        userName: v.user_name?.value,
        userPayclName: v.user_paycl_name?.value,
        userPhoneState: v.user_phone_state?.value,
        userPicturePos: v.user_picture_pos?.value,
        userState: v.user_state?.value,
        userTelCompany: v.user_tel_company?.value,
        userTelFax: v.user_tel_fax?.value,
        userTelIpphone: v.user_tel_ipphone?.value,
        userTelMobile: v.user_tel_mobile?.value,
        userTelOffice: v.user_tel_office?.value,
        userViewOrgGroup: v.user_view_org_groups?.value,
        userWorkName: v.user_work_name?.value,
        userXmlPic: v.user_xml_pic?.value,
        viewOpt: v.view_opt?.value,
      }));

      const searchRoot: TTreeNode[] = [
        {
          title: `검색 결과`,
          key: `searchResult`,
          children: userSchema,
          gubun: `G`,
        },
      ];

      setSearchMode(true);
      setSearchKeyword(keyword);
      setSearchResult(searchRoot);
    };
    if (which === 13) {
      if (keyword) {
        getSearchResult();
      } else {
        setSearchMode(false);
      }
    }
  };

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, selectedKeys?.toString());
    setSelectedNode(v);
  };

  const find = (
    list: TTreeNode[],
    key: string
  ): Promise<{ v: TTreeNode; i: number; list: TTreeNode[] }> =>
    new Promise((resolve) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key === key) {
          resolve({ v: list[i], i: i, list: list });
        }
        if (list[i].children) {
          find(list[i].children!, key).then((result) => {
            if (result) resolve(result);
          });
        }
      }
    });

  // drop event
  const onDrop = async (info: any) => {
    const {
      dragNode: {
        props: { eventKey: dragKey },
      },
      node: {
        props: { eventKey: dropKey },
      },
    } = info;
    const replica = [...treeData];
    const { v: dragV, i: dragI, list: dragList } = await find(replica, dragKey);
    const { v: dropV, i: dropI, list: dropList } = await find(replica, dropKey);

    if (dragV.gubun === `G` && dropV.gubun === `U`) {
      return false;
    }

    if (
      dragV.key === `myProfile` ||
      dragV.key === `me` ||
      dropV.key === `myProfile` ||
      dropV.key === `me`
    ) {
      return false;
    }

    if (dropV.gubun === `U`) {
      dragList.splice(dragI, 1);
      dropList.splice(dropI, 0, dragV);
    } else {
      dragList.splice(dragI, 1);

      if (dragV.gubun === `G`) {
        dropV.children?.push(dragV);
      } else {
        dropV.children?.unshift(dragV);
      }
    }
    setTreeData(replica);
  };

  const handleExpand = (expandedKeys: (string | number)[]): void => {
    console.log(`expandedKes param: `, expandedKeys);
    setExpandedKeys(expandedKeys);
  };

  const switcherGenerator = (data: any) => (
    <>
      {data?.gubun === `G` && (
        <Switcher>
          {!data?.expanded ? (
            <img
              src="/images/icon_toggle_plus.png"
              style={{ minWidth: `20px`, height: `21px` }}
            />
          ) : (
            <img
              src="/images/icon_toggle_min.png"
              style={{ minWidth: `20px`, height: `21px` }}
            />
          )}
        </Switcher>
      )}
    </>
  );

  // need to be memorized
  const renderTreeNodes = (data: TTreeNode[]) => {
    return data.map((item, i) => {
      if (item.children) {
        return (
          <TreeNode {...item} title={<Node data={item} index={i} />}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={<Node data={item} index={i} />} />;
    });
  };

  const clickHamburgerButton = () => {
    setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
  };

  const AddGroupModalOpen = () => {
    setIsHamburgerButtonClicked(false);
    setIsAddGroupModalOpen(true);
  };

  const AddGroupModalClose = () => {
    setIsAddGroupModalOpen(false);
  };

  const EditGroupTabOpen = () => {
    setIsHamburgerButtonClicked(false);
    setIsEditGroupTabOpen(true);
  };

  const EditGroupTabClose = () => {
    setIsEditGroupTabOpen(false);
  };

  return (
    <div className="contents-wrap">
      <div className="page-title-wrap">
        <h4 className="page-title">즐겨찾기</h4>
        <div className="local-search-wrap">
          <input
            type="text"
            className="local-search"
            placeholder="멤버 검색"
            title="이하와 같은 정보로 멤버를 검색해주세요. 사용자ID, 사용자명, 부서명, 직위명, 직책명, 직급명, 전화번호"
            value={searchKeyword}
            onKeyDown={handleSearch}
            onChange={handleKeywordChange}
          />
        </div>
        {isEditGroupTabOpen && (
          <div className="list-edit-action-wrap">
            <div
              className="btn-ghost-s capsule cancel"
              onClick={EditGroupTabClose}
            >
              취소
            </div>
            <div className="btn-ghost-s capsule remove">삭제</div>
            <div className="btn-ghost-s capsule up">한칸위로</div>
            <div className="btn-ghost-s capsule down">한칸아래로</div>
            <div className="btn-solid-s capsule save">저장</div>
          </div>
        )}
        <div
          className="lnb"
          title="더보기"
          style={{ marginLeft: isEditGroupTabOpen ? "initial" : "auto" }}
        >
          <HamburgerButton
            active={isHamburgerButtonClicked}
            clicked={isHamburgerButtonClicked}
            propsFunction={clickHamburgerButton}
          />
          <ul
            className={
              isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"
            }
          >
            <li
              className="lnb-menu-item go-to-add-group"
              onClick={AddGroupModalOpen}
            >
              <h6>그룹 추가</h6>
            </li>
            <li
              className="lnb-menu-item go-to-edit-group"
              onClick={EditGroupTabOpen}
            >
              <h6>그룹 수정/삭제</h6>
            </li>
            <li className="lnb-menu-item go-to-edit-favorit">
              <h6>즐겨찾기 대상 수정/삭제</h6>
            </li>
            <li className="lnb-menu-item favorite-view-option">
              <h6>멤버 보기 옵션</h6>
              <ul>
                <li>
                  표시 대상 선택
                  <div className="view-option-place-list-wrap">
                    <input
                      type="radio"
                      name="placeList"
                      id="place-online"
                      value="place-online"
                    />
                    <label
                      htmlFor="place-online"
                      className="place-online-label"
                    >
                      <i></i>온라인 사용자
                    </label>
                    <input
                      type="radio"
                      name="placeList"
                      id="place-all"
                      value="place-online"
                    />
                    <label htmlFor="place-all" className="place-all-label">
                      <i></i>전체 사용자
                    </label>
                  </div>
                </li>
                <li>
                  이름 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-name"
                      id="place-name"
                      value=""
                    />
                    <div>
                      <label htmlFor="place-name" className="view-chk-slide">
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  직위 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-position"
                      id="place-position"
                      value=""
                    />
                    <div>
                      <label
                        htmlFor="place-position"
                        className="view-chk-slide"
                      >
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  대화명 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-alias"
                      id="place-alias"
                      value=""
                    />
                    <div>
                      <label htmlFor="place-alias" className="view-chk-slide">
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  부서명 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-department"
                      id="place-department"
                      value=""
                    />
                    <div>
                      <label
                        htmlFor="place-department"
                        className="view-chk-slide"
                      >
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  전화번호 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-phone-num"
                      id="place-phone-num"
                      value=""
                    />
                    <div>
                      <label
                        htmlFor="place-phone-num"
                        className="view-chk-slide"
                      >
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  휴대번호 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-mobile-num"
                      id="place-mobile-num"
                      value=""
                    />
                    <div>
                      <label
                        htmlFor="place-mobile-num"
                        className="view-chk-slide"
                      >
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
                <li>
                  목록에 퀵버튼(쪽지,채팅,전화) 보이기
                  <div className="toggleWrap">
                    <input
                      type="checkbox"
                      name="place-quick-btn"
                      id="place-quick-btn"
                      value=""
                    />
                    <div>
                      <label
                        htmlFor="place-quick-btn"
                        className="view-chk-slide"
                      >
                        <span />
                      </label>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <main className="main-wrap">
        {treeData.length && !searchMode ? (
          <Tree
            draggable
            showLine
            showIcon={false}
            onDrop={onDrop}
            expandedKeys={expandedKeys}
            onExpand={handleExpand}
            onSelect={handleSelect}
            switcherIcon={switcherGenerator}
          >
            {renderTreeNodes(treeData)}
          </Tree>
        ) : (
          <Tree
            showLine
            showIcon={false}
            onSelect={handleSelect}
            onExpand={handleExpand}
            switcherIcon={switcherGenerator}
            expandedKeys={[`searchResult`]}
          >
            {renderTreeNodes(searchResult)}
          </Tree>
        )}
      </main>
      <SignitureCi />

      <Modal
        isOpen={isAddGroupModalOpen}
        onRequestClose={AddGroupModalClose}
        style={addGroupModalCustomStyles}
      >
        <AddGroupModal
          show={isAddGroupModalOpen}
          closeModalFunction={AddGroupModalClose}
        />
      </Modal>
    </div>
  );
}

const addGroupModalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Switcher = styled.div`
  background-color: #ebedf1;
  padding: 4px 8px;
  height: 30px;
  border-bottom: 1px solid #dfe2e8;
`;
