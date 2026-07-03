import { useCallback, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import type React from 'react';
import type { QaProps } from '@/types/qa';

type ConfirmDialogContentProps = React.ComponentProps<typeof AlertDialogContent>;

export const useConfirm = ({
  title = 'Prompt',
  content,
  confirmText = 'Confirm',
  dialogProps,
  cancelButtonProps,
  confirmButtonProps
}: {
  title?: string;
  content: string;
  confirmText?: string;
  dialogProps?: ConfirmDialogContentProps & QaProps;
  cancelButtonProps?: ButtonProps & QaProps;
  confirmButtonProps?: ButtonProps & QaProps;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const cancelRef = useRef(null);
  const confirmCb = useRef<any>();
  const cancelCb = useRef<any>();

  return {
    openConfirm: useCallback(
      (confirm?: any, cancel?: any) => {
        return function () {
          onOpen();
          confirmCb.current = confirm;
          cancelCb.current = cancel;
        };
      },
      [onOpen]
    ),
    ConfirmChild: useCallback(
      () => (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent {...dialogProps}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {t(title)}
              </AlertDialogHeader>

              <AlertDialogBody>{content}</AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  colorScheme={'gray'}
                  {...cancelButtonProps}
                  onClick={() => {
                    onClose();
                    typeof cancelCb.current === 'function' && cancelCb.current();
                  }}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  ml={3}
                  variant={'primary'}
                  {...confirmButtonProps}
                  onClick={() => {
                    onClose();
                    typeof confirmCb.current === 'function' && confirmCb.current();
                  }}
                >
                  {t(confirmText)}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      ),
      [cancelButtonProps, confirmButtonProps, confirmText, content, dialogProps, isOpen, onClose, t, title]
    )
  };
};
