import { adaptCronJobDetail, adaptCronJobList } from '@/utils/adapt';
import type { V1CronJob } from '@kubernetes/client-node';

const baseCronJob = (schedule: string): V1CronJob =>
  ({
    metadata: {
      name: 'impossible-date',
      uid: 'uid',
      creationTimestamp: new Date('2026-06-23T00:00:00Z'),
      labels: {
        'cronjob-type': 'image'
      }
    },
    spec: {
      schedule,
      suspend: false,
      jobTemplate: {
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'impossible-date',
                  image: 'busybox'
                }
              ]
            }
          }
        }
      }
    },
    status: {}
  }) as unknown as V1CronJob;

describe('cronjob adapters', () => {
  it('keeps cronjobs visible when the next execution time cannot be calculated', () => {
    const item = adaptCronJobList(baseCronJob('0 0 31 2 *'));

    expect(item.name).toBe('impossible-date');
    expect(item.schedule).toBeTruthy();
    expect(item.nextExecutionTime).toBe('-');
  });

  it('keeps cronjob detail readable when the next execution time cannot be calculated', async () => {
    const detail = await adaptCronJobDetail(baseCronJob('0 0 31 2 *'));

    expect(detail.jobName).toBe('impossible-date');
    expect(detail._schedule).toBeTruthy();
    expect(detail.nextExecutionTime).toBe('-');
  });
});
