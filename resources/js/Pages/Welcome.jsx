import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js'
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome to Reactify" />
            <div className="min-h-screen bg-gray-1">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-purple-2 selection:text-white">
                    {/* Header */}
                    <header className="w-full absolute top-0 py-6 px-6 flex justify-between items-center">
                        <div className="text-2xl font-bold text-purple-2">
                            Reactify
                        </div>
                        <nav className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('projects.index')}
                                    className="px-4 py-2 text-white hover:bg-purple-2 rounded-lg transition-all duration-300"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-white hover:bg-purple-2 rounded-lg transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2 bg-purple-2 text-white hover:bg-purple-1 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        Registre
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center py-32 px-6">
                        <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in-up">
                            Gerencie seus Projetos com {" "}
                            <span className="text-purple-2">Reactify</span>
                        </h1>
                        <p className="text-xl text-white mb-12 max-w-3xl">
                            Accelerate your React development with our powerful
                            toolkit. Create, manage, and deploy React applications
                            faster than ever before.
                        </p>

                        <div className="flex gap-4 mb-16">
                            <Link
                                href={route('register')}
                                className="px-8 py-4 bg-purple-2 text-white hover:bg-purple-1 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Registre
                            </Link>
                            <Link
                                href={route('login')}
                                className="px-8 py-4 border-2 border-purple-2 text-white hover:bg-purple-2/20 rounded-xl font-bold text-lg transition-all duration-300"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16 max-w-7xl">
                            {['React Components', 'Real-Time Updates', 'Cloud Deployment'].map((feature) => (
                                <div key={feature} className="bg-gray-2 backdrop-blur-lg p-6 rounded-xl hover:bg-purple-2 transition-all duration-300">
                                    <div className="text-purple-2 text-2xl mb-4">✨</div>
                                    <h3 className="text-white text-xl font-semibold mb-2">
                                        {feature}
                                    </h3>
                                    <p className="text-white">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="absolute bottom-0 py-6 text-center text-lightgray-2 text-sm">
                        © 2025 Reactify. All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}