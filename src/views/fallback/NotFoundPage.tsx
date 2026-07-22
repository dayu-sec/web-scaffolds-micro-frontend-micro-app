import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

/**
 * 展示日志检索微应用内部未匹配子路由，并提供返回检索入口的动作。
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 回到日志检索工作台，不跳出当前微应用路径前缀。
   */
  function handleBackHome() {
    void navigate('/search');
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle={`日志检索微应用中不存在该页面：${location.pathname}`}
      extra={
        <Button type="primary" onClick={handleBackHome}>
          返回日志检索
        </Button>
      }
    />
  );
}
