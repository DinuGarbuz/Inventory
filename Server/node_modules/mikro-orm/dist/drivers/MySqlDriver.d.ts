import { MySqlConnection } from '../connections/MySqlConnection';
import { AbstractSqlDriver } from './AbstractSqlDriver';
import { Configuration } from '../utils';
export declare class MySqlDriver extends AbstractSqlDriver<MySqlConnection> {
    constructor(config: Configuration);
}
