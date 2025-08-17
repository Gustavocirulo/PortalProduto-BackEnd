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
exports.seed = seed;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield trx('users').insert({
                    name: 'Lucas',
                    email: 'gustavocirulo@hotmail.com',
                    password: yield hashPassword('123456')
                });
                yield trx('users').insert({
                    name: 'Administrador',
                    email: 'admin',
                    password: yield hashPassword('admin')
                });
                yield trx('roles').insert({
                    name: 'admin'
                });
                yield trx('roles').insert({
                    name: 'user'
                });
                yield trx('user_roles').insert({
                    user_id: 1,
                    role_id: 1
                });
                yield trx('user_roles').insert({
                    user_id: 1,
                    role_id: 2
                });
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        }));
    });
}
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, 10);
    });
}
