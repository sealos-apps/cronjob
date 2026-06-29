import { updateCronJobStatus, implementJob } from '@/api/job';
import MyIcon from '@/components/Icon';
import MyMenu from '@/components/Menu';
import StatusTag from '@/components/StatusTag';
import MyTable from '@/components/Table';
import { StatusEnum } from '@/constants/job';
import { useConfirm } from '@/hooks/useConfirm';
import { useCronJobOperation } from '@/hooks/useCronJobOperation';
import { useClientAppConfig } from '@/hooks/useClientAppConfig';
import { CronJobListItemType } from '@/types/job';
import { Box, Button, Flex, MenuButton, useTheme } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useQuotaGuarded } from '@labring/sealos-shared-sdk';

const DelModal = dynamic(() => import('@/pages/job/detail/components/DelModal'));
const ErrorModal = dynamic(() => import('@/components/ErrorModal'));

const JobList = ({
  list = [],
  refetchApps
}: {
  list: CronJobListItemType[];
  refetchApps: () => void;
}) => {
  const { t } = useTranslation();
  const { executeOperation, errorModalState, closeErrorModal } = useCronJobOperation();
  const theme = useTheme();
  const router = useRouter();
  const [delAppName, setDelAppName] = useState('');
  const config = useClientAppConfig();

  const { openConfirm: onOpenPause, ConfirmChild: PauseChild } = useConfirm({
    content: t('Pause Hint'),
    dialogProps: {
      'data-testid': 'cronjob.pause.confirm-dialog',
      'data-qa-module': 'cronjob',
      'data-qa-object': 'cronjob',
      'data-qa-action': 'pause',
      'data-qa-risk': 'resource_mutation'
    },
    cancelButtonProps: {
      'data-testid': 'cronjob.pause.cancel-button',
      'data-qa-module': 'cronjob',
      'data-qa-object': 'cronjob',
      'data-qa-action': 'cancel'
    },
    confirmButtonProps: {
      'data-testid': 'cronjob.pause.confirm-button',
      'data-qa-module': 'cronjob',
      'data-qa-object': 'cronjob',
      'data-qa-action': 'pause',
      'data-qa-risk': 'resource_mutation'
    }
  });

  const handleCreateApp = useQuotaGuarded(
    {
      requirements: {
        cpu: config.podResources.cpuMilliCores,
        memory: config.podResources.memoryMiB,
        traffic: true
      },
      immediate: false,
      allowContinue: true
    },
    () => {
      router.push('/job/edit');
    }
  );

  const handlePauseApp = useCallback(
    async (job: CronJobListItemType, type: 'Stop' | 'Start') => {
      await executeOperation(() => updateCronJobStatus({ jobName: job.name, type: type }), {
        successMessage: type === 'Stop' ? t('job_paused') : t('job_started'),
        errorMessage: type === 'Stop' ? t('job_pause_error') : t('job_start_error'),
        onSuccess: () => refetchApps()
      });
    },
    [executeOperation, refetchApps, t]
  );
  const handleImplementJob = useCallback(
    async (job: CronJobListItemType) => {
      const result = await executeOperation(() => implementJob({ jobName: job.name }), {
        successMessage: t('job_implement_success'),
        errorMessage: t('operation_failed')
      });
      if (result !== null) {
        router.replace(`/job/detail?name=${job.name}`);
        refetchApps();
      }
    },
    [executeOperation, refetchApps, router, t]
  );

  const columns: {
    title: string;
    dataIndex?: keyof CronJobListItemType;
    key: string;
    render?: (item: CronJobListItemType) => JSX.Element;
  }[] = [
    {
      title: 'Name',
      key: 'name',
      render: (item: CronJobListItemType) => {
        return (
          <Box
            pl={4}
            color={'myGray.900'}
            fontWeight={500}
            fontSize={'md'}
            data-testid="cronjob.list.item-name"
            data-qa-module="cronjob"
            data-qa-object="cronjob"
            data-qa-field="name"
            data-qa-resource-type="cronjob"
            data-qa-resource-id={item.id || item.name}
          >
            {item.name}
          </Box>
        );
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (item: CronJobListItemType) => (
        <Box
          data-testid="cronjob.list.status-badge"
          data-qa-module="cronjob"
          data-qa-object="cronjob"
          data-qa-resource-type="cronjob"
          data-qa-resource-id={item.id || item.name}
          data-qa-state={item.status.value}
        >
          <StatusTag status={item.status} />
        </Box>
      )
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule'
    },
    {
      title: 'Next Execution Time',
      dataIndex: 'nextExecutionTime',
      key: 'nextExecutionTime'
    },
    {
      title: 'Last Schedule',
      key: 'lastScheduleTime',
      render: (item: CronJobListItemType) => (
        <Flex flexDirection={'column'} minW={'220px'}>
          <Box>
            {t('Last Schedule Time')} {item.lastScheduleTime}
          </Box>
          <Box>
            {t('Last Successful Time')} {item.lastSuccessfulTime}
          </Box>
        </Flex>
      )
    },

    {
      title: 'Operation',
      key: 'control',
      render: (item: CronJobListItemType) => (
        <Flex>
          <Button
            mr={5}
            variant={'base'}
            leftIcon={<MyIcon name={'detail'} transform={'translateY(-1px)'} />}
            px={3}
            onClick={() => router.push(`/job/detail?name=${item.name}`)}
            data-testid="cronjob.list.detail-button"
            data-qa-module="cronjob"
            data-qa-object="cronjob"
            data-qa-action="view_detail"
            data-qa-resource-type="cronjob"
            data-qa-resource-id={item.id || item.name}
          >
            {t('Details')}
          </Button>
          <MyMenu
            width={100}
            Button={
              <MenuButton
                w={'32px'}
                h={'32px'}
                borderRadius={'sm'}
                _hover={{
                  bg: 'myWhite.400',
                  color: 'hover.iconBlue'
                }}
                data-testid="cronjob.list.more-actions-button"
                data-qa-module="cronjob"
                data-qa-object="cronjob"
                data-qa-action="open_actions"
                data-qa-resource-type="cronjob"
                data-qa-resource-id={item.id || item.name}
              >
                <MyIcon name={'more'} px={3} />
              </MenuButton>
            }
            menuListProps={{
              'data-testid': 'cronjob.list.actions-menu',
              'data-qa-module': 'cronjob',
              'data-qa-object': 'cronjob',
              'data-qa-resource-type': 'cronjob',
              'data-qa-resource-id': item.id || item.name
            }}
            menuList={[
              {
                child: (
                  <>
                    <MyIcon name={'continue'} w={'14px'} />
                    <Box ml={2}>{t('implement')}</Box>
                  </>
                ),
                itemProps: {
                  'data-testid': 'cronjob.list.implement-action',
                  'data-qa-module': 'cronjob',
                  'data-qa-object': 'cronjob',
                  'data-qa-action': 'implement',
                  'data-qa-risk': 'resource_mutation',
                  'data-qa-resource-type': 'cronjob',
                  'data-qa-resource-id': item.id || item.name
                },
                onClick: () => handleImplementJob(item)
              },
              ...(item.status.value === StatusEnum.Stopped
                ? [
                    {
                      child: (
                        <>
                          <MyIcon name={'continue'} w={'14px'} />
                          <Box ml={2}>{t('Continue')}</Box>
                        </>
                      ),
                      itemProps: {
                        'data-testid': 'cronjob.list.start-action',
                        'data-qa-module': 'cronjob',
                        'data-qa-object': 'cronjob',
                        'data-qa-action': 'start',
                        'data-qa-risk': 'resource_mutation',
                        'data-qa-resource-type': 'cronjob',
                        'data-qa-resource-id': item.id || item.name,
                        'data-qa-state': item.status.value
                      },
                      onClick: () => handlePauseApp(item, 'Start')
                    }
                  ]
                : [
                    {
                      child: (
                        <>
                          <MyIcon name={'change'} w={'14px'} />
                          <Box ml={2}>{t('Update')}</Box>
                        </>
                      ),
                      itemProps: {
                        'data-testid': 'cronjob.list.update-action',
                        'data-qa-module': 'cronjob',
                        'data-qa-object': 'cronjob',
                        'data-qa-action': 'update',
                        'data-qa-resource-type': 'cronjob',
                        'data-qa-resource-id': item.id || item.name
                      },
                      onClick: () => router.push(`/job/edit?name=${item.name}`)
                    }
                  ]),
              ...(item.status.value === StatusEnum.Running
                ? [
                    {
                      child: (
                        <>
                          <MyIcon name={'pause'} w={'14px'} />
                          <Box ml={2}>{t('Pause')}</Box>
                        </>
                      ),
                      itemProps: {
                        'data-testid': 'cronjob.list.pause-action',
                        'data-qa-module': 'cronjob',
                        'data-qa-object': 'cronjob',
                        'data-qa-action': 'pause',
                        'data-qa-risk': 'resource_mutation',
                        'data-qa-resource-type': 'cronjob',
                        'data-qa-resource-id': item.id || item.name,
                        'data-qa-state': item.status.value
                      },
                      onClick: onOpenPause(() => handlePauseApp(item, 'Stop'))
                    }
                  ]
                : []),
              {
                child: (
                  <>
                    <MyIcon name={'delete'} w={'12px'} />
                    <Box ml={2}>{t('Delete')}</Box>
                  </>
                ),
                itemProps: {
                  'data-testid': 'cronjob.list.delete-action',
                  'data-qa-module': 'cronjob',
                  'data-qa-object': 'cronjob',
                  'data-qa-action': 'delete',
                  'data-qa-risk': 'destructive',
                  'data-qa-resource-type': 'cronjob',
                  'data-qa-resource-id': item.id || item.name
                },
                onClick: () => setDelAppName(item.name)
              }
            ]}
          />
        </Flex>
      )
    }
  ];

  return (
    <Box
      bg={'#F3F4F5'}
      px={'34px'}
      minH="100vh"
      data-testid="cronjob.list.page"
      data-qa-module="cronjob"
      data-qa-object="list"
      data-qa-state="list"
      data-qa-resource-count={String(list.length)}
    >
      <Flex h={'88px'} alignItems={'center'}>
        <Box mr={4} p={2} backgroundColor={'#FEFEFE'} border={theme.borders.sm} borderRadius={'sm'}>
          <MyIcon name="logo" w={'24px'} h={'24px'} />
        </Box>
        <Box fontSize={'18px'} fontWeight={500} color={'black'}>
          {t('job.list')}
        </Box>
        <Box ml={3} color={'gray.500'}>
          ( {list.length} )
        </Box>
        <Box flex={1}></Box>
        <Button
          flex={'0 0 155px'}
          h={'40px'}
          colorScheme={'primary'}
          leftIcon={<MyIcon name={'plus'} w={'12px'} />}
          variant={'primary'}
          onClick={handleCreateApp}
          data-testid="cronjob.list.create-button"
          data-qa-module="cronjob"
          data-qa-object="cronjob"
          data-qa-action="create"
        >
          {t('job.create')}
        </Button>
      </Flex>
      <MyTable
        columns={columns}
        data={list}
        data-testid="cronjob.list.table"
        data-qa-module="cronjob"
        data-qa-object="cronjob"
        data-qa-state="ready"
        data-qa-resource-count={String(list.length)}
        getRowProps={(item: CronJobListItemType) => ({
          'data-testid': 'cronjob.list.item',
          'data-qa-module': 'cronjob',
          'data-qa-object': 'cronjob',
          'data-qa-resource-type': 'cronjob',
          'data-qa-resource-id': item.id || item.name,
          'data-qa-state': item.status.value
        })}
      />
      <PauseChild />
      {!!delAppName && (
        <DelModal jobName={delAppName} onClose={() => setDelAppName('')} onSuccess={refetchApps} />
      )}
      {errorModalState.visible && (
        <ErrorModal
          title={errorModalState.title}
          content={errorModalState.content}
          errorCode={errorModalState.errorCode}
          onClose={closeErrorModal}
        />
      )}
    </Box>
  );
};

export default JobList;
