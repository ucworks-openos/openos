import Tree, { TreeNode } from "rc-tree";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { getUserInfos } from "../../../components/ipcCommunication/ipcCommon";
import { EnodeGubun } from "../../../enum";
import useTree from "../../../hooks/useTree";
import { arrayLike, convertToUser, delay } from "../../util";
import Node from "../AddToFavoriteTreeNode";

type TaddToFavoriteModalProps = {
  selectedKeys: (string | number)[];
  setSelectedKeys: (keys: (string | number)[]) => void;
  closeModalFunction: () => void;
};

export default function AddToFavoriteModal(props: TaddToFavoriteModalProps) {
  // ANCHOR state
  const { closeModalFunction, selectedKeys, setSelectedKeys } = props;
  const { treeData, setTreeData } = useTree({ type: `favorite` });
  const [selectedKey, setSelectedKey] = useState<string | number>(0);
  const [selectedUserInfos, setSelectedUserInfos] = useState<TTreeNode[]>([]);
  const [phaze, setPhaze] = useState<0 | 1 | 2 | 3>(0);

  // ANCHOR memo
  const spread = (tree: TTreeNode[], list: (string | number)[]) => {
    tree.forEach((v: any) => {
      if (v.gubun !== EnodeGubun.GROUP) {
        list.push(v.key);
      }
      if (v.children) {
        spread(v.children, list);
      }
    });

    return list;
  };

  const setFlatUserKeys = () => {
    return spread(treeData, []);
  };
  const flatUserKeys = useMemo(setFlatUserKeys, [treeData]);

  // ANCHOR effect
  useEffect(() => {
    const initiate = async () => {
      // * selectedKeys 배열로 유저 정보를 가져옴.
      const {
        data: {
          items: { node_item: userSchemaMaybeArr },
        },
      } = await getUserInfos(selectedKeys);
      // *  사용자 상세 정보가 하나일 경우를 가정하여 배열로 감쌈.
      const userSchema = arrayLike(userSchemaMaybeArr);
      // * 가져온 정보를 가공. 이 때 selectedKeys 유저가 Favorite 유저와 중복됟 시 중복 표기 해 줌.
      const result = userSchema.map((v: any) => ({
        title: v.user_name.value,
        key: v.user_id.value,
        gubun: v.gubun.value,
        duplicated: flatUserKeys.indexOf(v.user_id.value) > -1 ? true : false,
        ...(v && convertToUser(v)),
      }));
      // * 모든 유저가 이미 즐겨찾기에 존재하면 페이즈 2 (중복 추가 불가 안내페이지)로 이동
      if (!result.find((v: any) => v.duplicated === false)) {
        setPhaze(2);
      } else {
        await delay();
        setSelectedUserInfos(result);
        setPhaze(1);
      }
    };
    initiate();
  }, []);

  // ANCHOR handler
  const handleSelect = async (_: any, e: any) => {
    const {
      node: { key: newSelectedKey },
    } = e;
    setSelectedKey(newSelectedKey);
  };

  const handleAddToFavorite = async () => {
    // * 부서 미선택 시 진행 불가
    if (!selectedKey) return false;
    // * 페이즈 0(로딩 )으로 세팅 후 1초 딜레이.
    setPhaze(0);
    await delay();
    // * 현재 트리에서 선택한 부서와 부서의 자식 배열을 찾음.
    const replica = [...treeData];
    const { v: parent, children } = await findChildren(
      replica,
      selectedKey?.toString()
    );

    // * selectedUserKeys 유저 배열에서 중복 데이터 제거 후 선택 부서 key를 넣어줌
    const result = selectedUserInfos
      .filter((v: any) => !v.duplicated)
      .map((v: any) => ({
        ...v,
        pid: parent.key,
      }));

    // * replica를 변경.
    children.unshift(...result);
    setTreeData(replica);
    // * 페이즈 3 (완료 페이지)로 이동.
    setPhaze(3);
    setSelectedKeys([]);
  };

  // ANCHOR etc
  const findChildren = (
    list: TTreeNode[],
    key: string
  ): Promise<{ v: any; children: any }> =>
    new Promise((resolve) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key === key) {
          resolve({ v: list[i], children: list[i].children! });
        }
        if (list[i].children) {
          findChildren(list[i].children!, key).then((result) => {
            if (result) resolve(result);
          });
        }
      }
    });

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
              <h4 className="page-title">다음의 멤버들이 추가됩니다.</h4>
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
          <h4 className="page-title">
            즐겨찾기에 중복하여 추가할 수 없습니다.
          </h4>
          <div>
            <div className="btn-solid-s" onClick={closeModalFunction}>
              완료
            </div>
          </div>
        </Information>
      ) : phaze === 3 ? (
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
