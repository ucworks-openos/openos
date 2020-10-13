import Tree, { TreeNode } from "rc-tree";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import {
  getChildOrg,
  getUserInfos,
} from "../../../components/ipcCommunication/ipcCommon";
import { EnodeGubun } from "../../../enum";
import useTree from "../../../hooks/useTree";
import {
  arrayLike,
  convertToUser,
  delay,
  find,
  getRandomNumber,
  syncronize,
} from "../../util";
import Node from "../AddToFavoriteTreeNode";
import moment from "moment";

type TaddToFavoriteModalProps = {
  selectedGroupInfo: any;
  closeModalFunction: () => void;
};

export default function AddToFavoriteModal(props: TaddToFavoriteModalProps) {
  // ANCHOR state
  const { closeModalFunction, selectedGroupInfo } = props;
  const { treeData, setTreeData } = useTree({ type: `favorite` });
  const [selectedKey, setSelectedKey] = useState<string | number>(1);
  const [selectedUserInfos, setSelectedUserInfos] = useState<TTreeNode[]>([]);
  const [phaze, setPhaze] = useState<0 | 1 | 2>(0);

  // ANCHOR effect
  useEffect(() => {
    const initiate = async () => {
      console.log(`selectedGroupInfo:`, selectedGroupInfo);

      const {
        data: {
          root_node: { node_item: response },
        },
      } = await getChildOrg(
        selectedGroupInfo.orgCode,
        selectedGroupInfo.groupCode,
        -1
      );
      const result = arrayLike(response)
        .filter((v: any) => v.gubun.value === EnodeGubun.ORGANIZATION_USER)
        .map((v: any) => ({
          title: v.user_name.value,
          key: v.user_id.value?.concat(`_`, getRandomNumber()),
          gubun: EnodeGubun.FAVORITE_USER,
          id: v.user_id.value,
          level: "0",
          name: v.user_name.value,
          ...(v && convertToUser(v)),
        }));

      await delay();
      setSelectedUserInfos(result);
      setPhaze(1);
    };
    initiate();
  }, []);

  // ANCHOR handler
  const handleSelect = async (_: any, e: any) => {
    const {
      node: { key: newSelectedKey },
    } = e;

    // * 선택한 부서의 자식노드를 가져옴.
    const {
      v: { children },
    } = await find(treeData, newSelectedKey);

    // TODO 시간복잡도가 O(n^2)이므로 hashmap을 사용한 튜닝이 요구됨
    // * selectedUserInfos 중에서 이미 선택한 부서에 들어가있는지 user_id로 판단. 중복되면 duplicated값 세팅.
    const someoneMaybeDuplicated = selectedUserInfos.map((v: TTreeNode) => ({
      ...v,
      duplicated: children?.find((childV: TTreeNode) => {
        return v.id == childV.id;
      })
        ? true
        : false,
    }));

    setSelectedUserInfos(someoneMaybeDuplicated);

    // * 만일 selectedUserInfos의 유저들이 선택한 부서에 모두 들어가있다면, 클릭 못하도록 selectedKey를 날려버린다.
    if (!someoneMaybeDuplicated.find((v: any) => v.duplicated === false)) {
      setSelectedKey(``);
    } else {
      setSelectedKey(newSelectedKey);
    }
  };

  const handleAddToFavorite = async () => {
    // * 부서 미선택 시 진행 불가
    if (!selectedKey) return false;
    // * 페이즈 0(로딩 )으로 세팅 후 1초 딜레이.
    setPhaze(0);
    await delay();
    // * 현재 트리에서 선택한 부서와 부서의 자식 배열을 찾음.
    const replica = [...treeData];
    const { v } = await find(replica, selectedKey);

    // * selectedUserKeys 유저 배열에서 중복 데이터 제거 후 선택 부서 key를 넣어줌
    const result = selectedUserInfos
      .filter((userV: any) => !userV.duplicated)
      .map((userV: any) => ({
        ...userV,
        pid: v.key,
      }));

    // * replica를 변경.
    v.children?.unshift(...result);
    setTreeData(replica);
    syncronize(replica);
    // * 페이즈 2 (완료 페이지)로 이동.
    setPhaze(2);
  };

  // ANCHOR etc
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
      if (item.gubun !== EnodeGubun.GROUP) return null;
      if (item.children) {
        return (
          <TreeNode
            {...item}
            title={<Node data={item} selectedKey={selectedKey} />}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          {...item}
          title={<Node data={item} selectedKey={selectedKey} />}
        />
      );
    });
  };

  const handleImageError = (image: any) => {
    image.target.onerror = null;
    image.target.src = `/images/img_imgHolder.png`;
  };

  // ANCHOR return
  return (
    <>
      {phaze === 0 ? (
        <div>로딩 중...</div>
      ) : phaze === 1 ? (
        <div>
          <Container>
            <div>
              <h4 className="page-title">다음 멤버를 추가합니다.</h4>
              <div>
                {selectedUserInfos.map((v: any) => (
                  <li
                    className={`user-row addModal ${
                      v?.duplicated && `duplicated`
                    }`}
                  >
                    <div className="user-profile-state-wrap">
                      <div className="user-pic-wrap">
                        <img
                          src={
                            v?.userPicturePos && /^http/.test(v?.userPicturePos)
                              ? v?.userPicturePos
                              : `/images/img_imgHolder.png`
                          }
                          style={{ width: `48px`, height: `48px` }}
                          alt="user-profile-picture"
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                    <div className="user-info-wrap">
                      <div className="user-info-wrap-inner">
                        <h6 className="user-name">{v?.title}</h6>
                        <span className="user-position">
                          {v?.userPayclName}
                        </span>
                        <span className="user-department">
                          {v?.userGroupName}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </div>
            <div>
              <h4 className="page-title">추가할 부서를 선택하세요.</h4>
              <div>
                <Tree
                  showLine
                  showIcon={false}
                  defaultExpandAll
                  switcherIcon={switcherGenerator}
                  onSelect={handleSelect}
                >
                  {renderTreeNodes(treeData)}
                </Tree>
              </div>
            </div>
          </Container>
          <div className="modal-btn-wrap">
            <div className="btn-ghost-s cancel" onClick={closeModalFunction}>
              취소하기
            </div>
            <div
              className={selectedKey ? `btn-solid-s` : `btn-disabled`}
              onClick={handleAddToFavorite}
            >
              추가하기
            </div>
          </div>
        </div>
      ) : phaze === 2 ? (
        <Information>
          <h4 className="page-title">즐겨찾기에 추가되었습니다.</h4>
          <div>
            <div className="btn-solid-s" onClick={closeModalFunction}>
              완료
            </div>
          </div>
        </Information>
      ) : (
        <></>
      )}
    </>
  );
}
Modal.setAppElement("#root");

const Container = styled.div`
  width: 700px;
  display: flex;

  & > div:nth-child(1) {
    width: 50%;
    & > div {
      margin: 20px 0;
      width: 90%;
      height: 300px;
      overflow: auto;
    }
  }

  & > div:nth-child(2) {
    width: 50%;
    & > div {
      margin: 20px 0;
      height: 300px;
      overflow: auto;
    }
  }
`;

const Switcher = styled.div`
  background-color: #fff;
  padding: 4px 8px;
  height: 30px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    padding: 20px 0 0 0;
    display: flex;
    justify-content: flex-end;
  }
`;
