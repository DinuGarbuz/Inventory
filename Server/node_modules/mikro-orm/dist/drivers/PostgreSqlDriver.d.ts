import { PostgreSqlConnection } from '../connections/PostgreSqlConnection';
import { AbstractSqlDriver } from './AbstractSqlDriver';
import { Configuration } from '../utils';
export declare class PostgreSqlDriver extends AbstractSqlDriver<PostgreSqlConnection> {
    constructor(config: Configuration);
}
