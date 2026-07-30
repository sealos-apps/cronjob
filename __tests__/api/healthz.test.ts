import healthHandler from '@/pages/api/health';
import healthzHandler from '@/pages/api/healthz';

function createResponse() {
  const res = {
    json: vi.fn(),
    setHeader: vi.fn(),
    status: vi.fn()
  };
  res.status.mockReturnValue(res);
  return res;
}

describe('health handlers', () => {
  it.each([
    ['healthz', healthzHandler],
    ['health', healthHandler]
  ])('returns the stable health contract from %s', (_name, handler) => {
    const res = createResponse();

    handler({} as any, res as any);

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      service: 'cronjob',
      status: 'ok'
    });
  });
});
