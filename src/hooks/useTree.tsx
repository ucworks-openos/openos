import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import {
  setTreeData as RsetTreeData,
  setExpandedKeys as RsetExpandedKeys,
  toggleAutoExpandParent as RtoggleAutoExpandParent,
} from "../reducer/tree";

type TuseTreeReturnTypes = {
  treeData: TTreeNode[];
  expandedKeys: (string | number)[];
  autoExpandParent: boolean;
  setTreeData: (treeData: TTreeNode[]) => void;
  setExpandedKeys: (expandedKeys: (string | number)[]) => void;
  toggleAutoExpandParent: () => void;
};

type TuseTreeProps = {
  type: `organization` | `favorite`;
};

export default function useTree(props: TuseTreeProps): TuseTreeReturnTypes {
  const { type } = props;
  const states: TOrganizationState & TFavoriteState = useSelector(
    (state: RootState) => state.tree
  );
  const dispatch = useDispatch();

  const setTreeData = useCallback(
    (treeData: TTreeNode[]) => dispatch(RsetTreeData(treeData, type)),
    [dispatch]
  );
  const setExpandedKeys = useCallback(
    (expandedKeys: (string | number)[]) =>
      dispatch(RsetExpandedKeys(expandedKeys, type)),
    [dispatch]
  );
  const toggleAutoExpandParent = useCallback(
    () => dispatch(RtoggleAutoExpandParent(type)),
    [dispatch]
  );

  return {
    treeData:
      type === `organization`
        ? states.organizationTreeData
        : states.favoriteTreeData,
    expandedKeys:
      type === `organization`
        ? states.organizationExpandedKeys
        : states.favoriteExpandedKeys,
    autoExpandParent:
      type === `organization`
        ? states.organizationAutoExpandParent
        : states.favoriteAutoExpandParent,
    setTreeData,
    setExpandedKeys,
    toggleAutoExpandParent,
  };
}
