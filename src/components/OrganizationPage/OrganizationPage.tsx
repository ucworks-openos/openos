import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree, { TreeNode } from "rc-tree";
import styled from "styled-components";
import "../../Tree.scss";
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
  classUpperGroupCode: string | null;
  classId: number;
  classUpperClassId: number | null;
  classKind: string;
  classGroupName: string;
  children: TreeNodeInterface[];
  classOrderNo: number;
}

const defaultTreeNode = {
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
};

export default function OrganizationPage(props: any) {
  // set initial tree
  const { classOrgGroupCode } = useParams<OrganizationPageProps>();
  const [treeData, setTreeData] = useState<TreeNodeInterface[]>([
    defaultTreeNode,
  ]);

  const [selectedNode, setSelectedNode] = useState<TreeNodeInterface>(
    defaultTreeNode
  );
  // fetching root
  useEffect(() => {
    const root: TreeNodeInterface = {
      title: `유씨웨어`,
      key: 0,
      isLeaf: false,
      classGroupCode: `D0`,
      classUpperGroupCode: null,
      classId: 0,
      classUpperClassId: null,
      classKind: `2`,
      classGroupName: `유씨웨어`,
      classOrderNo: 0,
      children: [],
    };
    setTreeData([root]);

    return () => {
      setTreeData([]);
    };
  }, []);

  const getChild = async (classGroupCode: string) => [
    {
      title: `개발팀`,
      key: 1,
      isLeaf: false,
      classGroupCode: `D1`,
      classUpperGroupCode: `D0`,
      classId: 1,
      classUpperClassId: 0,
      classKind: `2`,
      classOrderNo: 0,
      classGroupName: `개발팀`,
      children: [],
    },
  ];

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

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, Number(selectedKeys));
    setSelectedNode(v);
  };

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

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
