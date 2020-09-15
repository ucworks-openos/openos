import React, { useState, useEffect, useMemo } from "react";
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
  getUserInfos,
  searchOrgUsers,
  setStatusMonitor,
} from "../ipcCommunication/ipcCommon";
import { CLIENT_RENEG_WINDOW } from "tls";
import useTree from "../../hooks/useTree";
import useSearch from "../../hooks/useSearch";

let _orgCode = ``;

export default function OrganizationPage() {
  const { treeData, expandedKeys, setTreeData, setExpandedKeys } = useTree({
    type: `organization`,
  });
  const {
    searchMode,
    searchKeyword,
    searchResult,
    setSearchMode,
    setSearchKeyword,
    setSearchResult,
  } = useSearch({ type: `organization` });
  const [selectedNode, setSelectedNode] = useState<TTreeNode | string[]>([]);

  useEffect(() => {
    const getRoot = async () => {
      const {
        data: {
          // 루트가 여러개인 경우는 root_node가 여러개로 들어온다.
          root_node: responseMaybeArr,
        },
      } = await getBaseOrg();

      // root_node가 하나일 경우에 배열에 담아준다. ( filter, map, reduce등을 분기문 없이 쓰기 위함)
      const response = Array.isArray(responseMaybeArr)
        ? responseMaybeArr
        : [responseMaybeArr];

      // 전체 root_node에서 사용자 id만 뽑아온다.
      const monitorIds = response
        .map((v: any) =>
          v.node_item
            .filter((v: any) => v.gubun?.value === `P`)
            .map((v: any) => v.user_id.value)
        )
        .reduce((prev: any, cur: any) => [...prev, ...cur], []);

      // root_node를 순회하며 각 root_node내의 node_item배열을 node_item객체로 변환한다.
      const root: TTreeNode[] = response.map((v: any) =>
        v.node_item.reduce((prev: any, cur: any, i: number): TTreeNode => {
          // 암묵적으로 node_item의 첫번째 인자는 루트 노드임을 가정한다.
          if (i === 0) {
            return {
              title: cur.group_name?.value,
              key: cur.group_seq?.value,
              children: [],
              gubun: cur.gubun?.value,
              groupCode: cur.group_code?.value,
              groupName: cur.group_name?.value,
              groupParentId: cur.group_parent_id?.value,
              groupSeq: cur.group_seq?.value,
              nodeEnd: cur.node_end?.value,
              nodeStart: cur.node_start?.value,
              orgCode: cur.org_code?.value,
            };
          } else {
            // 루트 바로 아래에 사용자가 있음을 가정한다.
            if (cur.gubun.value === `P`) {
              return {
                ...prev,
                children: [
                  ...prev.children,
                  {
                    title: cur.user_name?.value,
                    key: cur.user_id?.value,
                    classMaxCode: cur.class_max_code?.value,
                    connectType: cur.connect_type?.value,
                    pullClassId: cur.pull_class_id?.value,
                    pullGroupName: cur.pull_group_name?.value,
                    sipId: cur.sip_id?.value,
                    smsUsed: cur.sms_used?.value,
                    syncOpt: cur.sync_opt?.value,
                    userAliasName: cur.user_aliasname?.value,
                    userBirthGubun: cur.user_birth_gubun?.value,
                    userBirthday: cur.user_birthday?.value,
                    userCertify: cur.user_certify?.value,
                    userEmail: cur.user_email?.value,
                    userEtcState: cur.user_etc_state?.value,
                    userExtState: cur.user_extstate?.value,
                    userGroupCode: cur.user_group_code?.value,
                    userGroupName: cur.user_group_name?.value,
                    userGubun: cur.user_gubun?.value,
                    userId: cur.user_id?.value,
                    userIpphoneDbGroup: cur.user_ipphone_dbgroup?.value,
                    userName: cur.user_name?.value,
                    userPayclName: cur.user_paycl_name?.value,
                    userPhoneState: cur.user_phone_state?.value,
                    userPicturePos: cur.user_picture_pos?.value,
                    userState: cur.user_state?.value,
                    userTelCompany: cur.user_tel_company?.value,
                    userTelFax: cur.user_tel_fax?.value,
                    userTelIpphone: cur.user_tel_ipphone?.value,
                    userTelMobile: cur.user_tel_mobile?.value,
                    userTelOffice: cur.user_tel_office?.value,
                    userViewOrgGroup: cur.user_view_org_groups?.value,
                    userWorkName: cur.user_work_name?.value,
                    userXmlPic: cur.user_xml_pic?.value,
                    viewOpt: cur.view_opt?.value,
                  },
                ],
              };
            } else {
              // 루트 아래에 부서가 있음을 가정한다 (일반적인 경우)
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
          }
        }, {})
      );
      // root_node를 순회하며 최상위 키만 뽑아온다.
      const rootKeys = root.map((v: any) => v.key);
      // 모든 root_node는 하나의 org_code를 공유한다고 가정한다?
      const orgCode = root[0].orgCode;

      setTreeData(root);
      setExpandedKeys(rootKeys);
      setStatusMonitor(monitorIds);
      _orgCode = orgCode!;
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
        root_node: { node_item: responseMaybeArr },
      },
    } = await getChildOrg(_orgCode, groupCode, -1);

    // 자식이 하나일 경우를 가정하여 배열로 감싼다.
    const response = Array.isArray(responseMaybeArr)
      ? responseMaybeArr
      : [responseMaybeArr];

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

  const handleKeywordChange = (e: any) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (e: any) => {
    const which = e.which;
    const keyword = e.target.value;

    const getSearchResult = async () => {
      const {
        data: {
          root_node: { node_item: responseMaybeArr },
        },
      } = await searchOrgUsers(_orgCode, keyword);

      // 검색 결과가 없을 경우
      if (!responseMaybeArr) {
        const searchRoot: TTreeNode[] = [
          {
            title: `검색 결과`,
            key: `searchResult`,
            children: [],
            gubun: `G`,
          },
        ];
        setSearchMode(true);
        setSearchKeyword(keyword);
        setSearchResult(searchRoot);
        return false;
      }

      // 결과값이 하나일 경우를 가정하여 배열로 감쌈.
      const response = Array.isArray(responseMaybeArr)
        ? responseMaybeArr
        : [responseMaybeArr];

      // 유저 id만 추출한 후
      const userIdsMaybeDuplicated: string[] = response.map(
        (v: any) => v.user_id.value
      );

      // 중복 제거.
      const userIds = [...new Set(userIdsMaybeDuplicated)];

      // 중복제거한 id배열로 상세정보를 가져온다.
      const {
        data: {
          items: { node_item: secondResponseMaybeArr },
        },
      } = await getUserInfos(userIds);

      // 결과값이 하나일 경우를 가정하여 배열로 감쌈.
      const secondResponse = Array.isArray(secondResponseMaybeArr)
        ? secondResponseMaybeArr
        : [secondResponseMaybeArr];

      // 상세정보 useSchema에 매핑.
      const userSchema = secondResponse.map((v: any) => ({
        title: v.user_name?.value,
        key: v.user_id.value,
        gubun: v.gubun.value,
        orgCode: v.org_code.value,
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
      }));

      const searchRoot: TTreeNode[] = [
        {
          title: `검색 결과`,
          key: `searchResult`,
          children: userSchema,
          gubun: `G`,
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

  useEffect(() => {
    console.log(`searchResult: `, searchResult);
  });

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
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode {...item} title={<Node data={item} index={index} />}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={<Node data={item} index={index} />} />;
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
            value={searchKeyword}
            onChange={handleKeywordChange}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
      <main className="main-wrap">
        <div className="rc-tree-wrap">
          {treeData.length && !searchMode ? (
            <Tree
              loadData={load}
              showLine
              showIcon={false}
              onSelect={handleSelect}
              onExpand={handleExpand}
              switcherIcon={switcherGenerator}
              expandedKeys={expandedKeys}
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
              expandedKeys={[`searchResult`]}
            >
              {renderTreeNodes(searchResult)}
            </Tree>
          )}
        </div>
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
