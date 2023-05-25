import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';

const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthLoading = createSelector(
  [selectAuth],
  auth => auth.isLoading,
);

export const selectUserLogged = createSelector(
  [selectAuth],
  auth => auth.accountLogged,
);

export const selectAccessToken = createSelector(
  [selectAuth],
  auth => auth.accessToken,
);

export const selectAuthErrorMessage = createSelector(
  [selectAuth],
  auth => auth.errorMessage,
);
