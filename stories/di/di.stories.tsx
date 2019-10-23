import React from 'react';
import { storiesOf } from '@storybook/react';
import DIDoc from './di.md';
import { BasicDemo } from './basic';
import { InjectDecoratorDemo } from './inject-decorater';
import { ProviderDemo } from './providers';
import { HierarchicalDemo } from './hierarchical';

// wait for https://github.com/storybookjs/storybook/pull/8440
// then migrate to CSF: https://storybook.js.org/docs/formats/storiesof-api/

storiesOf('DI', module)
  .add('basic', () => <BasicDemo />)
  .add('inject decorator', () => <InjectDecoratorDemo />)
  .add('provider', () => <ProviderDemo />)
  .add('hierarchical', () => <HierarchicalDemo />);
