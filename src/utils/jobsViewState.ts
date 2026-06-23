export type JobsViewState = 'loading' | 'empty' | 'list';

export const getJobsViewState = ({
  hasKubeConfig,
  initialized,
  jobListLength
}: {
  hasKubeConfig: boolean;
  initialized: boolean;
  jobListLength: number;
}): JobsViewState => {
  if (!hasKubeConfig) return 'loading';
  if (!initialized) return 'loading';

  return jobListLength > 0 ? 'list' : 'empty';
};
