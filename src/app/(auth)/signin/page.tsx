"use client";

import { formDataToJson } from "@/app/lib/global";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Signin = () => {
    const searchParams = useSearchParams();
    const [valEmail, setValEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            console.log('email = ', email);
            setValEmail(email);
        }

    }, []);
    const onSubmit = async (formData: FormData) => {
        try {
            const res = await fetch('/users/auth/email', {
                method: 'POST',
                body: formDataToJson(formData)
            });

            const user = await res.json();
            console.log('user = ', user);
        }
        catch (err) {
            console.log('err = ', (err as Error).message);
        }
    }
    const preSubmit = (formData: FormData) => {
        setIsLoading(true);
        onSubmit(formData);
    }
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="next.svg"
                        className="mx-auto h-10 w-auto"
                    // width={64}
                    // height={64}
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Войти в свой аккаунт
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action={preSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Електронная почта
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={valEmail}
                                    onChange={(e) => setValEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Пароль
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Забыли пароль?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            {
                                !isLoading ?
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Войти
                                    </button>
                                    :
                                    null
                            }
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Не зарегистрированы?{' '}
                        <Link
                            href="/signup"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signin;