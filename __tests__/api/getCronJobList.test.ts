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

describe('/api/cronjob/getCronJobList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists all cronjobs in the user namespace without requiring app-specific labels', async () => {
    const cronJobs = [
      {
        metadata: {
          name: 'without-ui-label'
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

    expect(listNamespacedCronJob).toHaveBeenCalledWith('ns-test');
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 200,
        data: cronJobs
      })
    );
  });
});
