import { getServerSideProps } from '@/pages/healthz';

function createPageResponse() {
  return {
    setHeader: vi.fn(),
    statusCode: 200,
    end: vi.fn()
  };
}

const appConfig = {
  cloud: {
    domain: 'cloud.example.com',
    desktopDomain: 'cloud.example.com'
  },
  cronjob: {
    components: {
      applaunchpad: {
        url: 'https://applaunchpad.cloud.example.com'
      }
    },
    jobHistory: {
      failedLimit: 3,
      successfulLimit: 3
    },
    podResources: {
      cpuMilliCores: 50,
      memoryMiB: 64
    }
  }
} as const;

afterEach(() => {
  globalThis.__APP_CONFIG__ = undefined;
});

describe('healthz page', () => {
  it('returns the stable health contract when app config is loaded', async () => {
    globalThis.__APP_CONFIG__ = appConfig;
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

  it('returns unhealthy when app config is not loaded', async () => {
    const res = createPageResponse();

    await getServerSideProps({ res } as never);

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        service: 'cronjob',
        status: 'error',
        reason: 'config_not_loaded'
      })
    );
  });
});
