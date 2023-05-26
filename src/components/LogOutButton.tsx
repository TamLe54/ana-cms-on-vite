import { ExclamationCircleOutlined } from '@ant-design/icons';
import accountApi from '../apis/account.api';
import { Modal } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogOutButton: React.FC = () => {
  const navigate = useNavigate();
  const { confirm } = Modal;
  const icon = <ExclamationCircleOutlined style={{ color: '#D01616' }} />;
  const title = <h3 className='font-bold text-primary'>Log out?</h3>;
  const content = (
    <h4 className='text-black text-base font-normal'>
      Are you sure you want to log out?
    </h4>
  );
  const onOk = async () => {
    try {
      await accountApi.logout();
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      navigate('/login');
    }
  };
  const onCancel = () => {
    return;
  };
  const bodyStyle = {
    background: 'white',
    borderRadius: 10,
  };
  const okButtonProps = {
    style: {
      borderRadius: 4,
      width: 90,
      height: 40,
      backgroundColor: '#4D4479',
      transition: 'filter 0.3s',
      fontFamily: "'WorkSans', sans-serif",
    },
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.currentTarget.style.filter = 'brightness(150%)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.currentTarget.style.filter = 'none';
    },
  };
  const cancelButtonProps = {
    style: {
      fontFamily: "'WorkSans', sans-serif",
      borderRadius: 4,
      width: 90,
      height: 40,
      backgroundColor: '#F5F5F5',
      color: '#4D4479',
    },
  };

  const handleLogOut = () => {
    confirm({
      className: 'log-out',
      icon: icon,
      maskClosable: true,
      centered: true,
      width: 502,
      okText: 'Yes',
      cancelText: 'No',
      autoFocusButton: null,
      title: title,
      content: content,
      onOk: onOk,
      onCancel: onCancel,
      bodyStyle: bodyStyle,
      okButtonProps: okButtonProps,
      cancelButtonProps: cancelButtonProps,
    });
  };

  return (
    <>
      <button
        className={`flex bg-white w-[80%] h-fit p-3 
        rounded-lg m-auto justify-center items-center text-primary font-bold
        text-[16px] mb-[20px] border-none
        hover:bg-[#3e3861] hover:text-white hover:cursor-pointer duration-[300ms]`}
        onClick={handleLogOut}
      >
        Log Out
      </button>
    </>
  );
};

export default LogOutButton;
