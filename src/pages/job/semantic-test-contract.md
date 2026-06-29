# CronJob Semantic Test Contract

## 1. 模块信息

- 模块：cronjob
- 页面：创建/编辑
- 适用版本：当前仓库版本
- 维护人：CronJob frontend maintainers

## 2. 页面入口

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| CronJob 创建/编辑 | `/job/edit`、`/job/edit?name=<name>` | 表单配置、YAML 预览、提交创建或更新 |

## 3. 语义标签清单

| 页面元素 | 代码位置 | data-testid | 类型 | 业务语义 | data-qa-* | 可操作 | 可断言 | 证据来源 | 关联风险 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 类型选择触发器 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-select` | field | CronJob 类型 | `module=cronjob`, `object=job`, `field=type`, `state`, `disabled-reason=immutable_type` | 是 | 是 | issue #329 / form | validation |
| 类型选择菜单 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-menu` | panel | CronJob 类型选项容器 | `module=cronjob`, `object=job`, `field=type` | 否 | 是 | issue #329 / form | validation |
| 类型选项：访问 URL | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-option.url` | item | 选择访问 URL 类型 | `module=cronjob`, `object=job`, `field=type`, `value=url`, `state` | 是 | 是 | issue #329 / form | validation |
| 类型选项：扩缩容 Launchpad | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-option.launchpad` | item | 选择扩缩容 Launchpad 类型 | `module=cronjob`, `object=job`, `field=type`, `value=launchpad`, `state` | 是 | 是 | issue #329 / form | validation |
| 类型选项：执行命令 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-option.command` | item | 选择执行命令类型；内部任务类型仍为 `image` | `module=cronjob`, `object=job`, `field=type`, `value=command`, `state` | 是 | 是 | issue #329 / form | validation |

## 4. 状态枚举

| 元素 | data-qa-state 可选值 | 说明 |
| --- | --- | --- |
| 类型选择触发器 | `url`, `launchpad`, `command` | 当前选中的 CronJob 类型；执行命令在测试语义层标记为 `command` |
| 类型选项 | `selected`, `ready` | 当前选中项为 `selected`，其它可选项为 `ready` |

## 5. 禁用原因枚举

| disabled reason | 含义 | 自动化预期 |
| --- | --- | --- |
| `immutable_type` | 编辑已有 CronJob 时任务类型不可修改 | 编辑页可断言类型选择器禁用；创建页展开菜单验证 option |

## 6. 覆盖说明

| 需求元素 | 覆盖状态 | 说明 |
| --- | --- | --- |
| 类型选择器 trigger | covered | `cronjob.edit.type-select` 落到可点击的 Chakra Button 上 |
| 类型菜单容器 | covered | `cronjob.edit.type-menu` 落到展开后的 MenuList 上 |
| 三个业务 option | covered | 分别提供 `cronjob.edit.type-option.url`、`cronjob.edit.type-option.launchpad`、`cronjob.edit.type-option.command` |
| 业务内部枚举 | preserved | 执行命令的内部值仍为 `image`，只在测试语义层映射成 `command` |

## 7. 变更规则

- 自动化依赖的 `data-testid` 不得因文案、样式或 DOM 层级变化而重命名。
- 类型枚举或测试语义发生变化时，必须同步更新本文档。
- 不得把动态资源 ID、密码、token 或环境变量值写入 `data-testid` / `data-qa-*`。
