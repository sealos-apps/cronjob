import Empty from './components/empty';
import List from './components/jobList';
import { useQuery } from '@tanstack/react-query';
import { useJobStore } from '@/store/job';
import { useLoading } from '@/hooks/useLoading';
import { useState } from 'react';
import { serviceSideProps } from '@/utils/i18n';
import { useUserStore } from '@/store/user';

function Home() {
  const { jobList, setJobList } = useJobStore();
  const session = useUserStore((state) => state.session);
  const { Loading } = useLoading();
  const [initialized, setInitialized] = useState(false);
  const hasKubeConfig = Boolean(session?.kubeconfig || process.env.NEXT_PUBLIC_MOCK_USER);

  const { refetch } = useQuery(['initCronJobList'], setJobList, {
    enabled: hasKubeConfig,
    refetchInterval: 3000,
    onSuccess() {
      setInitialized(true);
    }
  });
  const isReady = hasKubeConfig && initialized;
  const showEmpty = isReady && jobList.length === 0;
  const showList = isReady && jobList.length > 0;

  return (
    <>
      {showEmpty && <Empty />}
      {showList && <List list={jobList} refetchApps={refetch} />}
      <Loading
        loading={!isReady}
        data-testid="cronjob.list.loading"
        data-qa-module="cronjob"
        data-qa-object="list"
        data-qa-state={isReady ? 'ready' : 'loading'}
        data-qa-loading={!isReady ? 'true' : 'false'}
      />
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
