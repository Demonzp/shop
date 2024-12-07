"use client";

import ErrorComp from "@/app/components/errorComp";
import { formDataToObj, objKeyFromKebabCaseToCamelCase, objToJson } from "@/app/lib/global";
import { formRegisterZod } from "@/constants/authZod";
import { IResponseBody, TObjAny, TServError } from "@/types/global";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ZodIssue } from "zod";

const getZodIssue = (data: ZodIssue[], key: string):string[]=>{
    const msgs = [];
    for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(key===el.path[0]){
            msgs.push(el.message);
            //return el.message;
        }
    }
    return msgs;
}

const Signup = () => {
    const router = useRouter();
    const [isSubmit, setIsSubmit] = useState(false);
    const [errValid, setErrValid] = useState<ZodIssue[]>([]);
    const [err, setErr] = useState('');
    const refForm = useRef<HTMLFormElement>(null);

    const onSubmit = async (data: TObjAny) => {
        try{
            const res = await fetch('/users', {
                method: 'POST',
                body: objToJson(data)
            });
    
            //await res.json();
            if(!res.ok){
                //console.error(res.body);
                const dataError = await res.json() as IResponseBody;
                if(dataError.typeErr==='validation'){
                    setErrValid(dataError.data);
                }else{
                    setErr(dataError.data);
                }
                //console.error(dataError);
                return;
            }
            router.push('/signin');
        }catch(err){
            console.error('error = ', (err as Error).message);
            setErr((err as Error).message);
        }
        
        //console.log('newUser = ', newUser);
    };

    const preSubmit = ()=>{
        setErrValid([]);
        setErr('');
        const form = refForm.current;
        if(form){
            const elements = form.elements;
            const data:TObjAny = {};
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                if(el.nodeName==='INPUT'){
                    const elInput = el as HTMLInputElement;
                    data[elInput.name] = elInput.value;
                    //console.log((el as HTMLInputElement).name,'||',(el as HTMLInputElement).value);
                }
            }

            const normalData = objKeyFromKebabCaseToCamelCase(data);
            console.log('normalData = ', normalData);
            const validate = formRegisterZod.safeParse(normalData);
            if(!validate.success){
                console.log('validate.error = ', validate.error.issues);
                setErrValid(validate.error.issues);
            }else{
                onSubmit(normalData);
            }
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-5 mb-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <ErrorComp msg={err}/>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="next.svg"
                        className="mx-auto h-10 w-auto"
                    // width={64}
                    // height={64}
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Зарегистрировать новый аккаунт
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form 
                        ref={refForm}
                        className="space-y-6"
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                *Електронная почта
                            </label>
                            <div className="mt-2">
                                <div>
                                    {
                                        getZodIssue(errValid, 'email').map((msg,i)=>{
                                            return <label key={i} className="errorLabel">{msg}</label> 
                                        })
                                    }
                                </div>
                                
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                                *Имя
                            </label>
                            <div className="mt-2">
                                {
                                    getZodIssue(errValid, 'firstName').map((msg,i)=>{
                                        return <label key={i} className="errorLabel">{msg}</label> 
                                    })
                                }
                                <input
                                    id="first-name"
                                    name="first-name"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="second-name" className="block text-sm/6 font-medium text-gray-900">
                                Отчество
                            </label>
                            <div className="mt-2">
                                
                                <input
                                    id="second-name"
                                    name="second-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                                *Фамилия
                            </label>
                            <div className="mt-2">
                                {
                                    getZodIssue(errValid, 'lastName').map((msg,i)=>{
                                        return <label key={i} className="errorLabel">{msg}</label> 
                                    })
                                }
                                <input
                                    id="last-name"
                                    name="last-name"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                                *Телефон
                            </label>
                            <div className="mt-2">
                                {
                                    getZodIssue(errValid, 'phone').map((msg,i)=>{
                                        return <label key={i} className="errorLabel">{msg}</label> 
                                    })
                                }
                                <div className="flex items-center">
                                    <label className="pr-4">+380</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        required
                                        className="block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                *Пароль
                            </label>
                            <div className="mt-2">
                                <div className="columns-1">
                                    {
                                        getZodIssue(errValid, 'password').map((msg,i)=>{
                                            return (
                                                <div key={i}>
                                                    <label className="errorLabel">{msg}</label>
                                                </div>
                                            ); 
                                        })
                                    }
                                </div>
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
                            <label htmlFor="repeat-password" className="block text-sm/6 font-medium text-gray-900">
                                *Повторите пароль
                            </label>
                            <div className="mt-2">
                                {
                                    getZodIssue(errValid, 'repeatPassword').map((msg,i)=>{
                                        return <label key={i} className="errorLabel">{msg}</label> 
                                    })
                                }
                                <input
                                    id="repeat-password"
                                    name="repeat-password"
                                    type="password"
                                    required
                                    autoComplete="repeat-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Поля отмеченые " * " обязательны для заполнения
                            </label>
                        </div>

                        <div>
                            {
                                !isSubmit?
                                    <button
                                        type="button"
                                        //formAction={(e)=>{}}
                                        //onClick={(e)=>{}}
                                        onClick={preSubmit}
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Зарегистрироваться
                                    </button>
                                :
                                    null
                            }
                            
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Уже есть аккаунт?{' '}
                        <Link
                            href="/signin"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signup;