import React from 'react';
import Navbar from '../Components/navbar/navbar';

export default function MainLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
}