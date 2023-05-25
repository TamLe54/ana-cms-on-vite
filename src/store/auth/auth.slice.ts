import { SerializedError, createSlice } from '@reduxjs/toolkit';
import User from '../../models/User.model';
import { signInAction, signOutAction } from './auth.thunk';
import {
  isFulfilledAction,
  isPendingAction,
  isRejectAction,
} from '../common.matcher';

interface AuthState {
  isLoading: boolean;
  accessToken?: string;
  accountLogged?: User;
  errorMessage?: string;
  isRememberAccount: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  accessToken: undefined,
  accountLogged: undefined,
  errorMessage: undefined,
  isRememberAccount: true,
};

const authSliceName = '@Auth';

const authSlice = createSlice({
  name: authSliceName,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(signOutAction.fulfilled, () => {
        //Nếu đăng xuất thành công, trả state về state khởi tạo
        return initialState;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        //Nếu đắng nhập thành công, Lưu lại access token và người dùng
        state.accessToken = action.payload.accessToken;
        state.accountLogged = action.payload.user;
      })
      .addMatcher(
        action => isPendingAction(action, authSliceName), //action đưa vào là action đang pending
        state => {
          //khi đó chỉnh sửa isloading thành true và clear errorMessage
          state.isLoading = true;
          state.errorMessage = undefined;
        },
      )
      .addMatcher(
        action => isFulfilledAction(action, authSliceName), //action đưa vào là action đã hoàn tất
        state => {
          state.isLoading = false; //chỉnh sửa isloading thành false
        },
      )
      .addMatcher(
        action => isRejectAction(action, authSliceName), //action đưa vào là action bị rejected
        (state, action) => {
          //isloading sẽ là false và cập nhật errorMessage
          state.isLoading = false;
          state.errorMessage = `Error: ${
            (action.error as SerializedError)?.message
          }`;
        },
      );
  },
});

export default authSlice.reducer;
