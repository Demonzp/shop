import { z } from "zod";

const passwordValidation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]*)[A-Za-z\d@$!%*?&]{8,}$/
);

export const formRegisterZod = z.object({
    email: z.string().email({ message: 'Введите корректную почту' }),
    firstName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }),
    secondName: z.string().optional(),
    lastName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }),
    phone: z.string().min(9, { message: 'Введите корректный номер телефона' }),
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