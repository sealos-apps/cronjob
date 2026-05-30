# TC-04 页面创建 CronJob 并执行成功

## 用例目标

验证通过 CronJob 页面创建的任务能够落到 Kubernetes，并实际生成 Job、Pod，最终输出预期日志。

## 关联代码修改

- `src/utils/quota.ts` 和 `src/pages/_app.tsx`：保证页面创建流程可以进入表单并提交。
- `src/pages/job/edit/index.tsx`：页面表单提交和 YAML 生成路径，本次未直接修改，但属于该用例验证的业务链路。
- `src/utils/json2Yaml.ts`：表单数据转换为 Kubernetes CronJob YAML 的路径，本次未直接修改，但属于该用例验证的业务链路。

## 前置条件

- TC-03 已通过。
- 部署确认弹窗已打开。
- 测试任务参数已填写完成。

## 测试流程

1. 在部署确认弹窗中确认创建。
2. 等待页面回到任务列表。
3. 检查列表中出现 `ui-smoke-<case-id>`。
4. 远端检查用户 namespace 中的 CronJob：
   - `kubectl get cronjob ui-smoke-<case-id> -n ns-admin`
5. 等待调度生成 Job 和 Pod。
6. 检查 Job 完成状态。
7. 查看完成 Pod 日志。

## 期望结果

- 页面列表出现新 CronJob。
- Kubernetes 中存在 `cronjob.batch/ui-smoke-<case-id>`。
- 生成的 Job 完成为 `1/1`。
- Pod 状态为 `Completed`。
- Pod 日志包含 `ui-smoke-from-page`。

## 实际结果

通过。

- 页面列表出现 `ui-smoke-<case-id>`。
- Kubernetes 中 CronJob 调度为 `*/5 * * * *`。
- Job `ui-smoke-<job-id>` 完成为 `1/1`。
- Pod `ui-smoke-<job-id>-<pod-id>` 状态为 `Completed`。
- Pod 日志输出 `ui-smoke-from-page`。

## 截图

![确认部署后页面列表出现新 CronJob](./screenshots/TC-04-created-cronjob-list.png)

## 测试结果文件

- [页面创建后的 CronJob 列表结果](./results/TC-04-created-cronjob.txt)
- [页面创建出的 CronJob YAML](./results/TC-04-created-cronjob.yaml)
- [CronJob 生成 Job、Pod 和事件结果](./results/TC-04-run-result.txt)
- [完成 Pod 日志](./results/TC-04-pod-log.txt)
