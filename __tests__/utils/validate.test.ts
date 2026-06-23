import {
  JOB_NAME_EMPTY_MESSAGE,
  JOB_NAME_PATTERN_MESSAGE,
  validateJobName
} from '@/utils/validate';

describe('validateJobName', () => {
  it('requires a job name', () => {
    expect(validateJobName('')).toBe(JOB_NAME_EMPTY_MESSAGE);
  });

  it('rejects unsupported job name formats', () => {
    expect(validateJobName('1-job')).toBe(JOB_NAME_PATTERN_MESSAGE);
    expect(validateJobName('Job')).toBe(JOB_NAME_PATTERN_MESSAGE);
    expect(validateJobName('job_name')).toBe(JOB_NAME_PATTERN_MESSAGE);
  });

  it('accepts supported job name formats', () => {
    expect(validateJobName('a1')).toBe(true);
    expect(validateJobName('job-name')).toBe(true);
    expect(validateJobName('job.name')).toBe(true);
  });
});
