import { IContainerLevelPlugin, IDIContainerHook } from './types';
import { useSyncInit, isObject } from '../utils';

// use a ContainerLevelPlugin to implement SvsLevelPlugin
export const SvsLevelPlugin: IContainerLevelPlugin = allProvidedValues => {
  const svsPlugins = useSyncInit(() => {
    const result: IDIContainerHook[] = [];
    allProvidedValues.forEach(({ value }) => {
      if (isObject(value) && value.useDIContainerHook)
        result.push(value.useDIContainerHook.bind(value));
    });
    return result;
  });
  svsPlugins.forEach(plugin => {
    plugin();
  });
};
