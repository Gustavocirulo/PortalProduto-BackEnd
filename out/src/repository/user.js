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
const database_1 = __importDefault(require("../../config/database/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.default)('users').where('email', email).first();
        });
    }
    findByEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_data;
            try {
                user_data = yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield trx('users')
                        .select('users.*', 'roles.name as role')
                        .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
                        .leftJoin('roles', 'roles.id', 'user_roles.role_id')
                        .where('users.email', email)
                        .first();
                    if (!user) {
                        throw new Error('Usuário não encontrado');
                    }
                    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                    if (!isPasswordValid) {
                        throw new Error('Senha inválida');
                    }
                    return user;
                }));
                console.log(user_data.role);
                return user_data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new UserRepository();
