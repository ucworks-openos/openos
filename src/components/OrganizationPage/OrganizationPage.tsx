import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree, { TreeNode } from "rc-tree";
import styled from "styled-components";
import "../../assets/css/Tree.scss";
import { useParams } from "react-router-dom";
import Node from "./OrganizationNode";
import { EventDataNode, DataNode } from "rc-tree/lib/interface";
import {
  getBaseOrg,
  getChildOrg,
  setStatusMonitor,
} from "../ipcCommunication/ipcCommon";
import { CLIENT_RENEG_WINDOW } from "tls";
import useTree from "../../hooks/useTree";

let _orgCode = ``;

export default function OrganizationPage() {
  const { treeData, expandedKeys, setTreeData, setExpandedKeys } = useTree({
    type: `organization`,
  });
  const [selectedNode, setSelectedNode] = useState<TTreeNode | string[]>([]);
  useEffect(() => {
    const getRoot = async () => {
      const {
        data: {
          root_node: { node_item: response },
        },
      } = await getBaseOrg();
      const root: TTreeNode = response.reduce(
        (prev: any, cur: any, i: number): TTreeNode => {
          if (i === 0) {
            return {
              title: cur.group_name.value,
              key: cur.group_seq.value,
              children: [],
              gubun: cur.gubun.value,
              groupCode: cur.group_code.value,
              groupName: cur.group_name.value,
              groupParentId: cur.group_parent_id.value,
              groupSeq: cur.group_seq.value,
              nodeEnd: cur.node_end.value,
              nodeStart: cur.node_start.value,
              orgCode: cur.org_code.value,
            };
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
                },
              ],
            };
          }
        },
        {}
      );
      const monitorIds = response
        .filter((v: any) => v.gubun?.value === `P`)
        .map((v: any) => v.user_id.value);
      setTreeData([root]);
      setExpandedKeys([root.key]);
      setStatusMonitor(monitorIds);
      _orgCode = root.orgCode!;
    };
    !treeData.length && getRoot();
  }, []);

  useEffect(() => {
    console.log(`treeData: `, treeData);
    console.log(`expandedKeys: `, expandedKeys);
  });

  const getChild = async (groupCode: string) => {
    const {
      data: {
        root_node: { node_item: response },
      },
    } = await getChildOrg(_orgCode, groupCode, -1);
    const children: TTreeNode[] = response
      ?.filter((_: any, i: number) => i !== 0)
      .map((v: any) => {
        const defaultProps = {
          key: v.group_seq.value,
          gubun: v.gubun.value,
          groupParentId: v.group_parent_id.value,
          groupSeq: v.group_seq.value,
          nodeEnd: v.node_end.value,
          nodeStart: v.node_start.value,
          orgCode: v.org_code.value,
        };

        if (v.gubun.value === `P`) {
          const userProps = {
            title: v.user_name?.value,
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
          };
          return Object.assign(defaultProps, userProps);
        } else {
          // 부서
          const departmentProps = {
            children: [],
            title: v.group_name?.value,
            groupCode: v.group_code.value,
            groupName: v.group_name.value,
          };
          return Object.assign(defaultProps, departmentProps);
        }
      });
    const monitorIds = response
      .filter((v: any) => v.gubun?.value === `P`)
      .map((v: any) => v.user_id.value);
    setStatusMonitor(monitorIds);
    return children;
  };

  // attach children
  const attach = (
    prev: TTreeNode[],
    key: number,
    children: TTreeNode[]
  ): TTreeNode[] =>
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
      const children = await getChild(v.groupCode!);
      // update tree
      setTreeData(attach(treeData, Number(e.key), children));

      resolve();
    });
  };
  // find node (promise)
  // list is lexically binded with treedata
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

  const handleSelect = async ([selectedKeys]: (string | number)[]) => {
    const { v } = await find(treeData, Number(selectedKeys));
    setSelectedNode(v);
  };

  useEffect(() => {
    console.log(`selected Node: `, selectedNode);
  }, [selectedNode]);

  const switcherGenerator = (data: any) => (
    <>
      {(data?.gubun === `G` || data?.gubun === `T`) && (
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

  const handleExpand = (expandedKeys: (string | number)[]): void => {
    setExpandedKeys(expandedKeys);
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
              onExpand={handleExpand}
              switcherIcon={switcherGenerator}
              expandedKeys={expandedKeys}
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
