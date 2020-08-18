import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree, { TreeNode } from "rc-tree";
import styled from "styled-components";
import "./index.scss";
import { useParams } from "react-router-dom";
import Node from "./Node";

// attach children
const attach = ({ prev, key, children }) =>
  prev.map((v) => {
    // 1 depth searching
    if (Number(v.key) === Number(key)) {
      return {
        ...v,
        childCnt: children.length,
        children,
      };
      // children searching
    } else if (v.children) {
      return {
        ...v,
        children: attach({
          prev: v.children,
          key: key,
          children,
        }),
      };
    }
    return v;
  });

const getChild = async ({ classOrgGroupCode, classGroupCode }) => {
  const {
    data: { resultSet },
  } = await axios.get(
    `http://localhost:4000/v0/tree/child?classOrgGroupCode=${classOrgGroupCode}&classGroupCode=${classGroupCode}`
  );
  return resultSet.map((v, i) => ({
    title: v.class_kind === `2` ? v.class_group_name : v.class_user_name,
    key: v.class_id,
    isLeaf: v.child_cnt === 0 ? true : false,
    classGroupCode: v.class_group_code,
    classUpperGroupCode: v.class_upper_group_code,
    classId: v.class_id,
    classUpperClassId: v.class_upper_class_id,
    classKind: v.class_kind,
    classGroupName: v.class_group_name,
  }));
};

export default function TreeComponent(props) {
  // set initial tree
  const { classOrgGroupCode } = useParams();
  const [treeData, setTreeData] = useState(() => {
    const result = [{ title: "", key: 0, children: [] }];
    return result;
  });
  const [selectedNode, setSelectedNode] = useState({});
  // fetching root
  useEffect(() => {
    const getRoot = async () => {
      const {
        data: { resultSet },
      } = await axios.get(
        `http://localhost:4000/v0/tree/root?classOrgGroupCode=${classOrgGroupCode}`
      );

      const [data] = resultSet;

      const root = {
        title: data ? data.class_group_name : "",
        key: data ? data.class_id : 0,
        isLeaf: data && data.child_cnt === 0 ? true : false,
        classGroupCode: data.class_group_code,
        classUpperGroupCode: data.class_upper_group_code,
        classId: data.class_id,
        classUpperClassId: data.class_upper_class_id,
        classKind: `2`,
        classGroupName: data.class_group_name,
      };
      setTreeData([root]);
    };
    getRoot();

    return () => {
      setTreeData([]);
    };
  }, [classOrgGroupCode]);

  // load children
  const load = ({ key, children, isLeaf, classGroupCode }) => {
    return new Promise(async (resolve) => {
      // avoid duplicated axios call
      if (children) {
        resolve();
        return;
        // if the node yet to load chilren, execute axios call.
      } else if (!isLeaf) {
        const children = await getChild({
          classOrgGroupCode,
          classGroupCode,
        });
        // update tree
        setTreeData((prev) =>
          attach({
            prev,
            key: key,
            children,
          })
        );
      }
      resolve();
    });
  };
  // find node (promise)
  // list is lexically binded with treedata
  const find = (list, key) =>
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
  const align = (list) =>
    list.map((v, i) => ({
      ...v,
      classOrderNo: i,
    }));

  // syncronize order with database
  const syncronize = async (list) => {
    const classList = list.map((v) => ({
      classId: v.classId,
      classOrderNo: v.classOrderNo,
    }));

    await axios.put(`http://localhost:4000/v0/tree/order`, {
      list: classList,
    });
  };

  const handleSelect = async (e) => {
    const [key] = e;
    const node = await find(treeData, key);
    setSelectedNode(node);
  };

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

  // update child's class info moving into other parent
  const move = async (parent, child, dropPosition) => {
    console.log(`parent class group name: `, parent.classGroupName);
    console.log(`child class group name: `, child.classGroupName);
    if (
      parent.classUpperGroupCode === child.classUpperGroupCode &&
      dropPosition !== 0
    ) {
      return false;
    }
    child = {
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
    await axios.patch(`http://localhost:4000/v0/tree/child`, child);
  };

  // validation check if you drop something to user
  const validate = async (replica, dropKey, dropPosition) => {
    const { v: dropV } = await find(replica, dropKey);
    console.log(`dropV: `, dropV);
    return dropV.classKind === "1" && dropPosition === 0 ? false : true;
  };

  // drop event
  const onDrop = async (info) => {
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
      alert("사용자 하위에 추가할 수 없습니다.");
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
        let children = await getChild({
          classOrgGroupCode,
          classGroupCode: dropV.classGroupCode,
        });
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

  const switcherGenerator = (data) => (
    <>
      {data?.classKind === `2` && (
        <>
          {!data?.isLeaf && !data?.expanded ? (
            <img
              src="/images/icon_toggle_plus.png"
              style={{ width: `20px`, height: `21px` }}
            />
          ) : (
            <img
              src="/images/icon_toggle_min.png"
              style={{ width: `20px`, height: `21px` }}
            />
          )}
        </>
      )}
    </>
  );

  // need to be memorized
  const renderTreeNodes = (data) => {
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

  return (
    <>
      {/* don't use tree caching  */}
      {treeData.length && (
        <div className="contents-wrap">
          <main className="main-wrap">
            <Container>
              <Tree
                loadData={load}
                draggable
                blockNode
                showLine
                showIcon={false}
                onDrop={onDrop}
                onSelect={handleSelect}
                switcherIcon={switcherGenerator}
              >
                {renderTreeNodes(treeData)}
              </Tree>
            </Container>
          </main>
        </div>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  position: relative;
  overflow: hidden;
  /* overflow: hidden으로 인해 노드 높이가 잘리는 버그로 인해 padding-bottom값 부여 */
  padding-bottom: 50px;
`;
