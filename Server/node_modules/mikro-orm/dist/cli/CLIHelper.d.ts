import { Argv } from 'yargs';
import { MikroORM } from '../MikroORM';
import { Configuration } from '../utils';
import { Dictionary } from '../typings';
import { IDatabaseDriver } from '../drivers';
export declare class CLIHelper {
    static getConfiguration<D extends IDatabaseDriver = IDatabaseDriver>(validate?: boolean, options?: Partial<Configuration>): Promise<Configuration<D>>;
    static getORM(warnWhenNoEntities?: boolean, opts?: Partial<Configuration>): Promise<MikroORM>;
    static configure(): Promise<Argv>;
    static getORMVersion(): string;
    static getNodeVersion(): string;
    static getDriverDependencies(): Promise<string[]>;
    static getPackageConfig(): Promise<Dictionary>;
    static getSettings(): Promise<Settings>;
    static dump(text: string, config?: Configuration, language?: string): void;
    static getConfigPaths(): Promise<string[]>;
    static dumpDependencies(): Promise<void>;
    static getModuleVersion(name: string): Promise<string>;
    static dumpTable(options: {
        columns: string[];
        rows: string[][];
        empty: string;
    }): void;
}
export interface Settings {
    useTsNode?: boolean;
    tsConfigPath?: string;
    configPaths?: string[];
}
