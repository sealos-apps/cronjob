import type { GetServerSideProps } from 'next';

import { HEALTHZ_CACHE_CONTROL, HEALTHZ_CONTENT_TYPE, healthzResponse } from '@/utils/healthz';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', HEALTHZ_CACHE_CONTROL);
  res.setHeader('Content-Type', HEALTHZ_CONTENT_TYPE);
  res.statusCode = 200;
  res.end(JSON.stringify(healthzResponse));

  return { props: {} };
};

export default function Healthz() {
  return null;
}
