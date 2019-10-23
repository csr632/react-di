import React from 'react';
import {
  injectable,
  CustomToken,
  withDIProvider,
  useDIConsumer,
} from 'react-rxdi';

@injectable()
class Foo {
  constructor() {
    console.log('Creating Foo');
  }
}

abstract class Bar {
  abstract add(a: number, b: number): number;
}
@injectable()
class ActualBar implements Bar {
  constructor() {
    console.log('Creating ActualBar');
  }
  add(a: number, b: number) {
    return a + b;
  }
}

const aliasFooToken = Symbol('aliasFooToken');

class Baz {
  constructor(private foo: Foo, private bar: Bar) {
    console.log('Creating Baz', this.foo, this.bar);
  }
}

interface IConfig {
  name: string;
}
const configToken = new CustomToken<IConfig>('@ configToken @');

export const ProviderDemo: React.FC = withDIProvider([
  // shorthand for useClass
  Foo,
  {
    provide: Bar,
    useClass: ActualBar,
  },
  {
    provide: aliasFooToken,
    useExisting: Foo,
  },
  {
    provide: Baz,
    useFactory: (foo, bar) => {
      return new Baz(foo, bar);
    },
    deps: [aliasFooToken, Bar],
  },
  {
    provide: configToken,
    useValue: {
      name: 'ProviderDemo',
    },
  },
])(() => {
  const [config] = useDIConsumer([configToken]);
  return <h2>{config.name}</h2>;
});
