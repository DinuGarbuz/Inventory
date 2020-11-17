import { DatabaseTable } from './DatabaseTable';
import { AbstractSqlDriver } from '../drivers';
import { Configuration } from '../utils';
export declare class EntityGenerator {
    private readonly driver;
    private readonly config;
    private readonly platform;
    private readonly helper;
    private readonly connection;
    private readonly namingStrategy;
    private readonly project;
    private readonly sources;
    constructor(driver: AbstractSqlDriver, config: Configuration);
    generate(options?: {
        baseDir?: string;
        save?: boolean;
    }): Promise<string[]>;
    createEntity(table: DatabaseTable): Promise<void>;
    private getPropertyDefinition;
    private getPropertyDecorator;
    private getPropertyIndexes;
    private getCommonDecoratorOptions;
    private getScalarPropertyDecoratorOptions;
    private getForeignKeyDecoratorOptions;
    private getDecoratorType;
}
