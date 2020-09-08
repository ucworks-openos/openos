import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../reducer';
import { setTreeData as RsetTreeData, setExpandedKeys as RsetExpandedKeys, toggleAutoExpandParent as RtoggleAutoExpandParent } from '../reducer/tree'

type TuseTree = {
    treeData: TTreeNode[];
    expandedKeys: (string | number)[];
    autoExpandParent: boolean;
    setTreeData: (treeData: TTreeNode[]) => void;
    setExpandedKeys: (expandedKeys: (string | number)[]) => void;
    toggleAutoExpandParent: () => void;
}

export default function useTree(): TuseTree {
    const { treeData, expandedKeys, autoExpandParent } = useSelector((state: RootState) => state.tree)
    const dispatch = useDispatch();

    const setTreeData = useCallback((treeData: TTreeNode[]) => dispatch(RsetTreeData(treeData)), [dispatch]);
    const setExpandedKeys = useCallback((expandedKeys: (string | number)[]) => dispatch(RsetExpandedKeys(expandedKeys)), [dispatch]);
    const toggleAutoExpandParent = useCallback(() => dispatch(RtoggleAutoExpandParent()), [dispatch])

    return { treeData, expandedKeys, autoExpandParent, setTreeData, setExpandedKeys, toggleAutoExpandParent };
}
