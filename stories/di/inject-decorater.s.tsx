import React from 'react';
import { inject, injectable, withDIContainer } from 'react-rxdi';

interface IData {
  age: number;
}

const dataToken = Symbol('data token');

@injectable()
class InjectDemoSvs {
  constructor(@inject(dataToken) private data: IData) {
    console.log(`creating InjectDemoSvs. data:`, JSON.stringify(data));
  }
}

export const Demo: React.FC = withDIContainer([
  InjectDemoSvs,
  {
    provide: dataToken,
    useValue: { age: 123 },
  },
])(() => {
  return <h2>InjectDecoratorDemo</h2>;
});

export default {
  title: 'inject decorater',
};
