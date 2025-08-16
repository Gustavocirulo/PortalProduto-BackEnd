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
                yield database_1.default.schema.createTableIfNotExists('products', (table) => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                    table.text('description').notNullable();
                    table.decimal('price', 10, 2).notNullable();
                    table.string('category').notNullable();
                    table.string('pictureUrl');
                    table.timestamp('created_at').defaultTo(database_1.default.fn.now());
                    table.timestamp('updated_at').defaultTo(database_1.default.fn.now());
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
                yield database_1.default.schema.dropTable('products');
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        }));
    });
}
