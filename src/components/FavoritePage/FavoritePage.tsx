import React, { useState, useEffect } from "react";
import userThumbnail from "../../assets/images/img_user-thumbnail.png";
import imgHolder from "../../assets/images/img_imgHolder.png";
import styled from "styled-components";
import "./FavoritePage.css";
import "../../Tree.scss";
import SignitureCi from "../_Common/SignitureCi";
import AddGroupModal from "../_Modals/AddGroupModal";
import Modal from "react-modal";
import HamburgerButton from "../_Common/HamburgerButton";
import { useParams } from "react-router-dom";
import axios from "axios";
import Node from "./FavoriteNode";
import Tree, { TreeNode } from "rc-tree";
import { EventDataNode } from "rc-tree/lib/interface";

interface FavoritePageProps {
  classOrgGroupCode: string;
}

interface TreeNodeInterface {
  title: string;
  key: number;
  isLeaf: boolean;
  classGroupCode: string;
  classUpperGroupCode: string;
  classId: number;
  classUpperClassId: number;
  classKind: `1` | `2`;
  classGroupName: string;
  children: TreeNodeInterface[];
  classOrderNo: number;
}

function FavoritePage(props: any) {
  const { classOrgGroupCode } = useParams<FavoritePageProps>();
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState(false);
  const [treeData, setTreeData] = useState<TreeNodeInterface[]>([
    {
      title: "",
      key: 0,
      isLeaf: false,
      classGroupCode: ``,
      classUpperGroupCode: ``,
      classId: 0,
      classUpperClassId: 0,
      classKind: `2`,
      classGroupName: ``,
      classOrderNo: 1,
      children: [],
    },
  ]);
  const [selectedNode, setSelectedNode] = useState<TreeNodeInterface>({
    title: "",
    key: 0,
    isLeaf: false,
    classGroupCode: ``,
    classUpperGroupCode: ``,
    classId: 0,
    classUpperClassId: 0,
    classKind: `2`,
    classGroupName: ``,
    classOrderNo: 1,
    children: [],
  });

  // fetching root
  useEffect(() => {
    const getRoot = async () => {
      const {
        data: { resultSet },
      } = await axios.get(
        `http://localhost:4000/v0/tree/root?classOrgGroupCode=${classOrgGroupCode}`
      );

      const [data] = resultSet;

      const root: TreeNodeInterface = {
        title: data ? data.class_group_name : "",
        key: data ? data.class_id : 0,
        isLeaf: false,
        classGroupCode: data.class_group_code,
        classUpperGroupCode: data.class_upper_group_code,
        classId: data.class_id,
        classUpperClassId: data.class_upper_class_id,
        classKind: `2`,
        classGroupName: data.class_group_name,
        classOrderNo: data.classOrderNo,
        children: [],
      };
      setTreeData([root]);
    };
    getRoot();

    return () => {
      setTreeData([]);
    };
  }, [classOrgGroupCode]);

  const getChild = async (classGroupCode: string) => {
    const {
      data: { resultSet },
    } = await axios.get(
      `http://localhost:4000/v0/tree/child?classOrgGroupCode=${classOrgGroupCode}&classGroupCode=${classGroupCode}`
    );
    return resultSet.map((v: any) => ({
      title: v.class_kind === `2` ? v.class_group_name : v.class_user_name,
      key: v.class_id,
      isLeaf: v.class_kind === `2` ? false : true,
      classGroupCode: v.class_group_code,
      classUpperGroupCode: v.class_upper_group_code,
      classId: v.class_id,
      classUpperClassId: v.class_upper_class_id,
      classKind: v.class_kind,
      classGroupName: v.class_group_name,
    }));
  };

  const attach = (
    prev: TreeNodeInterface[],
    key: number,
    children: TreeNodeInterface[]
  ): TreeNodeInterface[] =>
    prev.map((v) => {
      // 1 depth searching
      if (Number(v.key) === Number(key)) {
        return {
          ...v,
          childCnt: children.length,
          isLeaf: false,
          children,
        };
        // children searching
      } else if (v.children) {
        return {
          ...v,
          children: attach(v.children, key, children),
        };
      }
      return v;
    });

  const load = (e: EventDataNode): Promise<void> => {
    return new Promise(async (resolve) => {
      // avoid duplicated axios call
      if (e.children) {
        resolve();
        return;
        // if the node yet to load chilren, execute axios call.
      } else if (!e.isLeaf) {
        const { v } = await find(treeData, Number(e.key));
        const children = await getChild(v.classGroupCode);
        // update tree
        setTreeData((prev) => attach(prev, Number(e.key), children));
      }
      resolve();
    });
  };

  const find = (
    list: TreeNodeInterface[],
    key: number
  ): Promise<{ v: TreeNodeInterface; i: number; list: TreeNodeInterface[] }> =>
    new Promise((resolve) => {
      for (let i = 0; i < list.length; i++) {
        if (Number(list[i].key) === Number(key)) {
          resolve({ v: list[i], i: i, list: list });
        }
        if (list[i].children) {
          find(list[i].children, key).then((result) => {
            if (result) resolve(result);
          });
        }
      }
    });

  // align list's order as 1 to n
  const align = (list: TreeNodeInterface[]): TreeNodeInterface[] =>
    list.map((v, i) => ({
      ...v,
      classOrderNo: i,
    }));

  // syncronize order with database
  const syncronize = async (list: TreeNodeInterface[]) => {
    const classList = list.map((v) => ({
      classId: v.classId,
      classOrderNo: v.classOrderNo,
    }));

    await axios.put(`http://localhost:4000/v0/tree/order`, {
      list: classList,
    });
  };

  // update child's class info moving into other parent
  const move = async (
    parent: TreeNodeInterface,
    child: TreeNodeInterface,
    dropPosition: number
  ) => {
    if (
      parent.classUpperGroupCode === child.classUpperGroupCode &&
      dropPosition !== 0
    ) {
      return false;
    }
    const data = {
      classId: child.classId,
      classUpperGroupCode:
        dropPosition === 0 ? parent.classGroupCode : parent.classUpperGroupCode,
      classUpperClassId:
        dropPosition === 0 ? parent.classId : parent.classUpperClassId,
      classGroupCode:
        child.classKind === "2"
          ? child.classGroupCode
          : dropPosition === 0
            ? parent.classGroupCode
            : parent.classUpperGroupCode,
      classGroupName:
        child.classKind === "2"
          ? child.classGroupName
          : dropPosition === 0
            ? parent.classGroupName
            : parent.classGroupName,
    };
    await axios.patch(`http://localhost:4000/v0/tree/child`, data);
  };

  // validation check if you drop something to user
  const validate = async (
    replica: TreeNodeInterface[],
    dropKey: number,
    dropPosition: number
  ) => {
    const { v: dropV } = await find(replica, dropKey);
    console.log(`dropV: `, dropV);
    return dropV.classKind === "1" && dropPosition === 0 ? false : true;
  };

  // drop event
  const onDrop = async (info: any) => {
    const {
      dropToGap,
      dragNode: {
        props: { eventKey: dragKey },
      },
      node: {
        props: { eventKey: dropKey, pos: dropPos },
      },
    } = info;
    const dropPosArr = dropPos.split("-");
    // drop position === -1 : drop to upper line
    // drop position === 0 : drop to node
    // drop position === 1 : drop to bottom line
    const dropPosition =
      info.dropPosition - Number(dropPosArr[dropPosArr.length - 1]);
    const replica = [...treeData];
    // validation check if you drop something to user
    if (!(await validate(replica, dropKey, dropPosition))) {
      //_set_has_dropped_to_user(true);
      // alert("사용자 하위에 추가할 수 없습니다.");
      return false;
    }
    const { v: dragV, i: dragI, list: dragList } = await find(replica, dragKey);
    // delete drag node
    dragList.splice(dragI, 1);
    if (!dropToGap) {
      const { v: dropV } = await find(replica, dropKey);
      // if you drop something to node having children, push something to it's children
      if (dropV.children) {
        dropV.children.push(dragV);
      } else {
        // if you drop something to node not having children(or yet to have), execute axios call
        let children = await getChild(dropV.classGroupCode);
        dropV.children = [...children, dragV];
      }
      move(dropV, dropV.children[dropV.children.length - 1], dropPosition);
      dropV.children = align(dropV.children);
      syncronize(dropV.children);
    } else {
      if (dropPosition === -1) {
        let { v: dropV, i: dropI, list: dropList } = await find(
          replica,
          dropKey
        );
        // splice i = arr[i-1]
        dropList.splice(dropI, 0, dragV);
        move(dropV, dragV, dropPosition);
        dropList = align(dropList);
        syncronize(dropList);
      } else {
        let { v: dropV, i: dropI, list: dropList } = await find(
          replica,
          dropKey
        );
        dropList.splice(dropI + 1, 0, dragV);
        move(dropV, dragV, dropPosition);
        dropList = align(dropList);
        syncronize(dropList);
      }
    }
    setTreeData(replica);
  };

  const switcherGenerator = (data: any) => (
    <>
      {data?.classKind === `2` && (
        <Switcher>
          {!data?.isLeaf && !data?.expanded ? (
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
  const renderTreeNodes = (data: TreeNodeInterface[]) => {
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

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, Number(selectedKeys));
    setSelectedNode(v);
  };

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

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
          loadData={load}
          draggable
          showLine
          showIcon={false}
          onDrop={onDrop}
          onSelect={handleSelect}
          switcherIcon={switcherGenerator}
        >
          {renderTreeNodes(treeData)}
        </Tree>
      </main>
      <SignitureCi />

      {/* Modal Parts */}

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

export default FavoritePage;

Modal.setAppElement("#root");
const userInfoModalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
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
