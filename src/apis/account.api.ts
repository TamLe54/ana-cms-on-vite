import AccountLogin from '../models/AccountLogin.model';
import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
  },
});
const accountApi = {
  login: async (request: AccountLogin) => {
    return await Auth.signIn(request.email, request.password);
  },
  logout: async () => {
    return await Auth.signOut();
  },
};

export default accountApi;
