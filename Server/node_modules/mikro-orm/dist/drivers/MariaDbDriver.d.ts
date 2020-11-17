import { MariaDbConnection } from '../connections/MariaDbConnection';
import { AbstractSqlDriver } from './AbstractSqlDriver';
import { Configuration } from '../utils';
export declare class MariaDbDriver extends AbstractSqlDriver<MariaDbConnection> {
    constructor(config: Configuration);
}
