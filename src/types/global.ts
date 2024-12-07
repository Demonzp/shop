export type TObjAny = {[key:string]:any};

export type TServError = 'validation' | 'server';

export type TSerResponse = {
    data: any,
    typeErr: TServError
}

export interface IResponseBody {
    data: any;
    typeErr: TServError;
};