import React, { useState, useEffect } from "react";
import userThumbnail from "../../assets/images/img_user-thumbnail.png";
import imgHolder from "../../assets/images/img_imgHolder.png";
import styled from "styled-components";
import "./FavoritePage.css";
import "../../assets/css/Tree.scss";
import SignitureCi from "../common/SignitureCi";
import AddGroupModal from "./AddGroupModal";
import Modal from "react-modal";
import HamburgerButton from "../common/HamburgerButton";
import { useParams } from "react-router-dom";
import axios from "axios";
import Node from "./FavoriteNode";
import Tree, { TreeNode } from "rc-tree";
import { EventDataNode } from "rc-tree/lib/interface";
import { getBuddyList, setStatusMonitor } from "../ipcCommunication/ipcCommon";

Modal.setAppElement("#root");

export default function FavoritePage() {
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState(false);
  const [treeData, setTreeData] = useState<TFavoriteNode[]>([
    _defaultFavoriteNode
  ]);
  const [selectedNode, setSelectedNode] = useState<TFavoriteNode>(
    _defaultFavoriteNode
  );
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([``]);

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

  // fetching root
  useEffect(() => {
    const getBuddy = async () => {
      const { data: { contacts: { node: response } } } = await getBuddyList();
      const root = response.reduce((prev: any, cur: any, i: number) => {
        if (i === 0) {
          return {
            title: cur.name,
            key: cur.id,
            gubun: cur.gubun,
            id: cur.id,
            name: cur.name,
            children: []
          }
        } else {
          return {
            ...prev,
            children: [
              ...prev.children,
              {
                title: cur.name,
                key: cur.id,
                gubun: cur.gubun,
                id: cur.id,
                name: cur.name,
              }
            ]
          }
        }
      }, {})

      const monitorIds = response.filter((_: any, i: number) => i !== 0).map((v: TFavoriteNode, i: number) => v.id);
      setTreeData([root]);
      setExpandedKeys([root.id]);
      setStatusMonitor(monitorIds)

    }
    getBuddy();


  }, []);

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, Number(selectedKeys));
    setSelectedNode(v);
  };

  const find = (
    list: TFavoriteNode[],
    key: number
  ): Promise<{ v: TFavoriteNode; i: number; list: TFavoriteNode[] }> =>
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
  // const align = (list: TFavoriteNode[]): TFavoriteNode[] =>
  //   list.map((v, i) => ({
  //     ...v,
  //     classOrderNo: i,
  //   }));

  // syncronize order with database
  // const syncronize = async (list: TFavoriteNode[]) => {
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
  //   parent: TFavoriteNode,
  //   child: TFavoriteNode,
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
  //   replica: TFavoriteNode[],
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
    setAutoExpandParent(false);
  }

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
  const renderTreeNodes = (data: TFavoriteNode[]) => {
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

const _orgCode = ``;

const _defaultFavoriteNode: TFavoriteNode = {
  title: ``,
  key: `0`,
  gubun: `G`,
  id: ``,
  name: ``,
  children: []
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
