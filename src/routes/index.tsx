import { createBrowserRouter, type DOMRouterOpts } from 'react-router';
import LayoutMicroApp from '@/layout/MicroApp';
import NotFoundPage from '@/views/fallback/NotFoundPage';
import routes from '~react-pages';

/**
 * 创建微应用内部路由，所有页面都收敛在自身 basename 下。
 */
export const createRouter = (options: DOMRouterOpts) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: <LayoutMicroApp />,
        children: [...routes, { path: '*', element: <NotFoundPage /> }],
      },
    ],
    options
  );

export default createRouter;
