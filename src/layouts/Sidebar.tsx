import routes from '../routes';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/icons/logo-ana-mini.svg';
import './Sidebar.styles.scss';
import Home from '../assets/images/icons/home.svg';
import Music from '../assets/images/icons/music.svg';
import LogOutButton from '../components/LogOutButton';
import { VERSION_NUMBER } from '../utils/version.util';

const { Sider } = Layout;

interface MenuItem {
  title: string;
  path?: string;
  MenuIcon?: React.ReactNode;
  children?: MenuItem[];
  key: string;
}

const menuItems: MenuItem[] = [
  {
    ...routes.Affirmation,
    MenuIcon: (
      <img src={Home} className='w-[20%] h-auto pr-1' alt='affirmations' />
    ),
    key: routes.Affirmation.path,
  },
  {
    ...routes.DailyVibe,
    MenuIcon: (
      <img src={Music} className='w-[20%] h-auto pr-1' alt='daily vibes' />
    ),
    key: routes.DailyVibe.path,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [currentItem, setCurrentItem] = useState(location.pathname); //get the path of the current location

  useEffect(() => {
    if (location) {
      setCurrentItem(
        menuItems.filter(item => location.pathname.includes(item.path || ''))[0]
          .path || '',
      );
    }
  }, [location]);

  return (
    <Sider width={'18%'} className='bg-primary '>
      <div className='flex flex-col h-full bg-primary'>
        <div className='flex justify-center p-12'>
          <img src={logo} alt='' className='login-logo' />
        </div>
        <div className='flex flex-col justify-between h-full w-full'>
          <Menu
            mode='vertical'
            selectedKeys={[currentItem]}
            className='flex flex-col gap-2 items-center'
            style={{
              backgroundColor: '#4D4479',
              borderRight: 0,
            }}
          >
            {menuItems.map(({ MenuIcon, title, path, key }) => (
              <Menu.Item
                disabled
                key={key}
                icon={MenuIcon}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: '50%',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  fontSize: '150%',
                }}
              >
                <Link to={path ?? '/'}>
                  <span className='text-white '>{title}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>

          <div className='flex flex-col justify-center'>
            <p className='flex text-white justify-center text-[20px] font-bold'>
              Admin
            </p>

            <LogOutButton />

            <p className='ml-[20px] text-white'>Version: {VERSION_NUMBER}</p>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
