import MyIcon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import YamlCode from '@/components/YamlCode/index';
import type { QueryType, YamlItemType } from '@/types';
import { obj2Query, useCopyData } from '@/utils/tools';
import { Box, Flex, useTheme } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './index.module.scss';

const Yaml = ({ yamlList = [], pxVal }: { yamlList: YamlItemType[]; pxVal: number }) => {
  const theme = useTheme();
  const router = useRouter();
  const { name } = router.query as QueryType;
  const { copyData } = useCopyData();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Flex
      w="100%"
      h="100%"
      justifyContent={'center'}
      px="32px"
      data-testid="cronjob.edit.yaml-view"
      data-qa-module="cronjob"
      data-qa-object="yaml"
      data-qa-state={yamlList.length ? 'ready' : 'empty'}
    >
      <Box w="220px">
        <Tabs
          list={[
            { id: 'form', label: 'Config Form' },
            { id: 'yaml', label: 'YAML File' }
          ]}
          activeId={'yaml'}
          data-testid="cronjob.edit.mode-tabs"
          data-qa-module="cronjob"
          data-qa-object="editor"
          data-qa-state="yaml"
          getItemProps={(item) => ({
            'data-testid': `cronjob.edit.${item.id}-tab`,
            'data-qa-module': 'cronjob',
            'data-qa-object': 'editor',
            'data-qa-action': 'switch_tab',
            'data-qa-state': item.id === 'yaml' ? 'active' : 'inactive'
          })}
          onChange={() =>
            router.replace(
              `/job/edit?${obj2Query({
                name,
                type: 'form'
              })}`
            )
          }
        />
        <Box mt={3} borderRadius={'sm'} overflow={'hidden'} bg={'white'}>
          {yamlList.map((file, index) => (
            <Box
              key={file.filename}
              px={5}
              py={3}
              borderLeft={'2px solid'}
              alignItems={'center'}
              h={'48px'}
              {...(yamlList.length > 1
                ? {
                    cursor: 'pointer',
                    _hover: {
                      backgroundColor: 'myWhite.400'
                    },
                    ...(index === selectedIndex
                      ? {
                          fontWeight: 'bold',
                          borderColor: 'myGray.900',
                          backgroundColor: 'myWhite.600 !important'
                        }
                      : {
                          color: 'myGray.500',
                          borderColor: 'myGray.200',
                          backgroundColor: 'transparent'
                        })
                  }
                : {})}
              onClick={() => setSelectedIndex(index)}
              data-testid="cronjob.edit.yaml-file-item"
              data-qa-module="cronjob"
              data-qa-object="yaml"
              data-qa-field="filename"
              data-qa-resource-id={file.filename}
              data-qa-state={index === selectedIndex ? 'selected' : 'ready'}
            >
              {file.filename}
            </Box>
          ))}
        </Box>
      </Box>

      {!!yamlList[selectedIndex] && (
        <Flex
          w="786px"
          ml="16px"
          className={styles.codeBox}
          flexDirection={'column'}
          h={'100%'}
          overflow={'hidden'}
          border={theme.borders.base}
          borderRadius={'md'}
          position={'relative'}
          data-testid="cronjob.edit.yaml-panel"
          data-qa-module="cronjob"
          data-qa-object="yaml"
          data-qa-resource-id={yamlList[selectedIndex].filename}
          data-qa-state="ready"
        >
          <Flex px={8} py={4} bg={'myWhite.400'}>
            <Box flex={1} fontSize={'xl'} color={'myGray.900'} fontWeight={'bold'}>
              {yamlList[selectedIndex].filename}
            </Box>
            <Box
              cursor={'pointer'}
              color={'myGray.600'}
              _hover={{ color: '#219BF4' }}
              onClick={() => copyData(yamlList[selectedIndex].value)}
              data-testid="cronjob.edit.yaml-copy-button"
              data-qa-module="cronjob"
              data-qa-object="yaml"
              data-qa-action="copy"
              data-qa-resource-id={yamlList[selectedIndex].filename}
            >
              <MyIcon name="copy" w={'16px'} />
            </Box>
          </Flex>
          <Box
            flex={1}
            h={0}
            overflow={'auto'}
            bg={'#ffffff'}
            p={4}
            data-testid="cronjob.edit.yaml-code"
            data-qa-module="cronjob"
            data-qa-object="yaml"
            data-qa-resource-id={yamlList[selectedIndex].filename}
          >
            <YamlCode className={styles.code} content={yamlList[selectedIndex].value} />
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default Yaml;
