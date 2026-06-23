const JOB_NAME_PATTERN = /^[a-z][a-z0-9]+([-.][a-z0-9]+)*$/;

export const JOB_NAME_EMPTY_MESSAGE = 'The job name cannot be empty';
export const JOB_NAME_PATTERN_MESSAGE =
  'The application name can contain only lowercase letters, digits, and hyphens (-) and must start with a letter';

export const validateJobName = (value: string) => {
  if (!value) {
    return JOB_NAME_EMPTY_MESSAGE;
  }

  if (!JOB_NAME_PATTERN.test(value)) {
    return JOB_NAME_PATTERN_MESSAGE;
  }

  return true;
};
