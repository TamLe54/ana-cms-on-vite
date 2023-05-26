import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'unfonts.css';
import { ConfigProvider } from 'antd';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persist } from './store/index.ts';

const ana_theme = {
  token: {
    primaryColor: '#4D4479',
    fontFamily: "'WorkSans', sans-serif",
  },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persist}>
      <ConfigProvider theme={ana_theme}>
        <App />
      </ConfigProvider>
    </PersistGate>
  </Provider>
);
