const mocks = vi.hoisted(() => ({
  authSession: vi.fn(),
  getK8s: vi.fn()
}));

vi.mock('@/services/backend/auth', () => ({
  authSession: mocks.authSession
}));

vi.mock('@/services/backend/kubernetes', () => ({
  getK8s: mocks.getK8s
}));

import handler from '@/pages/api/cronjob/getCronJobList';
import { cronJobKey } from '@/constants/keys';

describe('/api/cronjob/getCronJobList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists cronjobs managed by this app in the user namespace', async () => {
    const cronJobs = [
      {
        metadata: {
          name: 'managed-cronjob',
          labels: {
            [cronJobKey]: 'managed-cronjob'
          }
        },
        spec: {
          schedule: '0 * * * *'
        }
      }
    ];
    const listNamespacedCronJob = vi.fn().mockResolvedValue({
      body: {
        items: cronJobs
      }
    });

    mocks.authSession.mockResolvedValue('kubeconfig');
    mocks.getK8s.mockResolvedValue({
      namespace: 'ns-test',
      k8sBatch: {
        listNamespacedCronJob
      }
    });

    const res = {
      json: vi.fn()
    };

    await handler({ headers: { authorization: 'kubeconfig' } } as any, res as any);

    expect(listNamespacedCronJob).toHaveBeenCalledWith(
      'ns-test',
      undefined,
      undefined,
      undefined,
      undefined,
      cronJobKey
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 200,
        data: cronJobs
      })
    );
  });
});
