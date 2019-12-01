import * as React from 'react';
import { Container as Injector } from 'inversify';

const ctx = React.createContext<Injector | null>(null);
ctx.displayName = `DIContainerContext`;

export default ctx;
