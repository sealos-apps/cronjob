import type { sealosApp as defaultSealosApp } from '@labring/sealos-desktop-sdk/app';

type SealosApp = typeof defaultSealosApp;

const QUOTA_COMPAT_ITEMS = [
  'cpu',
  'memory',
  'storage',
  'traffic',
  'nodeport',
  'gpu'
] as const;

const createQuotaCompatResponse = () => ({
  quota: QUOTA_COMPAT_ITEMS.map((type) => ({
    type,
    used: 0,
    limit: Number.MAX_SAFE_INTEGER
  }))
});

const isWorkspaceQuotaUnsupported = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const message = 'message' in error ? String(error.message) : '';
  return message === 'function is not declare';
};

export const patchWorkspaceQuotaFallback = (app: SealosApp) => {
  const originalGetWorkspaceQuota = app.getWorkspaceQuota.bind(app);

  app.getWorkspaceQuota = async () => {
    try {
      return await originalGetWorkspaceQuota();
    } catch (error) {
      if (!isWorkspaceQuotaUnsupported(error)) {
        throw error;
      }

      return createQuotaCompatResponse();
    }
  };
};
