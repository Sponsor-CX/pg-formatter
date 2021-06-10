// @flow

import {
  execSync,
} from 'child_process';
import {
  resolve,
} from 'path';
import {
  quote,
} from 'shell-quote';

type UserConfigurationType = {|
  +anonymize?: boolean,
  +functionCase?: 'unchanged' | 'lowercase' | 'uppercase' | 'capitalize',
  +keywordCase?: 'unchanged' | 'lowercase' | 'uppercase' | 'capitalize',
  +noRcFile?: boolean,
  +placeholder?: string,
  +spaces?: number,
  +stripComments?: boolean,
  +tabs?: boolean,
  +commaBreak?: boolean,
|};

type ConfigurationType = {|
  +anonymize: boolean,
  +functionCase: 'unchanged' | 'lowercase' | 'uppercase' | 'capitalize',
  +keywordCase: 'unchanged' | 'lowercase' | 'uppercase' | 'capitalize',
  +noRcFile: boolean,
  +placeholder?: string,
  +spaces: number,
  +stripComments: boolean,
  +tabs: boolean,
  +commaBreak?: boolean,
|};

const executablePath = resolve(__dirname, 'pg-formatter/pg_format');

const defaultConfiguration = {
  anonymize: false,
  functionCase: 'unchanged',
  keywordCase: 'unchanged',
  noRcFile: false,
  spaces: 4,
  stripComments: false,
  tabs: false,
};

const createConfiguration = (userConfiguration: UserConfigurationType = defaultConfiguration): ConfigurationType => {
  // $FlowFixMe
  return {
    ...defaultConfiguration,
    ...userConfiguration,
  };
};

const functionCaseOptionValueMap = {
  capitalize: 3,
  lowercase: 1,
  unchanged: 0,
  uppercase: 2,
};

const keywordCaseOptionValueMap = functionCaseOptionValueMap;

const createCommandLineArgs = (configuration: ConfigurationType): string => {
  const args = [];

  if (configuration.anonymize) {
    args.push('--anonymize');
  }

  if (configuration.functionCase) {
    args.push('--function-case ' + functionCaseOptionValueMap[configuration.functionCase]);
  }

  if (configuration.keywordCase) {
    args.push('--keyword-case ' + keywordCaseOptionValueMap[configuration.keywordCase]);
  }

  if (configuration.noRcFile) {
    args.push('--no-rcfile');
  }

  if (configuration.placeholder) {
    args.push('--placeholder ' + quote([configuration.placeholder]));
  }

  if (configuration.spaces) {
    args.push('--spaces ' + configuration.spaces);
  }

  if (configuration.stripComments) {
    args.push('--nocomment');
  }

  if (configuration.tabs) {
    args.push('--tabs');
  }

  if (configuration.commaBreak) {
    args.push('--comma-break');
  }

  return args.join(' ');
};

export default (sql: string, userConfiguration?: UserConfigurationType) => {
  const configuration = createConfiguration(userConfiguration);
  const args = createCommandLineArgs(configuration);

  const result = execSync('perl ' + executablePath + ' ' + args, {
    encoding: 'utf8',
    input: sql,
  });

  return result;
};
