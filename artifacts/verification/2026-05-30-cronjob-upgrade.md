# CronJob Upgrade Verification

Date: 2026-05-30 Asia/Shanghai

## Scope

- Target: sanitized single-node Sealos test cluster
- Base package: `sealos-pro-v5.1.2-rc5-amd64.tar`
- Add-on package: `admin-cluster-v0.1.0-amd64.tar`
- Initial cronjob image under test: `ghcr.io/sealos-apps/cronjob/cronjob-cluster:sha-99799cd`
- Fix image under test: `ghcr.io/sealos-apps/cronjob/cronjob-cluster:sha-3aa827c`
- Branch: `codex/cronjob-install-deploy-test-<case-id>`
- CI run: https://github.com/sealos-apps/cronjob/actions/runs/26656630295

## Result

Passed after fix commit `3aa827c151e43ae3dd70cb0d6ee69b3aba687eb5`.

The cluster supports fresh install plus upgrade install. The old `cronjob-frontend` workload, namespace, Helm release, values residue, and unused runtime image cache were removed. The current active deployment is `cronjob` in namespace `cronjob`, and a CronJob was created only through the Sealos desktop UI.

## Reproduction And Fix

1. Fresh-installed Sealos Pro rc5 on <TEST_NODE> and trusted the cluster certificate locally.
2. Installed the admin add-on.
3. Upgraded from the legacy `cronjob-frontend` baseline to `cronjob-cluster:sha-99799cd`.
4. Opened CronJob from Sealos desktop and attempted to create a job through the page.
5. Actual before fix: clicking `添加定时任务` sent `account.getWorkspaceQuota`; desktop returned `function is not declare`; the page threw `PAGEERROR Object` and stayed on the empty list.
6. Expected: page navigation and deployment should continue when this Sealos desktop does not expose workspace quota API.
7. Fix: added `src/utils/quota.ts` to tolerate only the unsupported quota API response and return compatible non-blocking quota data; unexpected quota errors still throw.
8. Rebuilt and published `cronjob-cluster:sha-3aa827c` by GitHub Actions, then upgraded <TEST_NODE>.

## Upgrade Evidence

Legacy baseline before upgrade:

```text
namespace/cronjob-frontend Active
deployment.apps/cronjob-frontend 1/1
service/cronjob-frontend
configmap/cronjob-frontend-config
ingress.networking.k8s.io/cronjob-frontend
```

After fix image upgrade:

```text
helm release: cronjob
namespace: cronjob
revision: 2
deployment.apps/cronjob 1/1
image: ghcr.io/sealos-apps/cronjob/cronjob:sha-3aa827c
ingress host: <APP_DOMAIN>
old helm cronjob-frontend: release not found
values: /root/.sealos/cloud/values/apps/cronjob/cronjob-values.yaml
```

Final residue check:

```text
active resources residue: none
image cache residue:
sealos.hub:5000/sealos-apps/cronjob/cronjob sha-3aa827c
```

## UI Functional Test

Created through page operation:

- Desktop app: `定时任务`
- Job name: `ui-smoke-<case-id>`
- Schedule: `*/5 * * * *`
- Type: `执行命令`
- Image: `labring4docker/curl-kubectl:v1.0.0`
- Command: `/bin/sh -c`
- Args: `echo ui-smoke-from-page`

Kubernetes result:

```text
cronjob.batch/ui-smoke-<case-id>   */5 * * * *   False
job.batch/ui-smoke-<job-id>   1/1
pod/ui-smoke-<job-id>-<pod-id>   Completed
log: ui-smoke-from-page
```

## Screenshots

These PNG files are sanitized placeholders that preserve evidence structure without exposing cluster UI details.


- Before fix, add button stayed on empty list: `assets/2026-05-30-cronjob/19-ui-after-create-click-b.png`
- Empty list after fixed upgrade: `assets/2026-05-30-cronjob/25-fixed-cronjob-empty-list.png`
- Add button navigated to edit page: `assets/2026-05-30-cronjob/26-fixed-edit-form-from-button.png`
- Filled execution-image form: `assets/2026-05-30-cronjob/30-fixed-form-filled-d.png`
- Deploy confirmation dialog: `assets/2026-05-30-cronjob/31-fixed-deploy-confirm-d.png`
- Created CronJob in list: `assets/2026-05-30-cronjob/32-fixed-after-confirm-list-d.png`

## Artifact Index

- CI: `assets/2026-05-30-cronjob/remote/cronjob-run-sha-3aa827c.log`
- Health: `assets/2026-05-30-cronjob/remote/final-cluster-health-sha-3aa827c.txt`
- Residue cleanup: `assets/2026-05-30-cronjob/remote/final-residue-after-image-cleanup-sha-3aa827c.txt`
- UI-created object: `assets/2026-05-30-cronjob/remote/ui-cronjob-created-sha-3aa827c.yaml`
- UI-created run evidence: `assets/2026-05-30-cronjob/remote/ui-cronjob-run-by-name-sha-3aa827c.txt`
- Pod log: `assets/2026-05-30-cronjob/remote/ui-cronjob-completed-pod-log-sha-3aa827c.txt`
