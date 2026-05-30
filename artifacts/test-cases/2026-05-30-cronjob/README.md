# CronJob 测试用例集

日期：2026-05-30，时区：Asia/Shanghai

## 测试范围

- 目标环境：脱敏后的单节点 Sealos 测试集群
- 基础包：`sealos-pro-v5.1.2-rc5-amd64.tar`
- 附加包：`admin-cluster-v0.1.0-amd64.tar`
- 首轮升级镜像：`ghcr.io/sealos-apps/cronjob/cronjob-cluster:sha-99799cd`
- 修复后升级镜像：`ghcr.io/sealos-apps/cronjob/cronjob-cluster:sha-3aa827c`
- 分支：`codex/cronjob-install-deploy-test-<case-id>`
- CI：`https://github.com/sealos-apps/cronjob/actions/runs/26656630295`

## 总结论

通过。

本次验证覆盖从 0 安装、从 rc5 遗留 `cronjob-frontend` 升级安装、残留配置清理、页面创建 CronJob、CronJob 实际执行、集群健康和离线镜像缓存检查。首轮升级后发现页面创建被 Sealos Desktop 缺失 `getWorkspaceQuota` 接口阻断，修复后重新构建 `sha-3aa827c` 集群镜像并完成复测。

## 代码修改索引

- `deploy/cronjob-entrypoint.sh`：处理 `cronjob-frontend` 旧 Helm release、旧 namespace、旧 values 路径迁移与清理，并接管已有 `cronjob` 资源。
- `.github/workflows/build_from_sealos.yaml`：构建 Sealos 集群镜像时写入运行时镜像并缓存依赖镜像。
- `src/utils/quota.ts`：当旧版 Sealos Desktop 返回 `function is not declare` 时，返回兼容 quota 数据，避免创建入口被误阻断。
- `src/pages/_app.tsx`：应用初始化时挂载 quota 兼容补丁。
- `__tests__/utils/quota.test.ts`：补充 quota 兼容行为和异常透传测试。
- `Makefile`：调整 build 描述为当前 `cronjob` 名称。

## 用例清单

| 用例 | 验证点 | 结果 |
| --- | --- | --- |
| [TC-01 升级安装并清理遗留配置](./TC-01-升级安装并清理遗留配置.md) | 从 `cronjob-frontend` 升级为 `cronjob`，清理旧 namespace、release、values | 通过 |
| [TC-02 修复前页面创建失败复现](./TC-02-修复前页面创建失败复现.md) | 复现 `getWorkspaceQuota` 缺失导致无法进入创建页 | 复现成功，判定为失败用例 |
| [TC-03 quota 兼容修复后页面创建流程](./TC-03-quota兼容修复后页面创建流程.md) | 修复后从页面进入编辑页、填写表单、打开部署确认 | 通过 |
| [TC-04 页面创建 CronJob 并执行成功](./TC-04-页面创建CronJob并执行成功.md) | UI 创建的 CronJob 能生成 Job、Pod，并输出预期日志 | 通过 |
| [TC-05 集群健康、残留和镜像缓存复查](./TC-05-集群健康残留和镜像缓存复查.md) | 集群健康、旧资源残留、旧镜像缓存清理 | 通过 |

## 证据目录

- `screenshots/`：脱敏后的页面截图占位图，文件名按用例编号归档。
- `results/`：远端命令输出、Helm/Kubernetes/YAML 结果、Pod 日志和手工复现结果。
