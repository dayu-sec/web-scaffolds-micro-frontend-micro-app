# AGENTS.md

本文件只记录当前微应用仓库内的长期工作规则。常规交互响应使用中文，除非用户另有指示。

## 边界

- 当前目标单元是微应用。常规任务只修改本微应用目录内的源码、配置、文档和测试。
- 不修改 `project/`、`container/`、其它微应用、项目菜单、项目配置、版本字段、制品清单、CI 或线上交付模板，除非任务明确要求。
- 不提交真实域名、内网 IP、账号、Token、本地代理、临时证书、客户信息、人员信息或其它敏感配置。
- 不回滚他人变更；遇到非本任务引入的改动时，先读懂并基于现状继续。
- 不执行 Git Commit 操作，除非用户明确要求。

## 技术与运行

- Node.js 使用仓库配置的 LTS 版本，包管理器使用 pnpm。
- 构建/开发：Vite 8、React 19、TypeScript 严格模式。
- UI：Ant Design 6、ProComponents v3 兼容线。
- 路由：`vite-plugin-pages` 约定式路由 + `react-router@7`。
- 微前端运行时：适配 Garfish 生命周期，支持主应用加载、卸载和路由 `basename`。
- 路径别名：`@/* -> src/*`、`#/* -> mock/*`。

## 本地开发

- 单独启动微应用时使用 `pnpm dev`。
- 本地 API 代理配置参考 `.env.development.local.example` 创建 `.env.development.local`。
- `.env.development.local` 只存放本机私有值，不提交真实 API 地址、Token、证书或私有代理配置。
- MFA 集成启动时，项目级入口、主应用和微应用由 MFA VS Code 扩展编排；微应用代码不要硬编码 MFA 端口或远端环境地址。

## 开发脚本

- `pnpm dev`：开发服务。
- `pnpm build`：生产构建，执行 `tsc -b && vite build`。
- `pnpm preview`：本地预览构建产物。
- `pnpm check`：类型检查、ESLint、Prettier 检查。
- `pnpm lint` / `pnpm format`：代码规范与格式化。

## UI 与前端约定

- UI 组件优先使用 Ant Design 基础组件、ProComponents 高级组件和 Ant Design 推荐社区组件。
- ProComponents 默认只推荐使用 `ProTable`、`ProField`、`CheckCard`；新增其它高级组件前先确认收益。
- 样式优先使用 Ant Design Design Token 表达颜色、间距、圆角和组件主题，大多数场景不直接写 CSS。
- 图标从 `lucide-react` 选择；不要使用 `@ant-design/icons`，触碰历史图标代码时应迁移到 `lucide-react`。
- 图表组件使用 `echarts-for-react`；不要在业务页面中直接使用 `echarts` 实例。
- 代码静态预览使用 `shiki`；不要自行拼接高亮 HTML。
- 文件大小展示和格式化使用 `filesize`；不要自己编写单位换算逻辑。
- 富文本编辑优先使用已安装的 wangEditor React 组件；涉及 HTML 展示或回显时配合 `dompurify` 做净化。
- 微应用样式不得污染主应用或其它微应用；不要覆写 `body`、`html`、主应用布局容器等全局选择器。

## 请求与状态

- 请求统一从 `src/services/request.ts` 导入默认 `request` 实例。
- 默认请求配置在 `src/configs/request/index.ts`，默认网关前缀为 `/api/v1`。
- 业务服务直接使用 `request.get('/namespace/resource')`、`request.post(...)` 或 `request({ method, url })`。
- 不要直接使用 `axios` 发起业务请求。
- 禁止使用 `ahooks` 的 `useRequest`。
- 不要再包一层 `getRequest()`、手写 `get/post` 转发方法，或为模板添加请求示例文件。
- 有生成 TypeScript SDK 的微服务，优先向 SDK 提供默认 `request` 或极薄适配器；不要把生成的方法复制进微应用。
- 没有 SDK 的微服务，在微应用服务边界内写正常业务 service 方法，保持路径可读。
- `@seed-fe/batch-request` 只用于真实可批量合并的业务接口，不做模板默认能力。
- `zustand` + `immer` 只在确有微应用内部跨组件状态需求时使用，例如筛选条件、分页、局部 UI 状态或轻量业务上下文；不要把普通接口调用包装成全局 store。
- 请求失败应向调用方或运行时边界传播，不在底层静默吞掉。

## 代码规范

- TypeScript 使用严格模式，避免 `any`，优先用 `unknown`、精确类型或泛型约束。
- 只导出类型时使用 `export type`。
- 函数组件使用 `function` 声明；箭头函数主要用于回调和局部函数。
- React 19 中 `ref` 是标准 prop，不需要为了普通 ref 透传再包 `forwardRef`。
- 合理使用 `React.memo`、`useMemo`、`useCallback`，避免闭包读取过期状态。
- 变量、参数、回调形参使用语义化命名，避免单字母和无法表达含义的缩写。
- 函数参数超过 2 个时，优先改为对象参数，例如 `fn(options)` 或 `fn(input, options)`。
- 新增注释使用中文；只在复杂逻辑、约定原因或非显然实现处添加注释，不写重复代码含义的空注释。
- 默认使用 ASCII；只有文件已有中文内容或确有表达需要时才引入非 ASCII。
- 提交到仓库前清理调试输出，代码中不要保留 `console.log`。

## 路由与运行时

- `src/routes/index.tsx` 使用 `createBrowserRouter` 和 `~react-pages`。
- `import.meta.env.BASE_URL` 与路由 `basename` 保持一致，支持主应用集成加载和多环境部署。
- `vite-plugin-pages` 在开发模式下使用同步页面导入，避免 Garfish 集成 Vite dev 时 `React.lazy` 动态导入触发运行时异常；生产构建保留异步拆包。
- 微应用内部跳转不得越过自身业务前缀；跨业务跳转应使用主应用提供的导航能力或标准 URL。
- 卸载时释放微应用拥有的请求实例、事件监听、订阅、定时器、全局副作用和挂载点。

## i18n

- i18n 初始化、语言资源和主应用语言同步放在 `src/locales/*`。
- 全局 `window.dy`、i18n 和事件通道类型来自 `@dayu-sec/bizlib-shared-types/global`。
- 不在微应用中复制主应用全局协议类型；需要事件类型时从共享类型包导入或转导。
- 语言、主题、权限摘要等平台上下文由主应用提供，微应用只消费必要的只读信息。

## 目录要点

- `src/main.tsx`：应用入口，注册微前端生命周期。
- `src/runtime/*`：运行时挂载、渲染和卸载清理。
- `src/App.tsx`：注入 AntD、DySec CSS 变量主题上下文与 `RouterProvider`。
- `src/routes/index.tsx`：React Router 与约定式页面路由。
- `src/views/pages/*`：文件路由入口，只读取路由参数、适配导航并装配业务视图。
- `src/views/components/*`：业务视图、交互、数据和局部样式。
- `src/views/fallback/*`：由显式路由表装配的错误页与降级视图，不参与文件路由扫描。
- `src/services/request.ts`：默认请求实例导出与清理。
- `src/configs/request/index.ts`：默认请求配置。
- `src/locales/*`：i18n 初始化、语言配置和语言同步。
- `src/utils/*`：通用工具函数。
- `mock/*`：`vite-plugin-mock-dev-server` Mock 资源。

## 网络与 Mock

- 开发代理由 `proxy.ts` 读取 `.env.development.local` 中仅供 Vite 配置进程使用的 `DEV_API_URL`、`DEV_API_TOKEN`、`DEV_SERVER_PORT` 等本地变量。
- Mock 使用 `vite-plugin-mock-dev-server`，有本地 Mock 文件时优先本地响应，缺失时走代理。
- Mock 数据可使用 `@faker-js/faker` 生成，但不要把真实业务数据、客户数据或内部环境信息写入 Mock。

## 质量与验证

- 修改代码后优先运行 `pnpm check`。
- 涉及运行时、依赖、构建配置、路由或样式隔离时，再运行 `pnpm build`。
- 涉及页面渲染或微前端加载时，用浏览器验证独立启动和主应用集成访问。
- 代码评审优先关注功能缺陷、行为回归、类型边界、请求错误传播、样式串扰、卸载清理和敏感信息泄漏。
