import { Config } from '@/config';
import { jsonRes } from '@/services/backend/response';
import { ClientAppConfigSchema } from '@/types/config';
import type { NextApiRequest, NextApiResponse } from 'next';

const SERVER_MISCONFIGURED = 'SERVER_MISCONFIGURED';

class ServerMisconfiguredError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = SERVER_MISCONFIGURED;
  }
}

function isServerMisconfiguredError(error: unknown): error is ServerMisconfiguredError {
  return error instanceof ServerMisconfiguredError || (error as Error)?.name === SERVER_MISCONFIGURED;
}

export function getClientAppConfigServer() {
  const fullConfig = Config();
  const result = ClientAppConfigSchema.safeParse({
    domain: fullConfig.cloud.domain,
    desktopDomain: fullConfig.cloud.desktopDomain,
    components: {
      applaunchpad: {
        url:
          fullConfig.cronjob.components.applaunchpad.url ||
          `https://applaunchpad.${fullConfig.cloud.domain}`
      }
    },
    podResources: fullConfig.cronjob.podResources,
    jobHistory: fullConfig.cronjob.jobHistory
  });

  if (!result.success) {
    throw new ServerMisconfiguredError('Client app config validation failed', {
      cause: result.error
    });
  }

  return result.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    jsonRes(res, { code: 200, data: getClientAppConfigServer() });
  } catch (error) {
    if (isServerMisconfiguredError(error)) {
      return jsonRes(res, { code: 500, message: 'Server misconfigured' });
    }
    console.error('[Client App Config] Unexpected server error:', error);
    return jsonRes(res, { code: 500, message: 'Internal Server Error' });
  }
}
