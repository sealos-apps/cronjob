import { getJobsViewState } from '@/utils/jobsViewState';

describe('getJobsViewState', () => {
  it('does not show the empty state before the first list request settles', () => {
    expect(getJobsViewState({ initialized: false, jobListLength: 0 })).toBe('loading');
  });

  it('shows the empty state only after an initialized empty list', () => {
    expect(getJobsViewState({ initialized: true, jobListLength: 0 })).toBe('empty');
  });

  it('shows the list when initialized data contains jobs', () => {
    expect(getJobsViewState({ initialized: true, jobListLength: 1 })).toBe('list');
  });
});
