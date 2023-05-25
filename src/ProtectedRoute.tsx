import { Auth } from "aws-amplify";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PageContainer from "./layouts/PageContainer";
import { useCallback } from "react";

const ProtectedRoute = (props: any) => {
  const navigate = useNavigate();

  const checkUserToken = useCallback(async () => {
    try {
      const userToken = await Auth.currentSession();
      if (!userToken) {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    checkUserToken();
  }, [checkUserToken]);
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};
export default ProtectedRoute;
