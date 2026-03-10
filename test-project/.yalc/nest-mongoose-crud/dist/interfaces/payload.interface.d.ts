interface IPayload {
    skip: number;
    take: number;
    order: {
        [key: string]: string;
    };
    filter: {
        [key: string]: string;
    };
    select: string[];
    relations: string[];
}
export default IPayload;
//# sourceMappingURL=payload.interface.d.ts.map