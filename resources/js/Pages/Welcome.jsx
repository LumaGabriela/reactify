import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js'
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome to Reactify" />
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-7xl px-6">
                        {/* Header */}
                        <header className="absolute top-0 left-0 right-0 py-6 px-6 flex justify-between items-center">
                            <div className="text-2xl font-bold text-white">
                                REACTIFY
                            </div>
                            <nav className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-300"
                                        >
                                            Registre
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Hero Section */}
                        <div className="flex flex-col items-center text-center py-32">
                            <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in-up">
                                Build Amazing Apps with{" "}
                                <span className="text-blue-200">Reactify</span>
                            </h1>
                            <p className="text-xl text-white/80 mb-12 max-w-3xl">
                                Accelerate your React development with our powerful
                                toolkit. Create, manage, and deploy React applications
                                faster than ever before.
                            </p>

                            <div className="flex gap-4 mb-16">
                                <Link
                                    href={route('register')}
                                    className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Start Free Trial
                                </Link>
                                <Link
                                    href="#features"
                                    className="px-8 py-4 border-2 border-white/30 text-white hover:border-white/50 rounded-xl font-bold text-lg transition-all duration-300"
                                >
                                    Explore Features
                                </Link>
                            </div>

                            {/* Feature Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16">
                                {['React Components', 'Real-Time Updates', 'Cloud Deployment'].map((feature) => (
                                    <div key={feature} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:bg-white/20 transition-all duration-300">
                                        <div className="text-blue-200 text-2xl mb-4">✨</div>
                                        <h3 className="text-white text-xl font-semibold mb-2">
                                            {feature}
                                        </h3>
                                        <p className="text-white/70">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="absolute bottom-0 left-0 right-0 py-6 text-center text-white/50 text-sm">
                            © 2024 Reactify. All rights reserved.
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}