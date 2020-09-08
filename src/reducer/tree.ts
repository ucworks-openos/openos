type TTreeState = {
    treeData: TTreeNode[]
    expandedKeys: string[],
    autoExpandParent: boolean,
}

const initialState: TTreeState = {
    treeData: [],
    expandedKeys: [],
    autoExpandParent: false,
}

export const SET_TREE_DATA = `tree/SET_TREE_DATA` as const;
export const SET_EXPANDED_KEYS = `tree/SET_EXPANDED_KEYS` as const;
export const TOGGLE_AUTO_EXPAND_PARENT = `tree/SET_AUTO_EXPAND_PARENT` as const;

export const setTreeData = (treeData: TTreeNode[]) => ({ type: SET_TREE_DATA, payload: treeData });
export const setExpandedKeys = (keys: (string | number)[]) => ({ type: SET_EXPANDED_KEYS, payload: keys });
export const toggleAutoExpandParent = () => ({ type: TOGGLE_AUTO_EXPAND_PARENT });

type TreeAction =
    | ReturnType<typeof setTreeData>
    | ReturnType<typeof setExpandedKeys>
    | ReturnType<typeof toggleAutoExpandParent>

export default function tree(state: TTreeState = initialState, action: TreeAction) {
    switch (action.type) {
        case SET_TREE_DATA:
            return { ...state, treeData: action.payload }
        case SET_EXPANDED_KEYS:
            return { ...state, expandedKeys: action.payload }
        case TOGGLE_AUTO_EXPAND_PARENT:
            return { ...state, autoExpandParent: !state.autoExpandParent }
        default: return initialState;
    }
}
