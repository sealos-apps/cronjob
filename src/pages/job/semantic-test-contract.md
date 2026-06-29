# CronJob Semantic Test Contract

## 1. 模块信息

- 模块：cronjob
- 页面：列表、创建/编辑、详情
- 适用版本：当前仓库版本
- 维护人：CronJob frontend maintainers

## 2. 页面入口

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| CronJob 列表 | `/jobs` | 查看空状态、加载态、CronJob 列表和列表操作 |
| CronJob 创建/编辑 | `/job/edit`、`/job/edit?name=<name>` | 表单配置、YAML 预览、提交创建或更新 |
| CronJob 详情 | `/job/detail?name=<name>` | 查看状态、基础信息、历史任务、日志和资源操作 |

## 3. 语义标签清单

| 页面元素 | 代码位置 | data-testid | 类型 | 业务语义 | data-qa-* | 可操作 | 可断言 | 证据来源 | 关联风险 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 列表加载态 | `src/pages/jobs/index.tsx` | `cronjob.list.loading` | state | 列表初始化中 | `module=cronjob`, `object=list`, `state`, `loading` | 否 | 是 | route / state | loading |
| 列表空态 | `src/pages/jobs/components/empty.tsx` | `cronjob.list.empty-state` | state | 当前没有 CronJob | `module=cronjob`, `object=list`, `state=empty` | 否 | 是 | route / state | empty |
| 空态创建按钮 | `src/pages/jobs/components/empty.tsx` | `cronjob.list.empty-create-button` | action | 进入创建 CronJob | `object=cronjob`, `action=create` | 是 | 是 | route / action | resource_mutation |
| 列表页根节点 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.page` | panel | CronJob 列表页 | `object=list`, `state=list`, `resource-count` | 否 | 是 | route / state | 无 |
| 列表表格 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.table` | panel | CronJob 集合 | `object=cronjob`, `state=ready`, `resource-count` | 否 | 是 | route / state | 无 |
| 列表项首列 | `src/components/Table/index.tsx` + `src/pages/jobs/components/jobList.tsx` | `cronjob.list.item` | item | 单个 CronJob 行作用域 | `resource-type=cronjob`, `resource-id`, `state` | 否 | 是 | API / state | resource_binding |
| 列表项名称 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.item-name` | field | CronJob 名称 | `field=name`, `resource-id` | 否 | 是 | API | resource_binding |
| 列表项状态 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.status-badge` | state | CronJob 运行状态 | `state`, `resource-id` | 否 | 是 | API / state | status |
| 列表详情按钮 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.detail-button` | action | 打开详情页 | `action=view_detail`, `resource-id` | 是 | 是 | route / action | 无 |
| 列表更多操作按钮 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.more-actions-button` | action | 展开操作菜单 | `action=open_actions`, `resource-id` | 是 | 是 | action | 无 |
| 列表操作菜单 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.actions-menu` | panel | 行级操作菜单 | `resource-id` | 否 | 是 | action | 无 |
| 列表执行操作 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.implement-action` | action | 手动执行 CronJob | `action=implement`, `risk=resource_mutation`, `resource-id` | 是 | 是 | API / mutation | resource_mutation |
| 列表启动操作 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.start-action` | action | 启动已暂停 CronJob | `action=start`, `risk=resource_mutation`, `state`, `resource-id` | 是 | 是 | API / mutation | resource_mutation |
| 列表更新操作 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.update-action` | action | 进入更新页 | `action=update`, `resource-id` | 是 | 是 | route / action | resource_mutation |
| 列表暂停操作 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.pause-action` | action | 暂停运行中 CronJob | `action=pause`, `risk=resource_mutation`, `state`, `resource-id` | 是 | 是 | API / mutation | resource_mutation |
| 列表删除操作 | `src/pages/jobs/components/jobList.tsx` | `cronjob.list.delete-action` | action | 打开删除确认 | `action=delete`, `risk=destructive`, `resource-id` | 是 | 是 | API / mutation | destructive |
| 暂停确认弹窗 | `src/hooks/useConfirm.tsx` callers | `cronjob.pause.confirm-dialog` | panel | 暂停确认 | `action=pause`, `risk=resource_mutation` | 否 | 是 | mutation | resource_mutation |
| 暂停确认按钮 | `src/hooks/useConfirm.tsx` callers | `cronjob.pause.confirm-button` | action | 确认暂停 | `action=pause`, `risk=resource_mutation` | 是 | 是 | mutation | resource_mutation |
| 删除确认弹窗 | `src/pages/job/detail/components/DelModal.tsx` | `cronjob.delete.confirm-dialog` | panel | 删除确认 | `action=delete`, `risk=destructive`, `resource-id` | 否 | 是 | mutation | destructive |
| 删除名称确认输入 | `src/pages/job/detail/components/DelModal.tsx` | `cronjob.delete.name-confirm-input` | field | 输入 CronJob 名称确认删除 | `field=name_confirmation`, `resource-id` | 是 | 是 | mutation | destructive |
| 删除确认按钮 | `src/pages/job/detail/components/DelModal.tsx` | `cronjob.delete.confirm-button` | action | 确认删除 CronJob | `action=delete`, `risk=destructive`, `state`, `disabled-reason`, `resource-id` | 是 | 是 | mutation | destructive |
| 编辑页根节点 | `src/pages/job/edit/index.tsx` | `cronjob.edit.page` | panel | 创建或更新 CronJob | `action=create/update`, `state`, `resource-id` | 否 | 是 | route / state | resource_mutation |
| 编辑表单 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.form` | panel | CronJob 配置表单 | `action=create/update` | 否 | 是 | form | 无 |
| 名称输入 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.name-input` | field | CronJob 名称 | `field=name`, `disabled-reason=immutable_name` | 是 | 是 | form / validation | validation |
| Cron 表达式输入 | `src/pages/job/edit/components/Cron.tsx` | `cronjob.edit.schedule-input` | field | 调度表达式 | `object=schedule`, `field=schedule`, `state`, `error-code` | 是 | 是 | form / validation | validation |
| Cron 示例 | `src/pages/job/edit/components/Cron.tsx` | `cronjob.edit.schedule-example` | action | 套用 Cron 示例 | `action=apply_example`, `field=schedule`, `value` | 是 | 是 | form | 无 |
| 类型选择触发器 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-select` | field | CronJob 类型 | `object=job`, `field=type`, `state`, `disabled-reason=immutable_type` | 是 | 是 | form / type | validation |
| 类型选择菜单 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-menu` | panel | CronJob 类型选项容器 | `object=job`, `field=type` | 否 | 是 | form / type | validation |
| 类型选项：访问 URL | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-option.url` | item | 选择访问 URL 类型 | `object=job`, `field=type`, `value=url`, `state` | 是 | 是 | form / type | validation |
| 类型选项：扩缩容 Launchpad | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-option.launchpad` | item | 选择扩缩容 Launchpad 类型 | `object=job`, `field=type`, `value=launchpad`, `state` | 是 | 是 | form / type | validation |
| 类型选项：执行命令 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.type-option.command` | item | 选择执行命令类型；内部任务类型仍为 `image` | `object=job`, `field=type`, `value=command`, `state` | 是 | 是 | form / type | validation |
| URL 输入 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.url-input` | field | URL 类型任务地址 | `object=url_job`, `field=url` | 是 | 是 | form | validation |
| 镜像名称输入 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.image-name-input` | field | 镜像类型任务镜像名 | `object=image_job`, `field=image_name` | 是 | 是 | form | validation |
| 镜像仓库凭证字段 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.registry-*-input` | field | 私有镜像仓库凭证 | `object=image_registry_secret`, `field` | 是 | 是 | form | secret_input |
| 环境变量按钮/弹窗 | `src/pages/job/edit/components/Form.tsx`, `EditEnvs.tsx` | `cronjob.edit.envs-button`, `cronjob.edit.envs-dialog` | action / panel | 编辑环境变量 | `object=environment`, `action=edit`, `resource-count` | 是 | 是 | form | secret_input |
| Launchpad 选择 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.launchpad-select` | field | 选择关联 Launchpad | `object=launchpad_job`, `field=launchpad_id`, `resource-type=launchpad`, `resource-id` | 是 | 是 | API / form | resource_binding |
| 副本数输入 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.replicas-input` | field | Launchpad 副本数 | `field=replicas` | 是 | 是 | form | resource_config |
| CPU / Memory 滑块 | `src/pages/job/edit/components/Form.tsx` | `cronjob.edit.cpu-slider`, `cronjob.edit.memory-slider` | field | Launchpad 资源配置 | `field=cpu/memory`, `value` | 是 | 是 | form | resource_config |
| YAML 视图 | `src/pages/job/edit/components/Yaml.tsx` | `cronjob.edit.yaml-view` | panel | YAML 预览 | `object=yaml`, `state` | 否 | 是 | form / yaml | 无 |
| YAML 复制按钮 | `src/pages/job/edit/components/Yaml.tsx` | `cronjob.edit.yaml-copy-button` | action | 复制 YAML | `object=yaml`, `action=copy`, `resource-id=filename` | 是 | 是 | yaml | 无 |
| 导出 YAML 按钮 | `src/pages/job/edit/components/Header.tsx` | `cronjob.edit.export-yaml-button` | action | 导出 YAML zip | `object=yaml`, `action=export`, `resource-id` | 是 | 是 | yaml | 无 |
| 创建 / 更新提交按钮 | `src/pages/job/edit/components/Header.tsx` | `cronjob.create.submit-button`, `cronjob.update.submit-button` | action | 提交创建或更新 | `action=create/update`, `risk=resource_mutation`, `state`, `resource-id` | 是 | 是 | API / mutation | resource_mutation |
| 创建 / 更新确认按钮 | `src/pages/job/edit/index.tsx` | `cronjob.create.confirm-button`, `cronjob.update.confirm-button` | action | 确认提交创建或更新 | `action=create/update`, `risk=resource_mutation`, `resource-id` | 是 | 是 | API / mutation | resource_mutation |
| 详情页根节点 | `src/pages/job/detail/index.tsx` | `cronjob.detail.page` | panel | CronJob 详情页 | `resource-type=cronjob`, `resource-id`, `state`, `loading` | 否 | 是 | route / API | resource_binding |
| 详情状态 | `src/pages/job/detail/components/Header.tsx` | `cronjob.detail.status-badge` | state | CronJob 当前状态 | `state`, `resource-id` | 否 | 是 | API / state | status |
| 详情执行/启动/暂停/更新/删除 | `src/pages/job/detail/components/Header.tsx` | `cronjob.detail.*-button` | action | 详情页资源操作 | `action`, `risk`, `state`, `resource-id` | 是 | 是 | API / mutation | resource_mutation / destructive |
| 详情概览 | `src/pages/job/detail/components/AppBaseInfo.tsx` | `cronjob.detail.summary` | panel | CronJob 基础信息和调度统计 | `resource-id`, `state` | 否 | 是 | API | resource_binding |
| 历史任务列表 | `src/pages/job/detail/components/AppMainInfo.tsx` | `cronjob.detail.history-list` | panel | CronJob 历史任务 | `object=job_history`, `state` | 否 | 是 | API | history |
| 历史任务项 | `src/pages/job/detail/components/AppMainInfo.tsx` | `cronjob.detail.history-item` | item | 单个 Job 执行记录 | `resource-type=job`, `resource-id`, `state`, `selected` | 是 | 是 | API / state | resource_binding |
| 事件项 | `src/pages/job/detail/components/AppMainInfo.tsx` | `cronjob.detail.history-event` | item | Job 事件 | `resource-type=event`, `resource-id`, `state`, `reason` | 否 | 是 | API / event | diagnostics |
| 日志面板 | `src/pages/job/detail/components/AppMainInfo.tsx` | `cronjob.detail.log-panel` | panel | Pod 日志 | `object=pod_log`, `resource-type=pod`, `resource-id`, `state` | 否 | 是 | API / logs | diagnostics |
| 通用错误弹窗 | `src/components/ErrorModal/index.tsx` | `cronjob.error.dialog` | error | 操作失败或特殊错误 | `object=operation`, `state=error`, `error-code` | 否 | 是 | API / error | error |

## 4. 状态枚举

| 元素 | data-qa-state 可选值 | 说明 |
| --- | --- | --- |
| 列表页 | `loading`, `empty`, `list`, `ready` | 列表加载、空态、有数据、表格就绪 |
| CronJob 状态 | `Running`, `Stopped`, `Creating`, `Starting`, `Stopping`, `Updating`, `SpecUpdating`, `Rebooting`, `Upgrade`, `VerticalScaling`, `VolumeExpanding`, `Failed`, `UnKnow` | 来自 `CronJobStatusMap` |
| 表单 / 操作按钮 | `ready`, `loading`, `error`, `empty`, `selected`, `active`, `inactive` | 表单和交互控件状态 |
| 历史 Job | `active`, `succeeded`, `failed` | 来自 Job 执行状态 |
| 事件 | `Normal`, `Warning` 或 Kubernetes event type | 来自 Kubernetes event type |

## 5. 禁用原因枚举

| disabled reason | 含义 | 自动化预期 |
| --- | --- | --- |
| `immutable_name` | 编辑已有 CronJob 时名称不可修改 | 断言名称输入禁用 |
| `immutable_type` | 编辑已有 CronJob 时任务类型不可修改 | 断言类型选择禁用 |
| `immutable_source` | 编辑已有 CronJob 时 Launchpad 来源不可修改 | 断言 Launchpad 选择禁用 |
| `loading` | 操作请求进行中 | 等待按钮恢复 ready |
| `name_confirmation_mismatch` | 删除确认输入未匹配 CronJob 名称 | 删除确认按钮不可点击 |

## 6. 错误码枚举

| error code | 含义 | 自动化预期 |
| --- | --- | --- |
| `invalid_cron_expression` | Cron 表达式解析失败 | 断言 Cron 输入或消息区域进入 error |
| `BALANCE_NOT_ENOUGH` | 余额不足 | 错误弹窗确认按钮会触发充值入口 |
| `FORBIDDEN_CREATE_APP` | 无创建权限 | 错误弹窗展示并可确认关闭 |
| `APP_ALREADY_EXISTS` | CronJob 已存在 | 错误弹窗展示并可确认关闭 |

## 7. 资源绑定

| 页面元素 | 资源字段 | 说明 |
| --- | --- | --- |
| CronJob 列表项、状态、操作按钮 | `data-qa-resource-type=cronjob`, `data-qa-resource-id=item.id || item.name` | 优先绑定 Kubernetes uid，缺失时使用名称 |
| 详情页根节点、Header、操作按钮、删除弹窗 | `data-qa-resource-type=cronjob`, `data-qa-resource-id=appName` | 详情页路由以 CronJob 名称为资源 ID |
| Launchpad 选择器和选项 | `data-qa-resource-type=launchpad`, `data-qa-resource-id=launchpad.id` | 绑定来源 Launchpad ID |
| 历史任务项 | `data-qa-resource-type=job`, `data-qa-resource-id=job.uid || job.name` | 绑定 Kubernetes Job |
| 日志面板 | `data-qa-resource-type=pod`, `data-qa-resource-id=podName` | 绑定执行 Pod |
| 事件项 | `data-qa-resource-type=event`, `data-qa-resource-id=event.id` | 绑定事件 ID |

## 8. 覆盖说明

| 需求元素 | 覆盖状态 | 说明 |
| --- | --- | --- |
| 列表加载、空态、有数据 | covered | `/jobs` 根状态和 Empty/List 分支已覆盖 |
| 核心创建入口 | covered | 空态和列表页创建按钮已覆盖 |
| 行级资源绑定 | covered | 首列行作用域、状态和操作按钮均绑定资源 |
| 执行、启动、暂停、更新、删除 | covered | 列表和详情页均覆盖关键资源操作 |
| 创建/编辑核心字段 | covered | 名称、Cron、类型、URL、镜像、Launchpad、资源配置、环境变量入口已覆盖 |
| YAML 预览/复制/导出 | covered | YAML 文件、代码区域、复制和导出已覆盖 |
| 历史 Job / 事件 / 日志 | covered | 详情页历史列表、事件和 Pod 日志已覆盖 |
| 纯布局、图标、说明文字 | skipped | 不参与操作、断言、状态或资源绑定 |
| 环境变量值、镜像仓库密码 | skipped | 避免把敏感值写入 DOM 属性；仅标记字段和动作 |

## 9. 变更规则

- 新增核心操作必须新增稳定 `data-testid`。
- 表单字段新增、删除或改名时必须同步更新本文档。
- 删除或重命名自动化依赖标签必须在 PR 中说明影响范围。
- 资源列表项不得把动态 ID 拼进 `data-testid`；使用 `data-qa-resource-id` 绑定资源。
- 不得把密码、token、私有地址、环境变量值等敏感信息写入 `data-qa-*`。
