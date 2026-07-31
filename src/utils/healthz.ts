export const HEALTHZ_CACHE_CONTROL = 'no-store';
export const HEALTHZ_CONTENT_TYPE = 'application/json';

export const healthzResponse = {
  service: 'cronjob',
  status: 'ok'
} as const;

export const healthzConfigMissingResponse = {
  service: 'cronjob',
  status: 'error',
  reason: 'config_not_loaded'
} as const;
