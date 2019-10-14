import * as React from 'react';
import { Container } from 'inversify';

const ctx = React.createContext<Container | null>(null);
ctx.displayName = `DIContainerContext`;

export default ctx;
