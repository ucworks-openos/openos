import React, { useState, useEffect } from "react";
import userThumbnail from "../../assets/images/img_user-thumbnail.png";
import imgHolder from "../../assets/images/img_imgHolder.png";
import styled from "styled-components";
import "./FavoritePage.css";
import "../../assets/css/Tree.scss";
import SignitureCi from "../../common/components/SignitureCi";
import AddGroupModal from "../../common/components/Modal/AddGroupModal";
import Modal from "react-modal";
import HamburgerButton from "../../common/components/HamburgerButton";
import { useParams } from "react-router-dom";
import axios from "axios";
import Node from "./FavoriteNode";
import Tree, { TreeNode } from "rc-tree";
import { EventDataNode } from "rc-tree/lib/interface";
import {
  getBuddyList,
  setStatusMonitor,
  getUserInfos,
} from "../ipcCommunication/ipcCommon";
import useTree from "../../hooks/useTree";

Modal.setAppElement("#root");
const _orgCode = ``;

export default function FavoritePage() {
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TTreeNode>(
    _defaultFavoriteNode
  );
  const {
    treeData,
    autoExpandParent,
    expandedKeys,
    setTreeData,
    setExpandedKeys,
    toggleAutoExpandParent,
  } = useTree({ type: `favorite` });

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

  // fetching root
  useEffect(() => {
    const getBuddy = async () => {
      const {
        data: {
          contacts: { node: response },
        },
      } = await getBuddyList();
      const userIds = response
        .filter((v: any) => v.gubun === `U`)
        .map((v: any) => v.id);
      const {
        data: {
          items: { node_item: userSchema },
        },
      } = await getUserInfos(userIds);
      const root = response.reduce((prev: TTreeNode[], cur: any) => {
        // 루트
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
          return append(prev, cur, userSchema);
        }
      }, []);

      console.log(`root: `, root);

      setTreeData(root);
      setExpandedKeys([root.key]);
      setStatusMonitor(userIds);
    };
    !treeData.length && getBuddy();
  }, []);

  // append children
  const append = (
    prev: TTreeNode[],
    child: any,
    userSchema: any
  ): TTreeNode[] =>
    prev.map((v: any) => {
      if (v.key === child.pid) {
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
          const userV = userSchema.find(
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
                userAliasName: v.user_aliasname?.value,
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
        // children searching
      } else if (v.children) {
        return {
          ...v,
          children: append(v.children, child, userSchema),
        };
      }
      return v;
    });

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, Number(selectedKeys));
    setSelectedNode(v);
  };

  const find = (
    list: TTreeNode[],
    key: number
  ): Promise<{ v: TTreeNode; i: number; list: TTreeNode[] }> =>
    new Promise((resolve) => {
      for (let i = 0; i < list.length; i++) {
        if (Number(list[i].key) === Number(key)) {
          resolve({ v: list[i], i: i, list: list });
        }
        if (list[i].children) {
          find(list[i].children!, key).then((result) => {
            if (result) resolve(result);
          });
        }
      }
    });

  // align list's order as 1 to n
  // const align = (list: TTreeNode[]): TTreeNode[] =>
  //   list.map((v, i) => ({
  //     ...v,
  //     classOrderNo: i,
  //   }));

  // syncronize order with database
  // const syncronize = async (list: TTreeNode[]) => {
  //   const classList = list.map((v) => ({
  //     classId: v.classId,
  //     classOrderNo: v.classOrderNo,
  //   }));

  //   await axios.put(`http://localhost:4000/v0/tree/order`, {
  //     list: classList,
  //   });
  // };

  // update child's class info moving into other parent
  // const move = async (
  //   parent: TTreeNode,
  //   child: TTreeNode,
  //   dropPosition: number
  // ) => {
  //   if (
  //     parent.classUpperGroupCode === child.classUpperGroupCode &&
  //     dropPosition !== 0
  //   ) {
  //     return false;
  //   }
  //   const data = {
  //     classId: child.classId,
  //     classUpperGroupCode:
  //       dropPosition === 0 ? parent.classGroupCode : parent.classUpperGroupCode,
  //     classUpperClassId:
  //       dropPosition === 0 ? parent.classId : parent.classUpperClassId,
  //     classGroupCode:
  //       child.classKind === "2"
  //         ? child.classGroupCode
  //         : dropPosition === 0
  //           ? parent.classGroupCode
  //           : parent.classUpperGroupCode,
  //     classGroupName:
  //       child.classKind === "2"
  //         ? child.classGroupName
  //         : dropPosition === 0
  //           ? parent.classGroupName
  //           : parent.classGroupName,
  //   };
  //   await axios.patch(`http://localhost:4000/v0/tree/child`, data);
  // };

  // validation check if you drop something to user
  // const validate = async (
  //   replica: TTreeNode[],
  //   dropKey: number,
  //   dropPosition: number
  // ) => {
  //   const { v: dropV } = await find(replica, dropKey);
  //   console.log(`dropV: `, dropV);
  //   return dropV.classKind === "1" && dropPosition === 0 ? false : true;
  // };

  // drop event
  // const onDrop = async (info: any) => {
  //   const {
  //     dropToGap,
  //     dragNode: {
  //       props: { eventKey: dragKey },
  //     },
  //     node: {
  //       props: { eventKey: dropKey, pos: dropPos },
  //     },
  //   } = info;
  //   const dropPosArr = dropPos.split("-");
  //   // drop position === -1 : drop to upper line
  //   // drop position === 0 : drop to node
  //   // drop position === 1 : drop to bottom line
  //   const dropPosition =
  //     info.dropPosition - Number(dropPosArr[dropPosArr.length - 1]);
  //   const replica = [...treeData];
  //   // validation check if you drop something to user
  //   if (!(await validate(replica, dropKey, dropPosition))) {
  //     //_set_has_dropped_to_user(true);
  //     // alert("사용자 하위에 추가할 수 없습니다.");
  //     return false;
  //   }
  //   const { v: dragV, i: dragI, list: dragList } = await find(replica, dragKey);
  //   // delete drag node
  //   dragList.splice(dragI, 1);
  //   if (!dropToGap) {
  //     const { v: dropV } = await find(replica, dropKey);
  //     // if you drop something to node having children, push something to it's children
  //     if (dropV.children) {
  //       dropV.children.push(dragV);
  //     } else {
  //       // if you drop something to node not having children(or yet to have), execute axios call
  //       let children = await getChild(dropV.classGroupCode);
  //       dropV.children = [...children, dragV];
  //     }
  //     move(dropV, dropV.children[dropV.children.length - 1], dropPosition);
  //     dropV.children = align(dropV.children);
  //     syncronize(dropV.children);
  //   } else {
  //     if (dropPosition === -1) {
  //       let { v: dropV, i: dropI, list: dropList } = await find(
  //         replica,
  //         dropKey
  //       );
  //       // splice i = arr[i-1]
  //       dropList.splice(dropI, 0, dragV);
  //       move(dropV, dragV, dropPosition);
  //       dropList = align(dropList);
  //       syncronize(dropList);
  //     } else {
  //       let { v: dropV, i: dropI, list: dropList } = await find(
  //         replica,
  //         dropKey
  //       );
  //       dropList.splice(dropI + 1, 0, dragV);
  //       move(dropV, dragV, dropPosition);
  //       dropList = align(dropList);
  //       syncronize(dropList);
  //     }
  //   }
  //   setTreeData(replica);
  // };

  const handleExpand = (expandedKeys: (string | number)[]): void => {
    setExpandedKeys(expandedKeys);
    toggleAutoExpandParent();
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
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode {...item} title={<Node data={item} />}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={<Node data={item} />} />;
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
        <Tree
          draggable
          showLine
          showIcon={false}
          // onDrop={onDrop}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={handleExpand}
          onSelect={handleSelect}
          switcherIcon={switcherGenerator}
        >
          {renderTreeNodes(treeData)}
        </Tree>
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

const _defaultFavoriteNode: TTreeNode = {
  title: ``,
  key: `0`,
  children: [],
  groupCode: ``,
  groupName: ``,
  groupParentId: ``,
  groupSeq: ``,
  gubun: `G`,
  nodeEnd: ``,
  nodeStart: ``,
  orgCode: ``,
};

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
