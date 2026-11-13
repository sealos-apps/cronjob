import type { Cluster } from '@kubernetes/client-node';
import { describe, expect, it } from 'vitest';
import {
  InvalidKubeconfigError,
  createInlineKubeConfig,
  parseInlineKubeconfig
} from '@/services/backend/kubeconfig';

const config = () => ({
  'current-context': 'active',
  clusters: [
    {
      name: 'cluster',
      cluster: {
        server: 'https://caller.invalid',
        'insecure-skip-tls-verify': true
      } as Record<string, unknown>
    }
  ],
  contexts: [
    { name: 'active', context: { cluster: 'cluster', user: 'user', namespace: 'ns-test' } }
  ],
  users: [{ name: 'user', user: { token: 'dummy-token' } as Record<string, unknown> }]
});

const trusted: Cluster = {
  name: 'trusted',
  server: 'https://trusted.invalid',
  caData: 'dummy-ca',
  skipTLSVerify: false
};

describe('kubeconfig security', () => {
  it('rejects plugins and file credentials before loading, including inactive users', () => {
    for (const field of [
      'exec',
      'auth-provider',
      'token-file',
      'tokenFile',
      'client-certificate',
      'client-key',
      'as',
      'username',
      'password'
    ]) {
      const value = config();
      value.users[0]!.user[field] =
        field === 'exec' ? { command: 'must-never-run' } : 'must-not-use';
      expect(() => createInlineKubeConfig(JSON.stringify(value), trusted)).toThrow(
        InvalidKubeconfigError
      );

      const inactive = config();
      inactive.users.push({ name: 'inactive', user: value.users[0]!.user });
      expect(() => createInlineKubeConfig(JSON.stringify(inactive), trusted)).toThrow(
        InvalidKubeconfigError
      );
    }

    for (const field of ['certificate-authority', 'proxy-url']) {
      const value = config();
      value.clusters[0]!.cluster[field] = '/must-not-read';
      expect(() => createInlineKubeConfig(JSON.stringify(value), trusted)).toThrow(
        InvalidKubeconfigError
      );
    }
  });

  it('rejects empty, malformed and oversized input', () => {
    for (const raw of ['', '[', 'x'.repeat(256 * 1024 + 1)]) {
      expect(() => parseInlineKubeconfig(raw, JSON.parse)).toThrow(InvalidKubeconfigError);
    }
  });

  it('rebuilds active inline credentials and binds endpoint and CA to trusted settings', () => {
    const kc = createInlineKubeConfig(JSON.stringify(config()), trusted);
    expect(kc.getCurrentUser()?.token).toBe('dummy-token');
    expect(kc.getCurrentCluster()?.server).toBe(trusted.server);
    expect(kc.getCurrentCluster()?.caData).toBe(trusted.caData);
    expect(kc.getCurrentCluster()?.skipTLSVerify).toBe(false);
    expect(kc.getContextObject(kc.getCurrentContext())?.namespace).toBe('ns-test');

    const value = config();
    value.users[0]!.user = {
      'client-certificate-data': 'dummy-cert',
      'client-key-data': 'dummy-key'
    };
    expect(createInlineKubeConfig(JSON.stringify(value), trusted).getCurrentUser()?.certData).toBe(
      'dummy-cert'
    );

    delete value.users[0]!.user['client-key-data'];
    expect(() => createInlineKubeConfig(JSON.stringify(value), trusted)).toThrow(
      InvalidKubeconfigError
    );
  });

  it('rejects configs without inline credentials', () => {
    const value = config();
    value.users[0]!.user = {};
    expect(() => createInlineKubeConfig(JSON.stringify(value), trusted)).toThrow(
      InvalidKubeconfigError
    );
  });
});
