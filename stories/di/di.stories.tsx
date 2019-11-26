import React from 'react';
import { storiesOf } from '@storybook/react';
import DIDoc from './di.md';
import { BasicDemo } from './basic';
import { InjectDecoratorDemo } from './inject-decorater';
import { ProviderDemo } from './providers';
import { HierarchicalDemo } from './hierarchical';
import { AbstrationDemo } from './abstraction';
import { ConfigurableDemo } from './configurable';
import { CustomTokenDemo } from './custom-token';
import { ProviderTypesDemo } from './provider-types';

// wait for https://github.com/storybookjs/storybook/pull/8440
// then migrate to CSF: https://storybook.js.org/docs/formats/storiesof-api/

storiesOf('DI', module)
  .add('basic', () => <BasicDemo />)
  .add('inject decorator', () => <InjectDecoratorDemo />)
  .add('provider', () => <ProviderDemo />)
  .add('hierarchical', () => <HierarchicalDemo />)
  .add('abstraction', () => <AbstrationDemo />)
  .add('configurable', () => <ConfigurableDemo />)
  .add('custom token', () => <CustomTokenDemo />)
  .add('provider types', () => <ProviderTypesDemo />);
