import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  currentBreadcrumbs: string[];
}

const initialState: CommonState = {
  currentBreadcrumbs: [],
};

const commonSliceName = "@Auth";

const commonSlice = createSlice({
  name: commonSliceName,
  initialState,
  reducers: {
    updateBreadcrumbs: (state, { payload }: PayloadAction<string[]>) => {
      state.currentBreadcrumbs = payload;
    },
  },
});

export const { updateBreadcrumbs } = commonSlice.actions;

export default commonSlice.reducer;
