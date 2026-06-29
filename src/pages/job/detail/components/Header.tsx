import { implementJob, updateCronJobStatus } from '@/api/job';
import MyIcon from '@/components/Icon';
import StatusTag from '@/components/StatusTag';
import { CronJobStatusMap } from '@/constants/job';
import { useConfirm } from '@/hooks/useConfirm';
import { useCronJobOperation } from '@/hooks/useCronJobOperation';
import type { CronJobStatusMapType } from '@/types/job';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { Dispatch, useCallback } from 'react';

const DelModal = dynamic(() => import('./DelModal'));
const ErrorModal = dynamic(() => import('@/components/ErrorModal'));

const Header = ({
  appName = 'app-name',
  appStatus = CronJobStatusMap['Running'],
  isPause = false,
  isLargeScreen = true,
  setShowSlider,
  refetchCronJob,
  refetchJob
}: {
  appStatus: CronJobStatusMapType;
  appName?: string;
  isPause?: boolean;
  isLargeScreen: boolean;
  setShowSlider: Dispatch<boolean>;
  refetchCronJob: () => void;
  refetchJob: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { executeOperation, loading, errorModalState, closeErrorModal } = useCronJobOperation();
  const {
    isOpen: isOpenDelModal,
    onOpen: onOpenDelModal,
    onClose: onCloseDelModal
  } = useDisclosure();
  const { openConfirm: openRestartConfirm, ConfirmChild: RestartConfirmChild } = useConfirm({
    content: 'Confirm to restart this application?'
  });
  const { openConfirm: onOpenPause, ConfirmChild: PauseChild } = useConfirm({
    content: t('pause_message'),
    dialogProps: {
      'data-testid': 'cronjob.pause.confirm-dialog',
      'data-qa-module': 'cronjob',
      'data-qa-object': 'cronjob',
      'data-qa-action': 'pause',
      'data-qa-risk': 'resource_mutation',
      'data-qa-resource-type': 'cronjob',
      'data-qa-resource-id': appName
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
      'data-qa-risk': 'resource_mutation',
      'data-qa-resource-type': 'cronjob',
      'data-qa-resource-id': appName
    }
  });

  const handlePauseApp = useCallback(async () => {
    await executeOperation(() => updateCronJobStatus({ jobName: appName, type: 'Stop' }), {
      successMessage: t('job_paused'),
      errorMessage: t('job_pause_error'),
      onSuccess: () => refetchCronJob()
    });
  }, [appName, executeOperation, refetchCronJob, t]);

  const handleRunJob = useCallback(async () => {
    await executeOperation(() => implementJob({ jobName: appName }), {
      successMessage: t('job_implement_success'),
      errorMessage: t('operation_failed'),
      onSuccess: () => refetchJob()
    });
  }, [appName, executeOperation, refetchJob, t]);

  const handleStartApp = useCallback(async () => {
    await executeOperation(() => updateCronJobStatus({ jobName: appName, type: 'Start' }), {
      successMessage: t('job_started'),
      errorMessage: t('job_start_error'),
      onSuccess: () => refetchCronJob()
    });
  }, [appName, executeOperation, refetchCronJob, t]);

  return (
    <Flex
      h={'86px'}
      alignItems={'center'}
      data-testid="cronjob.detail.header"
      data-qa-module="cronjob"
      data-qa-object="cronjob"
      data-qa-resource-type="cronjob"
      data-qa-resource-id={appName}
      data-qa-state={appStatus.value}
    >
      <Button
        variant={'unstyled'}
        onClick={() => router.replace('/jobs')}
        lineHeight={1}
        data-testid="cronjob.detail.back-button"
        data-qa-module="cronjob"
        data-qa-object="cronjob"
        data-qa-action="back"
      >
        <MyIcon name="arrowLeft" />
      </Button>
      <Box ml={5} mr={3} fontSize={'3xl'} fontWeight={'bold'}>
        {appName}
      </Box>
      <Box
        data-testid="cronjob.detail.status-badge"
        data-qa-module="cronjob"
        data-qa-object="cronjob"
        data-qa-resource-type="cronjob"
        data-qa-resource-id={appName}
        data-qa-state={appStatus.value}
      >
        <StatusTag status={appStatus} showBorder />
      </Box>
      {!isLargeScreen && (
        <Box mx={4}>
          <Button
            flex={1}
            h={'40px'}
            borderColor={'myGray.200'}
            leftIcon={<MyIcon name="detail" w={'14px'} h={'14px'} transform={'translateY(3px)'} />}
            variant={'base'}
            bg={'white'}
            onClick={() => setShowSlider(true)}
            data-testid="cronjob.detail.open-summary-button"
            data-qa-module="cronjob"
            data-qa-object="summary"
            data-qa-action="open"
            data-qa-resource-type="cronjob"
            data-qa-resource-id={appName}
          >
            {t('Details')}
          </Button>
        </Box>
      )}
      <Box flex={1} />

      {/* btns */}
      <Button
        mr={5}
        h={'40px'}
        borderColor={'myGray.200'}
        leftIcon={<MyIcon name="continue" w={'14px'} />}
        isLoading={loading}
        variant={'base'}
        bg={'white'}
        onClick={handleRunJob}
        data-testid="cronjob.detail.implement-button"
        data-qa-module="cronjob"
        data-qa-object="cronjob"
        data-qa-action="implement"
        data-qa-risk="resource_mutation"
        data-qa-state={loading ? 'loading' : 'ready'}
        data-qa-resource-type="cronjob"
        data-qa-resource-id={appName}
      >
        {t('implement')}
      </Button>
      {isPause ? (
        <Button
          mr={5}
          h={'40px'}
          borderColor={'myGray.200'}
          leftIcon={<MyIcon name="continue" w={'14px'} />}
          isLoading={loading}
          variant={'base'}
          bg={'white'}
          onClick={handleStartApp}
          data-testid="cronjob.detail.start-button"
          data-qa-module="cronjob"
          data-qa-object="cronjob"
          data-qa-action="start"
          data-qa-risk="resource_mutation"
          data-qa-state={loading ? 'loading' : 'ready'}
          data-qa-resource-type="cronjob"
          data-qa-resource-id={appName}
        >
          {t('Continue')}
        </Button>
      ) : (
        <Button
          mr={5}
          h={'40px'}
          borderColor={'myGray.200'}
          leftIcon={<MyIcon name="pause" w={'14px'} />}
          isLoading={loading}
          variant={'base'}
          bg={'white'}
          onClick={onOpenPause(handlePauseApp)}
          data-testid="cronjob.detail.pause-button"
          data-qa-module="cronjob"
          data-qa-object="cronjob"
          data-qa-action="pause"
          data-qa-risk="resource_mutation"
          data-qa-state={loading ? 'loading' : 'ready'}
          data-qa-resource-type="cronjob"
          data-qa-resource-id={appName}
        >
          {t('Pause')}
        </Button>
      )}
      {!isPause && (
        <Button
          mr={5}
          h={'40px'}
          borderColor={'myGray.200'}
          leftIcon={<MyIcon name={'change'} w={'14px'} />}
          isLoading={loading}
          variant={'base'}
          bg={'white'}
          onClick={() => {
            router.push(`/job/edit?name=${appName}`);
          }}
          data-testid="cronjob.detail.update-button"
          data-qa-module="cronjob"
          data-qa-object="cronjob"
          data-qa-action="update"
          data-qa-resource-type="cronjob"
          data-qa-resource-id={appName}
        >
          {t('Update')}
        </Button>
      )}

      <Button
        h={'40px'}
        borderColor={'myGray.200'}
        leftIcon={<MyIcon name="delete" w={'14px'} h={'14px'} />}
        variant={'base'}
        bg={'white'}
        _hover={{
          color: '#FF324A'
        }}
        isDisabled={loading}
        onClick={onOpenDelModal}
        data-testid="cronjob.detail.delete-button"
        data-qa-module="cronjob"
        data-qa-object="cronjob"
        data-qa-action="delete"
        data-qa-risk="destructive"
        data-qa-state={loading ? 'loading' : 'ready'}
        data-qa-disabled-reason={loading ? 'loading' : undefined}
        data-qa-resource-type="cronjob"
        data-qa-resource-id={appName}
      >
        {t('Delete')}
      </Button>
      <RestartConfirmChild />
      <PauseChild />
      {isOpenDelModal && (
        <DelModal
          jobName={appName}
          onClose={onCloseDelModal}
          onSuccess={() => router.replace('/jobs')}
        />
      )}
      {errorModalState.visible && (
        <ErrorModal
          title={errorModalState.title}
          content={errorModalState.content}
          errorCode={errorModalState.errorCode}
          onClose={closeErrorModal}
        />
      )}
    </Flex>
  );
};

export default React.memo(Header);
