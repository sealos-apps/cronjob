import type { GetServerSideProps } from 'next';

import {
  HEALTHZ_CACHE_CONTROL,
  HEALTHZ_CONTENT_TYPE,
  healthzConfigMissingResponse,
  healthzResponse
} from '@/utils/healthz';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const configLoaded = Boolean(globalThis.__APP_CONFIG__);
  const response = configLoaded ? healthzResponse : healthzConfigMissingResponse;

  res.setHeader('Cache-Control', HEALTHZ_CACHE_CONTROL);
  res.setHeader('Content-Type', HEALTHZ_CONTENT_TYPE);
  res.statusCode = configLoaded ? 200 : 500;
  res.end(JSON.stringify(response));

  return { props: {} };
};

export default function Healthz() {
  return null;
}
