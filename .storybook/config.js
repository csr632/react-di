import { configure } from '@storybook/react';
import 'reflect-metadata';

configure(require.context('../stories', true, /\.stories\.tsx?$/), module);

// config console
import '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';
setConsoleOptions({
  panelExclude: [],
});
import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
