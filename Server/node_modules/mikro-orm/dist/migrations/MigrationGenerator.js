"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const ts_morph_1 = require("ts-morph");
const utils_1 = require("../utils");
class MigrationGenerator {
    constructor(driver, options) {
        this.driver = driver;
        this.options = options;
        this.project = new ts_morph_1.Project();
        this.project.manipulationSettings.set({ quoteKind: ts_morph_1.QuoteKind.Single, indentationText: ts_morph_1.IndentationText.TwoSpaces });
    }
    async generate(diff, path) {
        path = utils_1.Utils.normalizePath(path || this.options.path);
        await fs_extra_1.ensureDir(path);
        const time = new Date().toISOString().replace(/[-T:]|\.\d{3}z$/ig, '');
        const className = `Migration${time}`;
        const fileName = `${className}.${this.options.emit}`;
        const migration = this.project.createSourceFile(path + '/' + fileName, writer => {
            if (this.options.emit === 'js') {
                this.generateJSMigrationFile(writer, className, diff);
            }
            else {
                this.generateTSMigrationFile(writer, className, diff);
            }
        });
        const ret = migration.getFullText();
        await fs_extra_1.writeFile(migration.getFilePath(), ret);
        return [ret, fileName];
    }
    createStatement(writer, sql) {
        if (sql) {
            writer.writeLine(`this.addSql('${sql.replace(/'/g, '\\\'')}');`); // lgtm [js/incomplete-sanitization]
        }
        else {
            writer.blankLine();
        }
    }
    generateJSMigrationFile(writer, className, diff) {
        writer.writeLine(`'use strict';`);
        writer.writeLine(`Object.defineProperty(exports, '__esModule', { value: true });`);
        writer.writeLine(`const Migration = require('mikro-orm').Migration;`);
        writer.blankLine();
        writer.write(`class ${className} extends Migration`);
        writer.block(() => {
            writer.blankLine();
            writer.write(`async up()`);
            writer.block(() => diff.forEach(sql => this.createStatement(writer, sql)));
            writer.blankLine();
        });
        writer.writeLine(`exports.${className} = ${className};`);
        writer.write('');
    }
    generateTSMigrationFile(writer, className, diff) {
        writer.writeLine(`import { Migration } from 'mikro-orm';`);
        writer.blankLine();
        writer.write(`export class ${className} extends Migration`);
        writer.block(() => {
            writer.blankLine();
            writer.write('async up(): Promise<void>');
            writer.block(() => diff.forEach(sql => this.createStatement(writer, sql)));
            writer.blankLine();
        });
        writer.write('');
    }
}
exports.MigrationGenerator = MigrationGenerator;
