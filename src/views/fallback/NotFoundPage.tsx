import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

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
    <div className="dy-sec-shell-fallback">
      <div className="dy-sec-shell-fallback__content">
        <div className="dy-sec-shell-fallback__title">页面不存在</div>
        <div className="dy-sec-shell-fallback__message">日志检索微应用中不存在该页面：{location.pathname}</div>
        <div className="dy-sec-shell-fallback__action">
          <Button type="primary" onClick={handleBackHome}>
            返回日志检索
          </Button>
        </div>
      </div>
    </div>
  );
}
