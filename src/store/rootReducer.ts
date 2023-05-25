import { combineReducers } from 'redux'; //Hàm này dùng để kết hợp các Reducer con thành một reducer
import { persistReducer } from 'redux-persist'; //Hàm để tạo một reducer có tình năng lưu trữ dữ liệu sử dụng redux persist
import storage from 'redux-persist/lib/storage'; //Đối tượng lưu trữ từ Reduxpersist
import authReducer from './auth/auth.slice';
import commonReducer from './common/common.slice';

const appReducer = combineReducers({
  //Kết hợp
  auth: authReducer,
  common: commonReducer,
});

const persistConfig = {
  //Cấu hình đối tượng persist lưu trữ, ở đây ta chỉ cần lưu trữ authReducer
  key: 'ana-admin', //Từ khoá
  storage, //Lưu vào đâu? Lưu vào "redux-persist/lib/storage"!
  whitelist: ['auth'], //Chỉ lưu authReducer mà thôi
};

const rootReducer = (state: any, action: any) => {
  //Hàm reducer chính làm trung gian để gọi appReducer
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>; //Xuất ra kiểu dữ liệu của root Reducer để con sử dụng

export default persistReducer(persistConfig, rootReducer); //Tạo reducer có tính năng lưu trữ dữ liệu, nội dung lấy từ rootReducer và cấu hình lấy từ persistConfig
