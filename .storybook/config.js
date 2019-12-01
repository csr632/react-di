import { configure } from '@storybook/react';
import 'reflect-metadata';

// config console
import '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';
setConsoleOptions({
  panelExclude: [],
});
import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

// config looking
import { addParameters } from '@storybook/react';
addParameters({
  options: {
    // panelPosition: 'right',
  },
});

configure(require.context('../stories', true, /\.s\.(tsx?|mdx)$/), module);
