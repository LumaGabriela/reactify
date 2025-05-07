import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            {/* Header com logo */}
            {/* <div className="w-full max-w-7xl px-6 mb-12">
                <div className="text-3xl font-bold text-purple-2">
                    REACTIFY
                </div>
            </div> */}

            <div className="bg-gray-2 p-8 rounded-xl shadow-xl w-full max-w-md">
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-1">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel 
                            htmlFor="email" 
                            value="Email" 
                            className="text-white"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-gray-1 border-gray-2 text-white focus:border-purple-2 focus:ring-purple-2"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel 
                            htmlFor="password" 
                            value="Password" 
                            className="text-white"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-gray-1 border-gray-2 text-white focus:border-purple-2 focus:ring-purple-2"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="border-gray-2 text-purple-2 focus:ring-purple-2"
                            />
                            <span className="ms-2 text-sm text-white">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-white hover:text-purple-2 transition-colors duration-200"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <PrimaryButton 
                            className="ms-4 bg-purple-2 hover:bg-purple-1 text-white"
                            disabled={processing}
                            dusk="login-button"
                        >
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}