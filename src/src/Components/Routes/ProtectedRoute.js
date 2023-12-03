import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthRoute/AuthProvider";

export const ProtectedRoute = () => {
    const { token } = useAuth();
  
    // 判断用户是否有权限
    if (false) {
      // 如果没有授权，则跳转到登录页面
      return <Navigate to="/login" />;
    }
  
    // 如果已经授权，则直接渲染子组件
    return <Outlet />;
 };
