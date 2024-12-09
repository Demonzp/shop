import { z } from "zod";

const passwordValidation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]*)[A-Za-z\d@$!%*?&]{8,}$/
);

export const formRegisterZod = z.object({
    email: z.string().email({ message: 'Введите корректную почту' }),
    firstName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }).max(80, {message: 'Имя должно содержать не более 80 символов'}),
    secondName: z.string().optional(),
    lastName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }).max(80, {message: 'Имя должно содержать не более 80 символов'}),
    phone: z.string().superRefine((phone, ctx)=>{
        if(phone.length===0){
            return;
        }
        if(!phone.match(/^[0-9]{3,12}$/g)||phone.length<9||phone.length>12){
            ctx.addIssue({
                code: z.ZodIssueCode.custom, // customize your issue
                message: "Введите коректный номер телефона",
            });
        }
        return z.NEVER;
    }),
    password: z
        .string()
        .min(8, { message: 'Пароль должен иметь не мение 8 символов' })
        .regex(passwordValidation, {
            message: `Пароль может состоять из латинских символов, цыфр и спецсимволов "@$!%*?&" и должен иметь:
                - не менее 8 и не более 16 символов
                - иметь хотябы 1 цыфру 1 маленький символ латиницы 1 большой символ латиницы
            `
        }),
    repeatPassword: z.string(),
})
.refine((data)=>data.password===data.repeatPassword, {
    message: "Пароль не верный",
    path: ["repeatPassword"], // path of error
});

export type TFormRegisterZod = z.infer<typeof formRegisterZod>;

export const formLoginZod = z.object({
    email: z.string().email({ message: 'Введите корректную почту' }),
    password: z
        .string()
        .min(8, { message: 'Пароль должен иметь не мение 8 символов' })
        .regex(passwordValidation, {
            message: `Пароль может состоять из латинских символов, цыфр и спецсимволов "@$!%*?&" и должен иметь:
                - не менее 8 и не более 16 символов
                - иметь хотябы 1 цыфру 1 маленький символ латиницы 1 большой символ латиницы
            `
        }),
});

export type TFormLoginZod = z.infer<typeof formLoginZod>;