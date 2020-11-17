import { MySqlConnectionConfig } from 'knex';
import { AbstractSqlConnection } from './AbstractSqlConnection';
export declare class MySqlConnection extends AbstractSqlConnection {
    connect(): Promise<void>;
    getDefaultClientUrl(): string;
    getConnectionOptions(): MySqlConnectionConfig;
    protected transformRawResult<T>(res: any, method: 'all' | 'get' | 'run'): T;
}
