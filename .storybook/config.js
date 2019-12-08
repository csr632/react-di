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

// sort stories
// https://github.com/storybookjs/storybook/issues/548#issuecomment-530305279
addParameters({
  options: {
    storySort: (a, b) => {
      debugger
      const fileNameA = a[1].parameters.fileName.split(/(\\|\/)/g).pop();
      const fileNameB = b[1].parameters.fileName.split(/(\\|\/)/g).pop();
      return fileNameA.localeCompare(fileNameB);
    },
  },
});
