export default interface IOpcode {
    pc: number;
    pushData?: Buffer;
    name: string;
    opcode: number;
    fee: number;
    in: number;
    out: number;
    dynamic: boolean;
    async: boolean;
}
