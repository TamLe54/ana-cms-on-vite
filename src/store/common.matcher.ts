import { AsyncThunk } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk['pending']>; //Kiểu dữ liệu một action ở trạng thái "pending"
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>; //Kiểu dữ liệu một action ở trạng thái "rejected"
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>; //Kiểu dữ liệu một action ở trạng thái "fulfilled"

//Định nghĩa các hàm type predicate

export const isPendingAction = (
  //Hàm kiểm tra một action có phải đang xử lý hay không
  action: AnyAction,
  reducerType: string, //Tên của slice chứa reducer
): action is PendingAction => {
  //Hàm này có kiểu dữ liệu trả về là Boolean nhưng nó sẽ chỉ xét những action thuộc kiểu PendingAction
  return (
    action.type.startsWith(reducerType + '/') &&
    action.type.endsWith('/pending')
  );
};

//Tương tự với hàm kiểm tra action rejected và fullfiled
export const isRejectAction = (
  action: AnyAction,
  reducerType: string,
): action is RejectedAction => {
  return (
    action.type.startsWith(reducerType + '/') &&
    action.type.endsWith('/rejected')
    // && action.error.message !== "401"
  );
};

export const isFulfilledAction = (
  action: AnyAction,
  reducerType: string,
): action is FulfilledAction => {
  return (
    action.type.startsWith(reducerType + '/') &&
    action.type.endsWith('/fulfilled')
  );
};
