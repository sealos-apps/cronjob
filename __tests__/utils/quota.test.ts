import { patchWorkspaceQuotaFallback } from '@/utils/quota';

describe('patchWorkspaceQuotaFallback', () => {
  it('returns compatible quota data when desktop does not expose workspace quota API', async () => {
    const app = {
      getWorkspaceQuota: vi.fn().mockRejectedValue({ message: 'function is not declare' })
    } as any;

    patchWorkspaceQuotaFallback(app);

    await expect(app.getWorkspaceQuota()).resolves.toEqual({
      quota: expect.arrayContaining([
        { type: 'cpu', used: 0, limit: Number.MAX_SAFE_INTEGER },
        { type: 'memory', used: 0, limit: Number.MAX_SAFE_INTEGER },
        { type: 'traffic', used: 0, limit: Number.MAX_SAFE_INTEGER }
      ])
    });
  });

  it('keeps unexpected quota errors visible', async () => {
    const error = new Error('quota service failed');
    const app = {
      getWorkspaceQuota: vi.fn().mockRejectedValue(error)
    } as any;

    patchWorkspaceQuotaFallback(app);

    await expect(app.getWorkspaceQuota()).rejects.toBe(error);
  });
});
