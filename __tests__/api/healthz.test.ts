import { getServerSideProps } from '@/pages/healthz';

function createPageResponse() {
  return {
    setHeader: vi.fn(),
    statusCode: 200,
    end: vi.fn()
  };
}

describe('healthz page', () => {
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
