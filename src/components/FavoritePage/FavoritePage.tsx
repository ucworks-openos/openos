import React, { useState, useEffect, useMemo, Children } from "react";
import styled from "styled-components";
import "./FavoritePage.css";
import "../../assets/css/Tree.scss";
import SignitureCi from "../../common/components/SignitureCi";
import AddGroupModal from "../../common/components/Modal/AddGroupModal";
import Modal from "react-modal";
import HamburgerButton from "../../common/components/HamburgerButton";
import Node from "./FavoriteNode";
import Tree, { TreeNode } from "rc-tree";
import { setStatusMonitor } from "../../common/ipcCommunication/ipcCommon";
import {
  getBuddyList,
  getUserInfos,
} from "../../common/ipcCommunication/ipcOrganization";
import useTree from "../../hooks/useTree";
import useSearch from "../../hooks/useSearch";
import {
  arrayLike,
  convertToUser,
  find,
  getRandomNumber,
  messageInputModalStyle,
  syncronize,
} from "../../common/util";
import { Efavorite, EnodeGubun } from "../../enum";
import useStateListener from "../../hooks/useStateListener";
import MessageInputModal from "../../common/components/SendMessageModal/MessageInputModal";
import ModifyGroupModal from "../../common/components/Modal/ModifyGroupModal";
import togglePlusImg from "../../assets/images/icon_toggle_plus.png";
import toggleMinImg from "../../assets/images/icon_toggle_min.png";

type TgetBuddyTreeReturnTypes = {
  buddyTree: TTreeNode[];
  userIds: string[];
  groupIds: string[];
};

export default function FavoritePage() {
  // ANCHOR state
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );

  const [messageModalVisible, setMessageModalVisible] = useState<boolean>(
    false
  );
  const [addGroupModalVisible, setAddGroupModalVisible] = useState<boolean>(
    false
  );
  const [modifyGroupModalVisible, setModifyGroupModalVisible] = useState<
    boolean
  >(false);
  const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState<boolean>(false);
  const {
    searchMode,
    searchKeyword,
    searchResult,
    setSearchMode,
    setSearchKeyword,
    setSearchResult,
  } = useSearch({ type: `favorite` });
  const { treeData, expandedKeys, setTreeData, setExpandedKeys } = useTree({
    type: `favorite`,
  });
  const targetInfo = useStateListener();

  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [rightClickedKey, setRightClickedKey] = useState<string | number>(``);

  const [
    departmentContextMenuVisible,
    setDepartmentContextMenuVisible,
  ] = useState<boolean>(false);
  const [userContextMenuVisible, setUserContextMenuVisible] = useState<boolean>(
    false
  );

  const [clickedNodeWidth, setClickedNodeWidth] = useState<number>(0);

  const [pageX, setPageX] = useState<number>(0);

  const [pageY, setPageY] = useState<number>(0);

  const [finalSelectedKeys, setFinalSelectedKeys] = useState<
    (string | number)[]
  >([]);

  // ANCHOR memo
  const leftPositionCalculator = () => {
    const percentage = Math.round((pageX / clickedNodeWidth) * 100);
    return percentage > 100 ? pageX - (pageX - clickedNodeWidth) * 0.8 : pageX;
  };

  const leftPosition = useMemo(leftPositionCalculator, [pageX]);

  // *  finalSelectedKeys가 변경된 후, key에서 날짜를 빼준 후, 중복값을 제거해서 쪽지 쓰기 컴포넌트로 넘겨준다.
  const setFinalFinalSelectedKeys = () => {
    const processed = finalSelectedKeys.map((v: string | number) =>
      v.toString().slice(0, v.toString().lastIndexOf(`_`))
    );
    return [...new Set([...processed])];
  };

  const finalFinalSelectedKeys = useMemo(setFinalFinalSelectedKeys, [
    finalSelectedKeys,
  ]);

  // ANCHOR effect
  useEffect(() => {
    if (!rightClickedKey) {
      setFinalSelectedKeys([]);
      return;
    }
    // * 선택해둔 노드를 rightClick하지 않은 경우 rightClickedKey를 fianl로 보냄.
    if (!selectedKeys.find((v: any) => v === rightClickedKey)) {
      setFinalSelectedKeys([rightClickedKey]);
    } else {
      setFinalSelectedKeys(selectedKeys);
    }
  }, [rightClickedKey]);

  useEffect(() => {
    const initiate = () => {
      const [targetId, state, connectType] = targetInfo;
      const replica = [...treeData];
      changeState(replica, targetId, Number(state), connectType);

      setTreeData(replica);
    };
    initiate();
  }, [targetInfo]);

  useEffect(() => {
    const getBuddyTree = async (): Promise<TgetBuddyTreeReturnTypes> => {
      const {
        data: {
          contacts: { node: responseMaybeArr },
        },
      } = await getBuddyList();

      // * response가 하나일 경우를 가정하여 배열로 감쌈.
      const response = arrayLike(responseMaybeArr);
      // * 친구 id만 추출하기 위해 hierarchy object -> flat array로 convert
      const flatten = spread(response, []);
      const userIds = flatten
        .filter((v: any) => v.gubun === EnodeGubun.FAVORITE_USER)
        .map((v: any) => v.id);
      const groupIds = flatten
        .filter((v: any) => v.gubun === EnodeGubun.GROUP)
        .map((v: any) => v.id);

      const {
        data: {
          items: { node_item: userSchemaMaybeArr },
        },
      } = await getUserInfos(userIds);

      // * 사용자 상세 정보가 하나일 경우를 가정하여 배열로 감쌈.
      // * 해쉬맵에 사용자 상세정보 매핑
      const userSchema = arrayLike(userSchemaMaybeArr).reduce(
        (prev: any, cur: any, i: number) => {
          prev[cur.user_id?.value] = convertToUser(cur);
          return prev;
        },
        {}
      );

      // * gubun, name, id ->  gubun, title, key, children 등 트리 형식으로 convert
      const convertResponseToTree = (tree: any) => {
        return tree.map((v: any) => {
          if (v.gubun === EnodeGubun.GROUP) {
            const spareRandomKey = getRandomNumber();
            return {
              gubun: v.gubun,
              id: v.id ? v.id : `GROUP_${spareRandomKey}`,
              level: v.level ? v.level : `0`,
              name: v.name,
              pid: v.pid,
              title: v.name,
              key: v.id ? v.id : `GROUP_${spareRandomKey}`,
              children: convertResponseToTree(arrayLike(v.node)),
            };
          } else {
            return {
              gubun: v.gubun,
              id: v.id,
              level: v.level,
              name: v.name,
              pid: v.pid,
              title: v.name,
              key: v.id.concat(`_`, getRandomNumber()),
              ...userSchema[v.id],
            };
          }
        });
      };

      const root = convertResponseToTree(response);
      console.log(`root: `, root);

      // 즐겨찾기 없을 경우 생성.
      const spareRoot: TTreeNode[] = [
        {
          gubun: EnodeGubun.GROUP,
          id: Efavorite.FAVORITE,
          level: "0",
          name: Efavorite.FAVORITE,
          title: Efavorite.FAVORITE,
          key: Efavorite.FAVORITE,
          pid: undefined,
          children: [],
        },
      ];

      return {
        buddyTree: root.length ? root : spareRoot,
        userIds,
        groupIds,
      };
    };

    const initiate = async () => {
      const { buddyTree, userIds, groupIds } = await getBuddyTree();
      setTreeData(buddyTree);
      setStatusMonitor(userIds);
      setExpandedKeys(groupIds);
    };
    !treeData.length && initiate();
  }, []);

  // ANCHOR handler
  const handleSendGroupMessage = async () => {
    const { v } = await find(treeData, rightClickedKey);

    const childrenKeys = arrayLike(v.children!.map((v: TTreeNode) => v.key));

    if (childrenKeys.length) {
      setFinalSelectedKeys(childrenKeys);
      setMessageModalVisible(true);
    }
  };

  const handleSendGroupChat = async () => {
    const { v } = await find(treeData, rightClickedKey);

    const childrenKeys = arrayLike(v.children!.map((v: TTreeNode) => v.key));

    if (childrenKeys.length) {
      setFinalSelectedKeys(childrenKeys);
      window.location.hash = `#/chat_from_organization/${childrenKeys.join(
        `|`
      )}`;
    }
  };

  const handleChat = () => {
    window.location.hash = `#/chat_from_organization/${finalFinalSelectedKeys.join(
      `|`
    )}`;
  };

  const handleModifyGroupVisible = async () => {
    const { v: targetV, i: targetI, list: targetList } = await find(
      treeData,
      rightClickedKey.toString()
    );

    // * 최상위 그룹 수정 불가
    if (!targetV.pid) {
      handleDepartmentContextMenuClose();
      return false;
    } else {
      setModifyGroupModalVisible(true);
      handleDepartmentContextMenuClose();
    }
  };

  const handleDeleteGroup = async () => {
    const replica = [...treeData];
    const { v: targetV, i: targetI, list: targetList } = await find(
      replica,
      rightClickedKey.toString()
    );
    // * 하위 부서만 삭제 가능
    if (targetV.pid) {
      targetList.splice(targetI, 1);
      setTreeData(replica);
      syncronize(replica);
    }
    setFinalSelectedKeys([]);
    handleDepartmentContextMenuClose();
  };

  const handleDeleteBuddy = async () => {
    const replica = [...treeData];
    for (const v of finalSelectedKeys) {
      const { v: targetV, i: targetI, list: targetList } = await find(
        replica,
        v.toString()
      );
      targetList.splice(targetI, 1);
    }
    if (searchMode) {
      const searchResultReplica = [...searchResult];
      for (const v of finalSelectedKeys) {
        const { v: targetV, i: targetI, list: targetList } = await find(
          searchResultReplica,
          v.toString()
        );
        targetList.splice(targetI, 1);
      }
      setSearchResult(searchResultReplica);
    }
    setTreeData(replica);
    syncronize(replica);
    // * 선택해둔 노드를 rightClick한 경우 selectedKeys 클리어. (선택하지 않은 노드를 rightClick한 경우에는 selectedKeys 그대로 놔둠)
    if (selectedKeys.find((v: any) => v === rightClickedKey)) {
      setSelectedKeys([]);
    }
    setFinalSelectedKeys([]);
    handleUserContextMenuClose();
  };

  const handleDepartmentContextMenuClose = () => {
    setDepartmentContextMenuVisible(false);
  };

  const handleUserContextMenuClose = () => {
    setUserContextMenuVisible(false);
    // * rightClicked시에만 생기는 특수 border는 contextMenu가 close될 때 같이 사라진다.
    setRightClickedKey(``);
  };

  const handleRightClick = (info: any) => {
    const {
      node: { gubun, key: newSelectedkey },
    } = info;

    if (gubun !== EnodeGubun.FAVORITE_USER) {
      // * 부서 클릭 시
      setDepartmentContextMenuVisible(true);
      setClickedNodeWidth(
        info.event.nativeEvent.path.find((v: any) => v.localName === `div`)
          .offsetWidth
      );
    } else {
      // * 유저 클릭 시
      // * 프로필 사진 클릭 시 작동 안함
      if (info.event.nativeEvent.target.localName === `img`) return false;
      setClickedNodeWidth(
        info.event.nativeEvent.path.find((v: any) => v.localName === `li`)
          .offsetWidth
      );
      setUserContextMenuVisible(true);
    }
    // TODO depth계산해서 node에 넣어준 후, pageX에 1depth당 +30px씩 증감해야 함
    setRightClickedKey(newSelectedkey);
    setPageX(info.event.pageX);
    setPageY(info.event.pageY);
  };

  const handleKeywordChange = (e: any) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (e: any) => {
    const which = e.which;
    const keyword = e.target.value;
    const getSearchResult = async () => {
      const flatten = spread(treeData, []);
      // 사용자명, 사용자 id, 부서명, 직위, 직책, 직급, 핸드폰 번호로 검색 가능
      // user_name, user_id, user_group_name, user_paycl_name, _, _, user_tel_mobile
      const reg = new RegExp(keyword, `g`);
      const searchResult = flatten.filter(
        (v: any) =>
          reg.test(v.userName) ||
          reg.test(v.userId) ||
          reg.test(v.userGroupName) ||
          reg.test(v.userPayclName) ||
          reg.test(v.userTelMobile)
      );
      const searchRoot: TTreeNode[] = [
        {
          title: Efavorite.SEARCH_RESULT,
          key: Efavorite.SEARCH_RESULT,
          children: searchResult,
          gubun: EnodeGubun.GROUP,
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

  const handleSelect = async (_: any, e: any) => {
    const {
      nativeEvent: { shiftKey, metaKey, ctrlKey },
      node: { key: newSelectedKey, gubun },
    } = e;

    if (gubun !== EnodeGubun.FAVORITE_USER) {
      // * 이미 부서가 펼쳐져 있으면 expandedKeys에서 제외
      if (expandedKeys.indexOf(newSelectedKey) > -1) {
        setExpandedKeys(
          expandedKeys.filter((v: string | number) => v !== newSelectedKey)
        );
        // * 부서가 펼쳐지지 않았다면 expandedKeys에 push
      } else {
        setExpandedKeys([...expandedKeys, newSelectedKey]);
      }
      return false;
    }

    // * 일반 클릭 시 클릭한 노드의 키로 selectedKeys를 덮어씌움.
    if (!shiftKey && !metaKey && !ctrlKey) {
      setSelectedKeys([newSelectedKey]);
    }

    // * ctrl키 (맥 os일 경우 cmd키) 클릭 시
    if (!shiftKey && (metaKey || ctrlKey)) {
      // * 이미 선택된 노드를 클릭 시 해당 노드의 키를 selectedKeys에서 제외
      if (selectedKeys.indexOf(newSelectedKey) > -1) {
        setSelectedKeys(
          selectedKeys.filter((v: string | number) => v !== newSelectedKey)
        );
      } else {
        // * 그 외의 경우 selectedKeys에 push
        setSelectedKeys([...selectedKeys, newSelectedKey]);
      }
    }

    if (shiftKey && !metaKey && !ctrlKey) {
      // * 현재 조직도에서 유저 키만 모두 뽑아옴
      const flatUserKeys = spread(searchMode ? searchResult : treeData, [])
        .filter((v: TTreeNode) => v.gubun !== EnodeGubun.GROUP)
        .map((v: TTreeNode) => v.key);

      // * 마지막으로 selectedKeys에 push된 키/ flatUserKeys에서의 인덱스 ( 없을 시 flatUserKeys의 첫번째 키 )
      const lastSelectedKey = selectedKeys[selectedKeys.length - 1];
      let lastSelectedKeyIndex = flatUserKeys.indexOf(
        lastSelectedKey?.toString()
      );

      if (lastSelectedKeyIndex === -1) {
        lastSelectedKeyIndex = 0;
      }

      // * 클릭한 노드의 키의 flatUserKeys에서의 인덱스
      const newSelectedKeyIndex = flatUserKeys.indexOf(
        newSelectedKey?.toString()
      );

      // * 마지막으로 selectedKeys에 push된 키 ~ 클릭한 노드의 키를 모두 반환
      let range = [];
      if (lastSelectedKeyIndex - newSelectedKeyIndex < 0) {
        range = flatUserKeys.slice(
          lastSelectedKeyIndex,
          newSelectedKeyIndex + 1
        );
      } else {
        range = flatUserKeys.slice(
          newSelectedKeyIndex,
          lastSelectedKeyIndex + 1
        );
      }
      setSelectedKeys([...new Set([...selectedKeys, ...range])]);
    }
  };

  // drop event
  const handleDrop = async (info: any) => {
    if (!info.dragNode || !info.node) return false;
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

    console.log(`dragV: `, dragV);
    console.log(`dropV: `, dropV);

    // * 그룹 -> 유저 드래그시 드롭 중지
    if (
      dragV.gubun === EnodeGubun.GROUP &&
      dropV.gubun === EnodeGubun.FAVORITE_USER
    ) {
      return false;
    }
    // * 유저 -> 유저 드래그
    if (dropV.gubun === EnodeGubun.FAVORITE_USER) {
      // * 드롭 부서에 같은 유저가 있다면 드롭 중지
      if (dragV.pid !== dropV.pid) {
        if (dropList.find((v: TTreeNode) => v.userId === dragV.userId))
          return false;
      }
      dragList.splice(dragI, 1);
      dropList.splice(dropI, 0, { ...dragV, pid: dropV.pid });
    } else {
      // * 그룹 -> 그룹 드래그 시 최하위로 삽입
      if (dragV.gubun === EnodeGubun.GROUP) {
        dragList.splice(dragI, 1);
        dropV.children?.push({ ...dragV, pid: dropV.pid });
      } else {
        // * 유저 -> 부서
        // * 부서 내 같은 유저가 있다면 드롭 중지
        if (dropV?.children?.find((v: TTreeNode) => v.userId === dragV.userId))
          return false;
        // * 최상위로 삽입
        dragList.splice(dragI, 1);
        dropV.children?.unshift({ ...dragV, pid: dropV.key });
      }
    }
    syncronize(replica);
    setTreeData(replica);
  };

  const handleExpand = (expandedKeys: (string | number)[]): void => {
    setExpandedKeys(expandedKeys);
  };

  // 트리 펼침
  const spread = (tree: TTreeNode[], list: TTreeNode[]) => {
    tree.forEach((v: any) => {
      list.push(v);
      const children = v.children ? v.children : v.node;
      if (children) {
        spread(arrayLike(children), list);
      }
    });

    return list;
  };

  const changeState = (
    list: any,
    userId: string,
    state: number,
    connectType: string
  ) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].userId === userId) {
        list[i] = {
          ...list[i],
          userState: state,
          connectType,
        };
      }

      if (list[i].children) {
        changeState(list[i].children!, userId, state, connectType);
      }
    }
  };

  const switcherGenerator = (data: any) => (
    <>
      {data?.gubun === EnodeGubun.GROUP && (
        <Switcher>
          {!data?.expanded ? (
            <img
              src={togglePlusImg}
              style={{ minWidth: `20px`, height: `21px` }}
            />
          ) : (
            <img
              src={toggleMinImg}
              style={{ minWidth: `20px`, height: `21px` }}
            />
          )}
        </Switcher>
      )}
    </>
  );

  const renderTreeNodes = (data: TTreeNode[]) => {
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode
            {...item}
            title={
              <Node
                data={item}
                index={index}
                selectedKeys={selectedKeys}
                rightClickedKey={rightClickedKey}
                setSelectedKeys={setSelectedKeys}
                setFinalSelectedKeys={setFinalSelectedKeys}
                setMessageModalVisible={setMessageModalVisible}
              />
            }
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          {...item}
          title={
            <Node
              data={item}
              index={index}
              selectedKeys={selectedKeys}
              rightClickedKey={rightClickedKey}
              setSelectedKeys={setSelectedKeys}
              setFinalSelectedKeys={setFinalSelectedKeys}
              setMessageModalVisible={setMessageModalVisible}
            />
          }
        />
      );
    });
  };

  const clickHamburgerButton = () => {
    setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
  };

  const AddGroupModalOpen = () => {
    setIsHamburgerButtonClicked(false);
    setAddGroupModalVisible(true);
  };

  const AddGroupModalClose = () => {
    setAddGroupModalVisible(false);
  };

  const EditGroupTabOpen = () => {
    setIsHamburgerButtonClicked(false);
    setIsEditGroupTabOpen(true);
  };

  const EditGroupTabClose = () => {
    setIsEditGroupTabOpen(false);
  };

  // ANCHOR return
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
            closeFunction={() => {
              setIsHamburgerButtonClicked(false);
            }}
          />
          <ul
            className={
              isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"
            }
          >
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
            onDrop={handleDrop}
            expandedKeys={expandedKeys}
            onExpand={handleExpand}
            onSelect={handleSelect}
            switcherIcon={switcherGenerator}
            onRightClick={handleRightClick}
            multiple
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
            expandedKeys={[Efavorite.SEARCH_RESULT]}
            onRightClick={handleRightClick}
            multiple
          >
            {renderTreeNodes(searchResult)}
          </Tree>
        )}
      </main>
      <SignitureCi />

      <Modal
        isOpen={addGroupModalVisible}
        onRequestClose={AddGroupModalClose}
        style={commonModalStyles}
      >
        <AddGroupModal
          closeModalFunction={AddGroupModalClose}
          rightClickedKey={rightClickedKey}
        />
      </Modal>

      <Modal
        isOpen={modifyGroupModalVisible}
        onRequestClose={() => {
          setModifyGroupModalVisible(false);
        }}
        style={commonModalStyles}
      >
        <ModifyGroupModal
          closeModalFunction={() => {
            setModifyGroupModalVisible(false);
          }}
          rightClickedKey={rightClickedKey}
        />
      </Modal>

      <Modal
        isOpen={messageModalVisible}
        onRequestClose={() => {
          setMessageModalVisible(false);
        }}
        style={messageInputModalStyle}
        shouldCloseOnOverlayClick={false}
      >
        <MessageInputModal
          closeModalFunction={() => {
            setMessageModalVisible(false);
          }}
          selectedNode={finalFinalSelectedKeys}
        />
      </Modal>

      <ContextMenu
        style={{
          top: pageY,
          left: leftPosition,
          display: departmentContextMenuVisible ? `block` : `none`,
        }}
      >
        <div onMouseLeave={handleDepartmentContextMenuClose} tabIndex={1}>
          <li>
            <ul onClick={handleDeleteGroup}>그룹 삭제</ul>
            <ul onClick={handleModifyGroupVisible}>그룹 수정</ul>
            <ul
              onClick={() => {
                setAddGroupModalVisible(true);
              }}
            >
              하위 그룹 추가
            </ul>
            <ul onClick={handleSendGroupMessage}>그룹 쪽지 발송</ul>
            <ul onClick={handleSendGroupChat}>그룹 채팅 시작</ul>
          </li>
        </div>
      </ContextMenu>

      <ContextMenu
        style={{
          top: pageY,
          left: leftPosition,
          display: userContextMenuVisible ? `block` : `none`,
        }}
      >
        <div onMouseLeave={handleUserContextMenuClose} tabIndex={1}>
          <li>
            <ul onClick={handleDeleteBuddy}>즐겨찾기에서 삭제</ul>
            <ul
              onClick={() => {
                setMessageModalVisible(true);
              }}
            >
              쪽지 보내기
            </ul>
            <ul onClick={handleChat}>채팅 시작</ul>
          </li>
        </div>
      </ContextMenu>
    </div>
  );
}

Modal.setAppElement("#root");

const commonModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: { zIndex: 1000 },
};

const Switcher = styled.div`
  background-color: #ebedf1;
  padding: 4px 8px;
  height: 30px;
  border-bottom: 1px solid #dfe2e8;
`;

const ContextMenu = styled.div`
  position: absolute;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #dfe2e8;
  user-select: none;

  li ul {
    /* background-clip: border-box; */
    padding: 15px;

    &:hover {
      cursor: pointer;
      background-color: #f5f6f8;
      border-radius: 10px;
      color: #11378d;
    }
  }
`;
