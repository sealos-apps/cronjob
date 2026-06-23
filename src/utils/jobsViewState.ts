export type JobsViewState = 'loading' | 'empty' | 'list';

export const getJobsViewState = ({
  initialized,
  jobListLength
}: {
  initialized: boolean;
  jobListLength: number;
}): JobsViewState => {
  if (!initialized) return 'loading';

  return jobListLength > 0 ? 'list' : 'empty';
};
