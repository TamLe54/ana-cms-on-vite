import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'; //Đây là các hằng số của redux-persist giúp quản lý việc lưu trữ và khôi phục trạng thái của ứng dụng

import rootReducer from './rootReducer';

const middleware: any = []; //Tạo mảng middleware sẽ dụng

const store = configureStore({
  reducer: rootReducer,
  middleware: (
    getDefaultMiddleware, //lấy middleware mặc định của redux toolkit để cấu hình lại
  ) =>
    getDefaultMiddleware({
      serializableCheck: {
        //Kiểm tra tính tương thích của các action
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], //Bỏ qua phần kiểm tra tính tương thích của các action trong mảng
      },
    }).concat(middleware), //Kết hợp với middleware đã tạo
});

const persist = persistStore(store); //Tạo đối tượng persist để lưu store đã tạo

export type AppDispatch = typeof store.dispatch; //Xuất ra kiểu dữ liệu của store.dispatch để dùng vì đây là TypeScript
export type RootState = ReturnType<typeof store.getState>; //Xuất ra kiểu dữ liệu của state lưu trong Redux store
export { store, persist }; //Xuát ra store và persist cho toàn bộ ứng dụng
