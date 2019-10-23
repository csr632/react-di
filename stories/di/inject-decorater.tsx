import React from 'react';
import { inject, injectable, CustomToken, withDIProvider } from 'react-rxdi';

interface IData {
  age: number;
}

const dataToken = new CustomToken<IData>('data token');

@injectable()
export class InjectDemoSvs {
  constructor(@inject(dataToken) private data: IData) {
    console.log(`creating InjectDemoSvs. data:`, JSON.stringify(data));
  }
}

export const InjectDecoratorDemo: React.FC = withDIProvider([
  InjectDemoSvs,
  {
    provide: dataToken,
    useValue: { age: 123 },
  },
])(() => {
  return <h2>InjectDecoratorDemo</h2>;
});
