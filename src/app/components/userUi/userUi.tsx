import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";

function getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
};

const UserUi = () => {
    const pathName = usePathname();
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        //console.log();
        const cookie = getCookie('isAuth');
        if (cookie&&cookie==='true') {
            setIsAuth(true);
        }
        setIsLoading(false);
    }, []);

    return (
        <>
            {
                isLoading ?
                    <Loading /> :
                    isAuth ?
                        <label>Profile</label>
                        :
                        <>
                            <Link
                                href={"/signin"}
                                className={classNames(
                                    pathName === "/signin" ? 'bg-gray-500 text-white' : 'text-black hover:bg-gray-400 hover:text-white',
                                    'rounded-md px-1 py-2 mr-4 text-sm font-medium',
                                )}
                            //className={"pr-4 text-sm font-medium text-gray-700 hover:text-gray-800"}
                            >
                                Войти
                            </Link>
                            <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                            <Link
                                href={"/signup"}
                                className={classNames(
                                    pathName === "/signup" ? 'bg-gray-500 text-white' : 'text-black hover:bg-gray-400 hover:text-white',
                                    'rounded-md px-1 py-2 ml-4 text-sm font-medium',
                                )}
                            >
                                Регистрация
                            </Link>
                        </>
            }
        </>
    );
};

export default UserUi;