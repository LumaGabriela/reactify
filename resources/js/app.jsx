// import './bootstrap';
import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import MainLayout from './Pages/Layouts/MainLayout.jsx';

createInertiaApp({
    title: (title) => `${title} - Laravel`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        const page = pages[`./Pages/${name}.jsx`];
        
        page.default.layout = page.default.layout || ((page) => (
            <MainLayout>{page}</MainLayout>
        ));
        
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(React.createElement(App, props));
    },
});