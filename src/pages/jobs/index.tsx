import Empty from './components/empty';
import List from './components/jobList';
import { useQuery } from '@tanstack/react-query';
import { useJobStore } from '@/store/job';
import { useLoading } from '@/hooks/useLoading';
import { useState } from 'react';
import { serviceSideProps } from '@/utils/i18n';
import { getJobsViewState } from '@/utils/jobsViewState';

function Home() {
  const { jobList, setJobList } = useJobStore();
  const { Loading } = useLoading();
  const [initialized, setInitialized] = useState(false);

  const { refetch } = useQuery(['initCronJobList'], setJobList, {
    refetchInterval: 3000,
    onSettled() {
      setInitialized(true);
    }
  });
  const viewState = getJobsViewState({ initialized, jobListLength: jobList.length });

  return (
    <>
      {viewState === 'empty' && <Empty />}
      {viewState === 'list' && <List list={jobList} refetchApps={refetch} />}
      <Loading loading={viewState === 'loading'} />
    </>
  );
}

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content))
    }
  };
}

export default Home;
