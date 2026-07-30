import healthHandler from '@/pages/api/health';
import healthzHandler from '@/pages/api/healthz';
import { getServerSideProps } from '@/pages/healthz';

function createResponse() {
  const res = {
    json: vi.fn(),
    setHeader: vi.fn(),
    status: vi.fn()
  };
  res.status.mockReturnValue(res);
  return res;
}

function createPageResponse() {
  return {
    setHeader: vi.fn(),
    statusCode: 200,
    end: vi.fn()
  };
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

  it('returns the stable health contract from the root healthz page', async () => {
    const res = createPageResponse();

    await getServerSideProps({ res } as never);

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        service: 'cronjob',
        status: 'ok'
      })
    );
  });
});
