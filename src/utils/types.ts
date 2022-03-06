
type NoneMethodKeys<T> = {
    [P in keyof T]: T[P] extends ((...args) => any) ? never : P;
}[keyof T];

export type InterfaceOf<T> = Omit<T, Exclude<keyof T, NoneMethodKeys<T>>>;

export type ValuesOf<T extends any[]>= T[number];

export type DeepPartial<T> = {
    [P in keyof T]?:
        T[P] extends Array<infer U> ? Array<DeepPartial<U>> :
        T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> :
        DeepPartial<T[P]> | T[P]
};



export type IntersectionTypeWithArrays<T1, T2, arrayKeys extends (keyof T1 & keyof T2)> = (
    Omit<T1, arrayKeys> &
    Omit<T2, arrayKeys> & {
        [key in arrayKeys]: (
            (T1[key] extends Array<infer U1> ? U1 : never) &
            (T2[key] extends Array<infer U2> ? U2 : never)
        )[]
    }
);

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
