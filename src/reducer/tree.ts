const initialState: TOrganizationState & TFavoriteState = {
  organizationTreeData: [],
  organizationExpandedKeys: [],
  favoriteTreeData: [],
  favoriteExpandedKeys: [],
};

export const SET_ORGANIZATION_TREE_DATA = `tree/SET_ORGANIZATION_TREE_DATA` as const;
export const SET_ORGANIZATION_EXPANDED_KEYS = `tree/SET_ORGANIZATION_EXPANDED_KEYS` as const;

export const SET_FAVORITE_TREE_DATA = `tree/SET_FAVORITE_TREE_DATA` as const;
export const SET_FAVORITE_EXPANDED_KEYS = `tree/SET_FAVORITE_EXPANDED_KEYS` as const;

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

type TreeAction =
  | ReturnType<typeof setTreeData>
  | ReturnType<typeof setExpandedKeys>;

export default function tree(
  state: TOrganizationState & TFavoriteState = initialState,
  action: TreeAction
) {
  switch (action.type) {
    case SET_ORGANIZATION_TREE_DATA:
      return { ...state, organizationTreeData: action.payload };
    case SET_ORGANIZATION_EXPANDED_KEYS:
      return { ...state, organizationExpandedKeys: action.payload };
    case SET_FAVORITE_TREE_DATA:
      return { ...state, favoriteTreeData: action.payload };
    case SET_FAVORITE_EXPANDED_KEYS:
      return { ...state, favoriteExpandedKeys: action.payload };
    default:
      return initialState;
  }
}
