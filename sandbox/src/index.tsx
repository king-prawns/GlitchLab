import React from 'react';
import {createRoot, Root} from 'react-dom/client';

import Sandbox from './pages/Sandbox';

const container: HTMLElement | null = document.getElementById('root');
const root: Root = createRoot(container as HTMLElement);
root.render(<Sandbox />);
