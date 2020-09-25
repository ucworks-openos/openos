import React, { useMemo } from "react";
import styled from "styled-components";

type TaddToFavoriteTreeNodeProps = {
  data: TTreeNode;
  selectedKey: string | number;
};

type TdepartmentProps = {
  selected: boolean;
};

export default function AddToFavoriteTreeNode(
  props: TaddToFavoriteTreeNodeProps
) {
  const { data, selectedKey } = props;
  const setSelected = () => {
    const selected = selectedKey === data?.key;
    return selected;
  };

  const selected = useMemo(setSelected, [selectedKey]);

  return <Department selected={selected}>{data?.title}</Department>;
}

const Department = styled.h6<TdepartmentProps>`
  background-color: #fff;
  padding: 4px 8px 4px 0;
  width: 100%;
  color: ${(props: TdepartmentProps) => props.selected && `#1454e3`};

  /* border-bottom과 font-size는 변경하지 말 것. switcher icon크기에 맞게끔 조정 되어 있음. */
  font-size: 14px;
  cursor: pointer;
`;
