import { SqliteConnection } from '../connections/SqliteConnection';
import { AbstractSqlDriver } from './AbstractSqlDriver';
import { Configuration } from '../utils';
export declare class SqliteDriver extends AbstractSqlDriver<SqliteConnection> {
    constructor(config: Configuration);
}
