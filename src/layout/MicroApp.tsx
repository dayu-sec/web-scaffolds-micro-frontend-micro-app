import { Outlet } from 'react-router';

/**
 * 渲染微应用内部页面出口，业务页面由子路由自行承载。
 */
export default function LayoutMicroApp() {
  return <Outlet />;
}
