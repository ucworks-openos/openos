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
import useSearch from "../../hooks/useSearch";
import { arrayLike, convertToUser } from "../../common/util";
import { Efavorite, EnodeGubun } from "../../enum";
import useStatusListener from "../../hooks/useStatusListener";

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
  useStatusListener();

  type TgetBuddyTreeReturnTypes = {
    buddyTree: TTreeNode[];
    keyIds: string[];
    userIds: string[];
  };

  useEffect(() => {
    // 친구 + 개인 그룹 1deps로 가져오기.
    const getBuddyTree = async (): Promise<TgetBuddyTreeReturnTypes> => {
      const {
        data: {
          contacts: { node: responseMaybeArr },
        },
      } = await getBuddyList();
      const response = arrayLike(responseMaybeArr);
      // 친구 id만 추출
      const userIds = response
        .filter((v: any) => v.gubun === EnodeGubun.FAVORITE_USER)
        .map((v: any) => v.id);
      // 개인 그룹만 추출 (id 없을 시 name으로 추출)
      const keyIds = response
        .filter((v: any) => v.gubun === EnodeGubun.GROUP)
        .map((v: any) => (v.id ? v.id : v.name));
      // 로그인 id + 추출한 친구 id로 사용자 상세 정보 가져오기
      const {
        data: {
          items: { node_item: userSchemaMaybeArr },
        },
      } = await getUserInfos(userIds);
      // 사용자 상세 정보가 하나일 경우를 가정하여 배열로 감쌈.
      const userSchema = arrayLike(userSchemaMaybeArr);
      console.log(`userSchema: `, userSchema);
      // 즐겨찾기 트리 생성
      const root = response.reduce((prev: TTreeNode[], cur: any, i: number) => {
        // pid (parent id)가 없을 경우 최상위 노드의 자식에 삽입
        if (!cur.pid) {
          return [
            ...prev,
            {
              gubun: cur.gubun,
              title: cur.name,
              key: cur.id ? cur.id : cur.name,
              pid: cur.pid,
              children: [],
            },
          ];
        } else {
          // 재귀함수 (children에 하위 노드 삽입)
          return append(prev, cur, userSchema);
        }
      }, []);

      // 즐겨찾기 없을 경우 생성.
      const spareRoot: TTreeNode[] = [
        {
          gubun: EnodeGubun.GROUP,
          title: Efavorite.FAVORITE,
          key: Efavorite.FAVORITE,
          pid: undefined,
          children: [],
        },
      ];

      return {
        buddyTree: root.length ? root : spareRoot,
        keyIds: keyIds.length ? keyIds : [Efavorite.FAVORITE],
        userIds,
      };
    };

    const initiate = async () => {
      const { buddyTree, keyIds, userIds } = await getBuddyTree();

      setTreeData(buddyTree);
      setExpandedKeys(keyIds);
      setStatusMonitor(userIds);
    };
    !treeData.length && initiate();
  }, []);

  useEffect(() => {
    console.log(`treeData: `, treeData);
  });

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
        if (child.gubun === EnodeGubun.GROUP) {
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
          return {
            ...v,
            children: [
              ...v.children,
              {
                title: child.name,
                key: child.id,
                gubun: child.gubun,
                pid: child.pid,
                ...convertToUser(userV),
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

  // 트리 펼침
  const spread = (tree: TTreeNode[], list: TTreeNode[]) => {
    tree.forEach((v: any) => {
      list.push(v);
      if (v.children) {
        spread(v.children, list);
      }
    });

    return list;
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

    // 그룹 -> 유저 드래그
    if (
      dragV.gubun === EnodeGubun.GROUP &&
      dropV.gubun === EnodeGubun.FAVORITE_USER
    ) {
      return false;
    }
    // 유저 -> 유저 드래그
    if (dropV.gubun === EnodeGubun.FAVORITE_USER) {
      dragList.splice(dragI, 1);
      dropList.splice(dropI, 0, dragV);
    } else {
      dragList.splice(dragI, 1);
      // 그룹 -> 그룹 드래그 시 최하위로 삽입
      if (dragV.gubun === EnodeGubun.GROUP) {
        dropV.children?.push(dragV);
      } else {
        // 유저 -> 그룹 드래그 시 최상위로 삽입
        dropV.children?.unshift(dragV);
      }
    }
    setTreeData(replica);
  };

  const handleExpand = (expandedKeys: (string | number)[]): void => {
    setExpandedKeys(expandedKeys);
  };

  const switcherGenerator = (data: any) => (
    <>
      {data?.gubun === EnodeGubun.GROUP && (
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
            expandedKeys={[Efavorite.SEARCH_RESULT]}
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

Modal.setAppElement("#root");

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
