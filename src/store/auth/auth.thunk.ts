import { createAsyncThunk } from '@reduxjs/toolkit';
import AccountLogin from '../../models/AccountLogin.model';
import accountApi from '../../apis/account.api';

enum AuthTypesEnum {
  SignInAsync = '@Auth/signInAsync',
  SignOutAsync = '@Auth/signOutAsync',
}

export const signInAction = createAsyncThunk(
  AuthTypesEnum.SignInAsync,
  async (params: AccountLogin) => {
    const response = await accountApi.login(params);
    return response.data.data;
  },
);

export const signOutAction = createAsyncThunk(
  AuthTypesEnum.SignOutAsync,
  async () => {
    await accountApi.logout();
  },
);
