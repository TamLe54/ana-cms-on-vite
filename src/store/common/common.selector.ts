import { createSelector } from "reselect";
import { RootState } from "../rootReducer";

const selectCommon = (state: RootState) => state.common;

export const selectCurrentBreadcrumbs = createSelector(
  [selectCommon],
  (common) => common.currentBreadcrumbs
);
