import React, { useEffect, useState } from "react";
import "../../../assets/css/Modal.css";
import { EnodeGubun } from "../../../enum";
import useTree from "../../../hooks/useTree";
import moment from "moment";

type TaddGroupModal = {
  closeModalFunction: () => void;
  rightClickedKey: string | number;
};

export default function AddGroupModal(props: TaddGroupModal) {
  const { closeModalFunction, rightClickedKey } = props;
  const [inputValue, setInputValue] = useState("");
  const { treeData, setTreeData, expandedKeys, setExpandedKeys } = useTree({
    type: `favorite`,
  });

  const onCloseModalClick = () => {
    closeModalFunction();
  };

  const onAddGroupClick = async () => {
    const replica = [...treeData];
    const { v: targetV, i: targetI, list: targetList } = await find(
      replica,
      rightClickedKey.toString()
    );
    const newGroup = {
      children: [],
      gubun: EnodeGubun.GROUP,
      key: `GROUP_1_${moment().format(`YYYYMMDDHHmmssSSS`)}`,
      pid: targetV.key,
      title: inputValue,
    };

    Object.assign(targetV, {
      ...targetV,
      children: [...targetV.children, newGroup],
    });

    setTreeData(replica);
    setExpandedKeys([...expandedKeys, newGroup.key]);
    closeModalFunction();
  };

  const onInputChange = (e: any) => {
    setInputValue(e.currentTarget.value);
  };

  const find = (
    list: TTreeNode[],
    key: string
  ): Promise<{ v: TTreeNode; i: number; list: TTreeNode[] }> =>
    new Promise((resolve) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key === key) {
          resolve({ v: list[i], i: i, list: list });
        }
        if (list[i].children) {
          find(list[i].children!, key).then((result) => {
            if (result) resolve(result);
          });
        }
      }
    });

  return (
    <div>
      <h5>즐겨찾기 그룹 추가</h5>
      <input
        value={inputValue}
        onChange={onInputChange}
        className="get-favorite-group-name"
        placeholder="추가할 그룹의 이름을 입력해주세요"
      />
      <div className="modal-btn-wrap">
        <div className="btn-ghost-s cancel" onClick={onCloseModalClick}>
          취소하기
        </div>
        <div className="btn-solid-s submit" onClick={onAddGroupClick}>
          그룹추가
        </div>
      </div>
    </div>
  );
}
