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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database/database"));
class ProductsRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const products = yield trx('products');
                    return products;
                }
                catch (error) {
                    yield trx.rollback();
                    throw new Error('Error fetching products');
                }
            }));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const product = yield trx('products').where('id', id).first();
                    return product;
                }
                catch (error) {
                    yield trx.rollback();
                    throw new Error('Error fetching product');
                }
            }));
        });
    }
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const newProduct = yield trx('products').insert(product).returning('*');
                    return newProduct[0];
                }
                catch (error) {
                    yield trx.rollback();
                    throw new Error('Error creating product');
                }
            }));
        });
    }
    update(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Remove o campo id do objeto product antes de atualizar
                    const { id: _ } = product, productData = __rest(product, ["id"]);
                    const updatedProduct = yield trx('products').where('id', id).update(productData).returning('*');
                    return updatedProduct[0];
                }
                catch (error) {
                    yield trx.rollback();
                    throw new Error('Error updating product');
                }
            }));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield trx('products').where('id', id).delete();
                }
                catch (error) {
                    yield trx.rollback();
                    throw new Error('Error deleting product');
                }
            }));
        });
    }
}
exports.default = new ProductsRepository();
