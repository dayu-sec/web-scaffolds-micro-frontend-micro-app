# AGENTS.md

本文件记录当前微应用脚手架的项目事实、核心工程约束、真实入口和协作边界。无论是否安装外部 Skill，当前项目都以本文件、配置和源码为准。常规交互使用中文，除非用户另有要求。

## Agent Skills

- 本项目不要求安装外部 Skill 才能开发或验证。
- 安装 DayuSec Web Skills 可补充微应用生命周期、路由基址、隔离与宿主集成工作流；若 Skill 指引与本项目事实不一致，始终以本文件及源码为准。

## 边界与技术

- 常规任务只修改本微应用 Git 根内的源码、配置、文档和测试；不修改工作区配置、宿主、其他微应用、菜单、版本、制品清单、CI 或部署模板，除非任务明确要求。
- Node.js `>=22.12.0`，包管理器 `pnpm@11.13.0`。
- 构建使用 Vite 8、React 19、TypeScript 6 严格模式；UI 使用 Ant Design 6 和 ProComponents 3 兼容线。
- 路由使用 `vite-plugin-pages` 与 React Router 7；微前端入口适配 Garfish 生命周期并支持独立运行。
- 路径别名：`@/* -> src/*`、`#/* -> mock/*`。

## 命令与本地运行

- `pnpm dev` 独立启动微应用；`pnpm build` 执行 `tsc -b && vite build`；`pnpm preview` 预览生产制品。
- `pnpm check` 运行 TypeScript 检查；`pnpm lint`、`pnpm format-check` 运行代码规范和格式检查。
- 本地代理配置保存在未提交的 `.env.development.local`；代码不得硬编码本地端口或远端环境地址。
- `proxy.ts` 仅供 Vite 代理配置使用；`vite-plugin-mock-dev-server` 有 Mock 文件时优先响应，缺失时走代理。

## 运行时与真实入口

- `src/main.tsx` 区分独立运行与宿主加载；`src/mf-adapters/garfish/adapter.ts` 向 Garfish 暴露 render/destroy 生命周期。
- `src/runtime/bootstrapRuntime.ts` 拥有请求等基础设施 setup/cleanup；`src/runtime/renderApp.tsx` 拥有 React 根、Router basename 和卸载。
- `src/App.tsx` 组合应用 Provider 与 Router；`src/routes/index.tsx` 创建收敛在自身 basename 下的路由。
- `src/views/pages/` 为文件路由入口，`src/views/components/` 保存业务视图，`src/views/fallback/` 保存显式降级页面。
- `src/services/request.ts` 导出共享 API 请求实例并负责清理，`src/configs/request.ts` 保存其配置；业务请求不得绕过该边界直接使用 Axios。
- `src/locales/` 拥有语言初始化和宿主语言同步。

## 核心源码与命名约定

- `types`、`constants`、`configs`、`services` 和 `utils` 分别承载领域类型与契约、稳定字面量、运行配置组装、业务服务或外部数据边界、通用工具。
- `src/views/pages/` 只承载 URL 结构、参数适配、redirect、guard、loader、layout 和导航契约；请求、表单、状态、组件及样式等业务实现存放在 `src/views/components/` 等视图层。
- **命名规范**：
  - React 组件目录、主文件 `.tsx` 及同名附属文件使用 PascalCase（例如 `<ComponentName>.tsx`、`<ComponentName>.module.css`）。
  - Hook 文件与导出统一使用 `useXxx`（例如 `useFeatureState.ts`）；非 Hook 模块不得使用 `use` 前缀。
  - Service、契约、类型、常量、配置、工具及一般模块使用小写 kebab-case。
  - 仅约束新建路径或明确重构，不批量重命名已有存量文件。

## TypeScript 与实现基线

- 保持 TypeScript 严格模式，不降低严格度或批量禁用规则。
- 禁用 `any`；外部输入与未知错误由 `unknown` 起步，类型收窄后使用。
- 不新增 `enum` 或 `const enum`；仅需要类型集合时使用字面量联合，同时需要运行时值时使用 `as const` 对象并从值推导类型。
- 禁用双重断言、非空断言及 `@ts-ignore`；Promise 必须被等待、返回或明确处理。
- 复用已定义的类型契约与 SDK 类型，不在多处复制近似类型。

## 项目专用选择

- ProComponents 默认只采用当前模板明确使用的高级组件。
- 图表使用 `echarts-for-react`，代码预览使用 `shiki`，文件大小使用 `filesize`，富文本使用已安装的 wangEditor，HTML 回显配合 `dompurify`。
- `zustand` 与 `immer` 只用于确有跨组件所有权的微应用内部状态，不将接口请求包装为全局 Store。
- 微应用不得覆写 `html`、`body`、宿主布局容器或操控其他应用的 DOM、路由和状态。

## 协作与安全

- 保留工作树中无关修改；不提交真实域名、私有地址、Token、密钥或个人敏感信息。
- 未经明确许可，不执行 Git commit/push、发布、部署或版本递增。
- 常规源码和配置变更运行 TypeScript、Lint 和格式检查；涉及运行时、路由、构建或隔离时追加 `pnpm build`。
- 页面或生命周期变更须同时验证独立启动、宿主集成、重复挂载、卸载清理、直接 URL 和刷新。
