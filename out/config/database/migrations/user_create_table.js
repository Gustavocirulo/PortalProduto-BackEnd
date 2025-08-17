"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const database_1 = __importDefault(require("../database"));
function up() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default.schema.createTableIfNotExists('users', (table) => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                    table.string('email').notNullable();
                    table.string('password').notNullable();
                });
                yield database_1.default.schema.createTableIfNotExists('roles', (table) => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                });
                yield database_1.default.schema.createTableIfNotExists('user_roles', (table) => {
                    table.increments('id').primary();
                    table.integer('user_id').notNullable();
                    table.integer('role_id').notNullable();
                });
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        }));
    });
}
function down() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default.schema.dropTable('users');
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        }));
        yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default.schema.dropTable('roles');
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        }));
        yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default.schema.dropTable('user_roles');
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        }));
    });
}
