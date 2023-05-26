import './App.scss';
import 'antd/dist/reset.css';

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import NoMatch from './components/NoMatch';
import DailyVibe from './pages/daily-vibe/DailyVibe.page';
import ProtectedRoute from './ProtectedRoute';
import './https/interceptors.http';
import AffirmationPage from './pages/affirmation/Affirmation.page';
import LoginPage from './pages/auth/Login.page';
import routes from './routes';
import Playground from './pages/playground/Playground';


const router = createBrowserRouter([
  {
    path: routes.SignIn.path,
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: (
      <NoMatch
        className='flex flex-col items-center w-screen h-screen justify-center space-y-5'
        title="It looks like you're lost..."
        description='Go to the home page'
      />
    ),
    children: [
  {
        path: routes.Affirmation.path,
        element: <AffirmationPage />,
      },
      {
        index: true,
        element: <Navigate to={routes.Affirmation.path} />,
      },
      {
        path: routes.DailyVibe.path,
        element: <DailyVibe />,
      },
      {
        path: "/playground",
        element: <Playground/>
      }
     
    ],
  },
]);

const App = () => {
  //console.log(unfonts);
  return <RouterProvider router={router} />;
};

export default App;
