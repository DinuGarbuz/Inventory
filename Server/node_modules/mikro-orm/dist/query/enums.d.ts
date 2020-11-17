export declare enum QueryType {
    TRUNCATE = "TRUNCATE",
    SELECT = "SELECT",
    COUNT = "COUNT",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare enum QueryFlag {
    DISTINCT = "DISTINCT"
}
export declare enum QueryOrder {
    ASC = "ASC",
    DESC = "DESC",
    asc = "asc",
    desc = "desc"
}
export declare enum QueryOrderNumeric {
    ASC = 1,
    DESC = -1
}
export declare type QueryOrderKeysFlat = QueryOrder | QueryOrderNumeric | keyof typeof QueryOrder;
export declare type QueryOrderKeys = QueryOrderKeysFlat | QueryOrderMap;
export interface QueryOrderMap {
    [x: string]: QueryOrderKeys;
}
export interface FlatQueryOrderMap {
    [x: string]: QueryOrderKeysFlat;
}
