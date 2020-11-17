import { Config } from 'knex';
import { AbstractSqlConnection } from './AbstractSqlConnection';
export declare class SqliteConnection extends AbstractSqlConnection {
    connect(): Promise<void>;
    getDefaultClientUrl(): string;
    getClientUrl(): string;
    loadFile(path: string): Promise<void>;
    protected getKnexOptions(type: string): Config;
    protected transformRawResult<T>(res: any, method: 'all' | 'get' | 'run'): T;
    /**
     * monkey patch knex' sqlite dialect so it returns inserted id when doing raw insert query
     */
    private getPatchedDialect;
    private getCallMethod;
}
