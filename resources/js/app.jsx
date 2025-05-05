import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';


createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
//      root.render(React.createElement(App, props));

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
