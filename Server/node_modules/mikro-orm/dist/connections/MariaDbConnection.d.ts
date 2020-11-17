import { MySqlConnection } from './MySqlConnection';
export declare class MariaDbConnection extends MySqlConnection {
    connect(): Promise<void>;
    private getPatchedDialect;
}
