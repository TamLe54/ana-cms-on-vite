import accountApi from '../../apis/account.api';
import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import logo from '../../assets/images/icons/logo-ana.svg';
import AccountLogin from '../../models/AccountLogin.model';
import alertUtil from '../../utils/alert.util';
import './Login.styles.scss';
import routes from '../../routes';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const LoginPage = () => {
  const [disabled, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const currentSession = async () => {
    const isAuth = await Auth.currentSession();
    if (isAuth && isAuth !== undefined) {
      navigate('/');
    }
  };
  useEffect(() => {
    currentSession();
  }, [navigate]);

  const onLogin = async (values: AccountLogin) => {
    try {
      setDisable(true);
      setIsLoading(true);
      await accountApi.login(values);
      navigate(routes.Affirmation.path);
    } catch (error: any) {
      setDisable(false);
      setIsLoading(false);
      alertUtil.error('Login Fail', error.message);
    }
  };
  return (
    <div id='login-form-container'>
      <img src={logo} alt='logo' className='login-logo' />
      <Form
        name='normal_login'
        className='login-form bg-white'
        onFinish={onLogin}
      >
        <div className='login-form-header'>
          <div className='font-bold text-primary text-2xl mb-4 custom-login-text'>
            Login
          </div>
          <div>
            <p className='font-semibold' style={{ fontSize: 16 }}>
              Welcome back. Input your details to pickup where you left off.
            </p>
          </div>
        </div>
        <div className='login-form-body'>
          <Form.Item
            name='email'
            rules={[
              {
                required: true,
                message: 'The input is not valid E-mail',
                type: 'email',
              },
            ]}
          >
            <Input placeholder='Email' className='custom-input' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password
              placeholder='Password'
              className='custom-input h-[56px]'
            />
          </Form.Item>
        </div>
        <Form.Item>
          {!isLoading ? (
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button bg-primary custom-btn-login border-none'
            >
              Login
            </Button>
          ) : (
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button bg-primary custom-btn-login'
              disabled={disabled}
              loading={isLoading}
            >
              Logging in
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
