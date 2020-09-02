import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree, { TreeNode } from "rc-tree";
import styled from "styled-components";
import "../../Tree.scss";
import { useParams } from "react-router-dom";
import Node from "./OrganizationNode";
import { EventDataNode, DataNode } from "rc-tree/lib/interface";
import { getBaseOrg, getChildOrg } from "../ipcCommunication/ipcCommon";

interface TreeNodeInterface {
  title: string;
  key: number;
  children: TreeNodeInterface[];
  groupCode: string;
  groupName: string;
  groupParentId: string;
  groupSeq: string;
  gubun: string;
  nodeEnd: string;
  nodeStart: string;
  orgCode: string;
}

const _defaultTreeNode: TreeNodeInterface = {
  title: ``,
  key: 0,
  children: [],
  groupCode: ``,
  groupName: ``,
  groupParentId: ``,
  groupSeq: ``,
  gubun: ``,
  nodeEnd: ``,
  nodeStart: ``,
  orgCode: ``,
}

let _orgCode = ``;

export default function OrganizationPage() {
  // set initial tree
  const [treeData, setTreeData] = useState<TreeNodeInterface[]>([
    _defaultTreeNode,
  ]);

  const [selectedNode, setSelectedNode] = useState<TreeNodeInterface>(
    _defaultTreeNode
  );
  // fetching root
  useEffect(() => {
    const getRoot = async () => {
      const { data: { root_node: { node_item: response } } } = await getBaseOrg();
      const root = response.reduce((prev: any, cur: any, i: number) => {
        if (i === 0) {
          return {
            title: cur.group_name.value,
            key: cur.group_seq.value,
            children: [],
            groupCode: cur.group_code.value,
            groupName: cur.group_name.value,
            groupParentId: cur.group_parent_id.value,
            groupSeq: cur.group_seq.value,
            gubun: cur.gubun.value,
            nodeEnd: cur.node_end.value,
            nodeStart: cur.node_start.value,
            orgCode: cur.org_code.value,
          }
        } else {
          return {
            ...prev,
            children: [
              ...prev.children,
              {
                title: cur.group_name.value,
                key: cur.group_seq.value,
                children: [],
                groupCode: cur.group_code.value,
                groupName: cur.group_name.value,
                groupParentId: cur.group_parent_id.value,
                groupSeq: cur.group_seq.value,
                gubun: cur.gubun.value,
                nodeEnd: cur.node_end.value,
                nodeStart: cur.node_start.value,
                orgCode: cur.org_code.value,
              }
            ]
          }
        }
      }, {});
      setTreeData([root]);
      console.log(`root: `, root);
      _orgCode = root.orgCode;
    }
    getRoot();
    return () => {
      setTreeData([]);
    };
  }, []);

  const getChild = async (groupCode: string) => [
    // await getChildOrg();
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
      }
      const { v } = await find(treeData, Number(e.key));
      const children = await getChild(v.groupCode);
      // update tree
      setTreeData((prev) => attach(prev, Number(e.key), children));

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
