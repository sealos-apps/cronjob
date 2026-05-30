# TC-03 quota 兼容修复后页面创建流程

## 用例目标

验证修复 `getWorkspaceQuota` 兼容问题后，页面创建入口恢复正常，可以从空列表进入编辑页、填写表单并打开部署确认弹窗。

## 关联代码修改

- `src/utils/quota.ts`
  - 捕获仅限 `message === 'function is not declare'` 的旧 Desktop 兼容错误。
  - 返回包含 `cpu`、`memory`、`storage`、`traffic`、`nodeport`、`gpu` 的非阻断 quota 数据。
  - 其他 quota 异常继续抛出，避免隐藏真实错误。
- `src/pages/_app.tsx`
  - 在 `createSealosApp()` 后调用 `patchWorkspaceQuotaFallback(sealosApp)`。
- `__tests__/utils/quota.test.ts`
  - 验证旧 Desktop 缺失接口时返回兼容 quota。
  - 验证非兼容错误仍然 reject。

## 前置条件

- GitHub Actions 已构建并推送 `ghcr.io/sealos-apps/cronjob/cronjob-cluster:sha-3aa827c`。
- <TEST_NODE> 已通过 `sealos run` 升级到该镜像。
- `cronjob` Deployment 为 `1/1`。

## 测试流程

1. 执行修复镜像升级：
   - `sealos run ghcr.io/sealos-apps/cronjob/cronjob-cluster:sha-3aa827c`
2. 打开 Sealos Desktop 中的 `定时任务` 应用。
3. 在空列表点击 `添加定时任务`。
4. 确认页面跳转到编辑表单。
5. 填写测试 CronJob：
   - 名称：`ui-smoke-<case-id>`
   - 调度：`*/5 * * * *`
   - 类型：执行命令
   - 镜像：`labring4docker/curl-kubectl:v1.0.0`
   - 命令：`/bin/sh -c`
   - 参数：`echo ui-smoke-from-page`
6. 点击部署，确认弹出部署确认窗口。

## 期望结果

- 点击 `添加定时任务` 后进入编辑表单。
- 表单可以正常填写。
- 点击部署后出现确认弹窗。
- 不再出现 `function is not declare` 阻断。

## 实际结果

通过。

- 修复镜像升级成功，`cronjob` release revision 为 2。
- 空列表页面可以进入编辑表单。
- 表单填写完成后可以打开部署确认弹窗。
- 页面创建流程未再被 workspace quota 接口缺失阻断。

## 截图

![修复后空列表](./screenshots/TC-03-empty-list-after-fix.png)

![点击添加后进入编辑页](./screenshots/TC-03-edit-form-after-click.png)

![表单填写完成](./screenshots/TC-03-form-filled.png)

![部署确认弹窗](./screenshots/TC-03-deploy-confirm.png)

## 测试结果文件

- [修复镜像升级执行日志 sha-3aa827c](./results/TC-03-upgrade-sha-3aa827c.log)
- [修复镜像升级后资源检查](./results/TC-03-after-upgrade-sha-3aa827c.txt)
- [修复后 UI 流程结果记录](./results/TC-03-ui-after-fix-result.txt)
