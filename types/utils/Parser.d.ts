/// <reference types="node" />
export declare enum FieldType {
    u8 = 0,
    u32 = 1,
    u64 = 2,
    f64 = 3
}
export declare const TYPE_TO_LENGTH: {
    [type in FieldType]: number;
};
declare class FieldDecl {
    name: string;
    type: FieldType;
    constructor(name: string, type: FieldType);
    getLength(): number;
}
export declare class Parser {
    fields: FieldDecl[];
    nameToField: {
        [name: string]: FieldDecl;
    };
    constructor(fields?: FieldDecl[]);
    addField(field: FieldDecl): void;
    u8(name: string): Parser;
    u32(name: string): Parser;
    u64(name: string): Parser;
    f64(name: string): Parser;
    getLength(): number;
    encode(object: any): Buffer;
}
export {};
