const initialState: TOrganizationSearchState & TFavoriteSearchState = {
  organizationSearchMode: false,
  organizationSearchKeyword: ``,
  organizationSearchResult: [],
  favoriteSearchMode: false,
  favoriteSearchKeyword: ``,
  favoriteSearchResult: [],
};

export const SET_ORGANIZATION_SEARCH_MODE = `tree/SET_ORGANIZATION_SEARCH_MODE` as const;
export const SET_ORGANIZATION_SEARCH_KEYWORD = `tree/SET_ORGANIZATION_SEARCH_KEYWORD` as const;
export const SET_ORGANIZATION_SEARCH_RESULT = `tree/SET_ORGANIZATION_SEARCH_RESULT` as const;

export const SET_FAVORITE_SEARCH_MODE = `tree/SET_FAVORITE_SEARCH_MODE` as const;
export const SET_FAVORITE_SEARCH_KEYWORD = `tree/SET_FAVORITE_SEARCH_KEYWORD` as const;
export const SET_FAVORITE_SEARCH_RESULT = `tree/SET_FAVORITE_SEARCH_RESULT` as const;

export const setSearchMode = (boolean: boolean, type: string) => ({
  type:
    type === `organization`
      ? SET_ORGANIZATION_SEARCH_MODE
      : SET_FAVORITE_SEARCH_MODE,
  payload: boolean,
});

export const setSearchKeyword = (keyword: string, type: string) => ({
  type:
    type === `organization`
      ? SET_ORGANIZATION_SEARCH_KEYWORD
      : SET_FAVORITE_SEARCH_KEYWORD,
  payload: keyword,
});

export const setSearchResult = (result: TTreeNode[], type: string) => ({
  type:
    type === `organization`
      ? SET_ORGANIZATION_SEARCH_RESULT
      : SET_FAVORITE_SEARCH_RESULT,
  payload: result,
});

type TSearchAction =
  | ReturnType<typeof setSearchMode>
  | ReturnType<typeof setSearchKeyword>
  | ReturnType<typeof setSearchResult>;

export default function tree(
  state: TOrganizationSearchState & TFavoriteSearchState = initialState,
  action: TSearchAction
) {
  switch (action.type) {
    case SET_ORGANIZATION_SEARCH_MODE:
      return { ...state, organizationSearchMode: action.payload };
    case SET_ORGANIZATION_SEARCH_KEYWORD:
      return { ...state, organizationSearchKeyword: action.payload };
    case SET_ORGANIZATION_SEARCH_RESULT:
      return { ...state, organizationSearchResult: action.payload };
    case SET_FAVORITE_SEARCH_MODE:
      return { ...state, favoriteSearchMode: action.payload };
    case SET_FAVORITE_SEARCH_KEYWORD:
      return { ...state, favoriteSearchKeyword: action.payload };
    case SET_FAVORITE_SEARCH_RESULT:
      return { ...state, favoriteSearchResult: action.payload };
    default:
      return { ...state };
  }
}
