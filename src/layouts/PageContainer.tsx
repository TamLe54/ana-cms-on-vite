import { Layout, Space } from 'antd';
import { ReactChild } from 'react';
import Sidebar from './Sidebar';

import './PageContainer.styles.scss';
const { Content } = Layout;

type Props = {
  children: ReactChild;
};

const PageContainer = ({ children }: Props) => {
  return (
    <Space>
      <Layout>
        <Sidebar />
        <Layout>
          <Content className='bg-white rounded-[20px] m-[20px] p-[40px] h-full overflow-scroll overflow-x-hidden overflow-y-auto'>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Space>
  );
};

export default PageContainer;
