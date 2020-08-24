import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree, { TreeNode } from "rc-tree";
import styled from "styled-components";
import "./OrganizationPage.scss";
import { useParams } from "react-router-dom";
import Node from "./OrganizationNode";
import { EventDataNode, DataNode } from "rc-tree/lib/interface";

interface OrganizationPageProps {
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

export default function OrganizationPage(props: any) {
  // set initial tree
  const { classOrgGroupCode } = useParams<OrganizationPageProps>();
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

  // attach children
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

  // load children
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
  // find node (promise)
  // list is lexically binded with treedata
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

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, Number(selectedKeys));
    setSelectedNode(v);
  };

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

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

  return (
    <div className="contents-wrap">
      <div className="page-title-wrap">
        <h4 className="page-title">조직도</h4>
        <div className="local-search-wrap">
          <input
            type="text"
            className="local-search"
            placeholder="멤버 검색"
            title="이하와 같은 정보로 멤버를 검색해주세요. 사용자ID, 사용자명, 부서명, 직위명, 직책명, 직급명, 전화번호"
          />
        </div>
      </div>
      <main className="main-wrap">
        {treeData.length && (
          <div className="rc-tree-wrap">
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
          </div>
        )}
      </main>
    </div>
  );
}

const Switcher = styled.div`
  background-color: #ebedf1;
  padding: 4px 8px;
  height: 30px;
  border-bottom: 1px solid #dfe2e8;
`;
