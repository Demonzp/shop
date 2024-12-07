import { TServError } from "@/types/global";

export default function response<T>({data, typeErr, status}:{data:T, typeErr:TServError, status?:number}){
    return new Response(
        JSON.stringify(
            {
                data,
                typeErr
            }
        ),
        {
            status
        }
    );
}