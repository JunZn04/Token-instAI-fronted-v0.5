import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../AuthRoute/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../Login/Login";
import Project from "../../Nevigation/ProjectPage/Project";

const Routes = () => {
  const { token } = useAuth();

  // 公共路由配置
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];

  // 授权的用户才可以访问的路由配置
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <div>User Home Page</div>,
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <Project/>,
        },
      ],
    },
  ];

  // 没有授权的用户才可以访问的路由配置
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Login/>,
    },
    {
      path: "/login",
      element: <Login/>,
    },
  ];

  // 合并路由配置
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
