"use client";

import React from "react";

type Props = {
    error: Error & { digest?: string },
    reset: () => void
};

const GlobalError:React.FC<Props> = ({error, reset}) => {
    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
            </body>
        </html>
    );
};

export default GlobalError;