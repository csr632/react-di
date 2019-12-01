import React from 'react';
import { IAllProvidedValues, IContainerLevelPlugin } from './types';

export const PluginExecutor: React.FC<{
  allProvidedValues: IAllProvidedValues;
  plugins: IContainerLevelPlugin[];
}> = ({ allProvidedValues, plugins, children }) => {
  // execute plugins
  plugins.forEach(plugin => {
    plugin(allProvidedValues);
  });
  return <>{children}</>;
};
