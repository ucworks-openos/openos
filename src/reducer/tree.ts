import { Egubun } from "../common/enum";

const initialState: TOrganizationState & TFavoriteState = {
  organizationTreeData: [],
  organizationExpandedKeys: [],
  selectedOrganizationNode: { title: ``, key: ``, gubun: Egubun.GROUP },
  favoriteTreeData: [],
  favoriteExpandedKeys: [],
  selectedFavoriteNode: { title: ``, key: ``, gubun: Egubun.GROUP },
};

export const SET_ORGANIZATION_TREE_DATA = `tree/SET_ORGANIZATION_TREE_DATA` as const;
export const SET_ORGANIZATION_EXPANDED_KEYS = `tree/SET_ORGANIZATION_EXPANDED_KEYS` as const;
export const SET_SELECTED_ORGANIZATION_NODE = `tree/SET_SELECTED_ORGANIZATION_NODE` as const;

export const SET_FAVORITE_TREE_DATA = `tree/SET_FAVORITE_TREE_DATA` as const;
export const SET_FAVORITE_EXPANDED_KEYS = `tree/SET_FAVORITE_EXPANDED_KEYS` as const;
export const SET_SELECTED_FAVORITE_NODE = `tree/SET_SELECTED_FAVORITE_NODE` as const;

export const setTreeData = (treeData: TTreeNode[], type: string) => ({
  type:
    type === `organization`
      ? SET_ORGANIZATION_TREE_DATA
      : SET_FAVORITE_TREE_DATA,
  payload: treeData,
});

export const setExpandedKeys = (keys: (string | number)[], type: string) => ({
  type:
    type === `organization`
      ? SET_ORGANIZATION_EXPANDED_KEYS
      : SET_FAVORITE_EXPANDED_KEYS,
  payload: keys,
});

export const setSelectedNode = (node: TTreeNode, type: string) => ({
  type:
    type === `organization`
      ? SET_SELECTED_ORGANIZATION_NODE
      : SET_SELECTED_FAVORITE_NODE,
  payload: node,
});

type TTreeAction =
  | ReturnType<typeof setTreeData>
  | ReturnType<typeof setExpandedKeys>
  | ReturnType<typeof setSelectedNode>;

export default function tree(
  state: TOrganizationState & TFavoriteState = initialState,
  action: TTreeAction
) {
  switch (action.type) {
    case SET_ORGANIZATION_TREE_DATA:
      return { ...state, organizationTreeData: action.payload };
    case SET_ORGANIZATION_EXPANDED_KEYS:
      return { ...state, organizationExpandedKeys: action.payload };
    case SET_SELECTED_ORGANIZATION_NODE:
      return { ...state, selectedOrganizationNode: action.payload };
    case SET_FAVORITE_TREE_DATA:
      return { ...state, favoriteTreeData: action.payload };
    case SET_FAVORITE_EXPANDED_KEYS:
      return { ...state, favoriteExpandedKeys: action.payload };
    case SET_SELECTED_FAVORITE_NODE:
      return { ...state, selectedFavoriteNode: action.payload };
    default:
      return { ...state };
  }
}
