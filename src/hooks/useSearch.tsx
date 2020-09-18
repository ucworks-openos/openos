import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import {
  setSearchKeyword as RsetSearchKeyword,
  setSearchResult as RsetSearchResult,
  setSearchMode as RsetSearchMode,
} from "../reducer/search";

type TuseSearchReturnTypes = {
  searchMode: boolean;
  searchKeyword: string;
  searchResult: TTreeNode[];
  setSearchMode: (boolean: boolean) => void;
  setSearchKeyword: (keyword: string) => void;
  setSearchResult: (result: TTreeNode[]) => void;
};

type TuseSearchProps = {
  type: `organization` | `favorite`;
};

export default function useSearch(
  props: TuseSearchProps
): TuseSearchReturnTypes {
  const { type } = props;
  const states: TOrganizationSearchState & TFavoriteSearchState = useSelector(
    (state: RootState) => state.search
  );
  const dispatch = useDispatch();

  const setSearchMode = useCallback(
    (boolean: boolean) => dispatch(RsetSearchMode(boolean, type)),
    [dispatch]
  );

  const setSearchKeyword = useCallback(
    (keyword: string) => dispatch(RsetSearchKeyword(keyword, type)),
    [dispatch]
  );
  const setSearchResult = useCallback(
    (result: TTreeNode[]) => dispatch(RsetSearchResult(result, type)),
    [dispatch]
  );

  return {
    searchMode:
      type === `organization`
        ? states.organizationSearchMode
        : states.favoriteSearchMode,
    searchKeyword:
      type === `organization`
        ? states.organizationSearchKeyword
        : states.favoriteSearchKeyword,
    searchResult:
      type === `organization`
        ? states.organizationSearchResult
        : states.favoriteSearchResult,
    setSearchMode,
    setSearchKeyword,
    setSearchResult,
  };
}
