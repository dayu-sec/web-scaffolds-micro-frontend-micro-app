import { Navigate } from 'react-router-dom';

/**
 * 微应用入口默认进入日志检索工作台，主应用菜单和直接访问根路径都能落到同一业务起点。
 */
export default function LogQueryEntryPage() {
  return <Navigate replace to="/search" />;
}
