import React, { useEffect } from "react";

type Props = {
    msg: string
}

const ErrorComp:React.FC<Props> = ({msg})=>{
    useEffect(()=>{});

    return(
        <>
            {
                msg!==''?
                <p className="errorLabel">Что то пошло не так, наши техники уже выехали!</p>
                :
                null
            }
            
        </>
    );
};

export default ErrorComp;