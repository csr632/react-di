import { IContainerLevelPlugin, ISvsLevelPlugin } from './types';
import { useSyncInit, isObject } from '../utils';

// use a ContainerLevelPlugin to implement SvsLevelPlugin
export const SvsLevelPlugin: IContainerLevelPlugin = allProvidedValues => {
  const svsPlugins = useSyncInit(() => {
    const result: ISvsLevelPlugin[] = [];
    allProvidedValues.forEach(({ value }) => {
      if (isObject(value) && value.pluginHook)
        result.push(value.pluginHook.bind(value));
    });
    return result;
  });
  svsPlugins.forEach(plugin => {
    plugin();
  });
};
