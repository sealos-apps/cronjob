import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Box,
  Button
} from '@chakra-ui/react';
import { delCronJobByName } from '@/api/job';
import { useTranslation } from 'next-i18next';
import { useCronJobOperation } from '@/hooks/useCronJobOperation';
import dynamic from 'next/dynamic';

const ErrorModal = dynamic(() => import('@/components/ErrorModal'));

const DelModal = ({
  jobName,
  onClose,
  onSuccess
}: {
  jobName: string;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const { executeOperation, loading, errorModalState, closeErrorModal } = useCronJobOperation();

  const handleDelApp = useCallback(async () => {
    const result = await executeOperation(() => delCronJobByName(jobName), {
      successMessage: t('delete_successful'),
      errorMessage: t('delete_failed'),
      showErrorModal: true
    });

    if (result !== null) {
      onSuccess();
      onClose();
    }
  }, [executeOperation, jobName, onClose, onSuccess, t]);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        data-testid="cronjob.delete.confirm-dialog"
        data-qa-module="cronjob"
        data-qa-object="cronjob"
        data-qa-action="delete"
        data-qa-risk="destructive"
        data-qa-resource-type="cronjob"
        data-qa-resource-id={jobName}
      >
        <ModalHeader>{t('Delete Warning')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <Box color={'myGray.600'}>
            {t('Delete Hint')}
            <Box my={3}>
              {t('Please Enter')}{' '}
              <Box as={'span'} color={'myGray.900'} fontWeight={'bold'} userSelect={'all'}>
                {jobName}
              </Box>{' '}
              {t('Confirm')}
            </Box>
          </Box>

          <Input
            placeholder={`${t('Please Enter')}：${jobName}`}
            value={inputValue}
            bg={'myWhite.300'}
            onChange={(e) => setInputValue(e.target.value)}
            data-testid="cronjob.delete.name-confirm-input"
            data-qa-module="cronjob"
            data-qa-object="cronjob"
            data-qa-field="name_confirmation"
            data-qa-resource-type="cronjob"
            data-qa-resource-id={jobName}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            variant={'base'}
            data-testid="cronjob.delete.cancel-button"
            data-qa-module="cronjob"
            data-qa-object="cronjob"
            data-qa-action="cancel"
          >
            {t('Cancel')}
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            variant={'solid'}
            isDisabled={inputValue !== jobName}
            isLoading={loading}
            onClick={handleDelApp}
            data-testid="cronjob.delete.confirm-button"
            data-qa-module="cronjob"
            data-qa-object="cronjob"
            data-qa-action="delete"
            data-qa-risk="destructive"
            data-qa-resource-type="cronjob"
            data-qa-resource-id={jobName}
            data-qa-state={loading ? 'loading' : 'ready'}
            data-qa-disabled-reason={inputValue !== jobName ? 'name_confirmation_mismatch' : undefined}
          >
            {t('Confirm Delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
      {errorModalState.visible && (
        <ErrorModal
          title={errorModalState.title}
          content={errorModalState.content}
          errorCode={errorModalState.errorCode}
          onClose={closeErrorModal}
        />
      )}
    </Modal>
  );
};

export default DelModal;
