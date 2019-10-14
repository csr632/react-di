import * as React from 'react';
import { useAssertValueNotChange } from '../utils';
import { IToken, GetValueTypeByToken, getActualToken } from './types';
import ctx from './context';

// https://github.com/microsoft/TypeScript/pull/26063#issuecomment-531285281
type RetType<Args extends [IToken, ...IToken[]]> = {
  [Index in keyof Args]: Args[Index] extends IToken
    ? GetValueTypeByToken<Extract<Args[Index], IToken>>
    : never;
};

export function useDIConsumer<Tokens extends [IToken, ...IToken[]]>(
  tokens: Tokens
): RetType<Tokens> {
  const container = React.useContext(ctx);
  if (!container) {
    throw new Error(
      `Can't find DI container.
      You must use withDIProvider somewhere above the component tree.`
    );
  }
  useAssertValueNotChange(container);
  /* eslint-disable react-hooks/exhaustive-deps */
  const result: any = React.useMemo(
    () =>
      tokens.map(oneToken => {
        const actualToken = getActualToken(oneToken);
        try {
          return container.get(actualToken);
        } catch (error) {
          console.error(
            `Fail to get value from injector. \nToken:`,
            oneToken,
            '\nOriginal error:',
            error
          );

          if (
            (error as Error).message.indexOf('No matching bindings found') >= 0
          ) {
            throw new Error(
              `Can't find value to inject.
              You should provide it somewhere above the component tree. (use withDIProvider)
              See the console.error above for more info.`
            );
          }
          throw error;
        }
      }),
    [container, ...tokens]
  );
  return result;
}
