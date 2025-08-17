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
const promises_1 = __importDefault(require("fs/promises"));
const axios_1 = __importDefault(require("axios"));
class ProductProcessor {
    readFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield promises_1.default.readFile('./base/products.json', 'utf8');
            const products = JSON.parse(data);
            return products;
        });
    }
    checkCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://posdesweb.igormaldonado.com.br/api/allowedCategory?category=${category}`);
                const isAllowed = response.data.allowed;
                return isAllowed;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let allowedProducts = [];
            try {
                const products = yield this.readFile();
                for (const product of products) {
                    const category = product.category;
                    const categoryIsAllowed = yield this.checkCategory(category);
                    if (categoryIsAllowed) {
                        const permissibleProduct = {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            pictureUrl: product.pictureUrl,
                            stock: product.stock
                        };
                        allowedProducts.push(permissibleProduct);
                    }
                    else {
                        console.warn(`Categoria ${product.category} não é permitida - produto ignorado`);
                    }
                }
                return allowedProducts;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.readFile();
            const productFound = findProductIndex(products, id);
            return productFound;
        });
    }
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.readFile();
            products.push(product);
            yield promises_1.default.writeFile('./base/products.json', JSON.stringify(products, null, 2));
            return product;
        });
    }
    updateProduct(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.readFile();
            const productFound = findProductIndex(products, id);
            if (productFound) {
                productFound.name = product.name;
                productFound.description = product.description;
                productFound.price = product.price;
                productFound.category = product.category;
                yield promises_1.default.writeFile('./base/products.json', JSON.stringify(products, null, 2));
                return productFound;
            }
            else {
                throw new Error('Product not found');
            }
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let products = yield this.readFile();
                const index = products.findIndex((product) => product.id === id) || null;
                if (index !== -1) {
                    products.splice(index, 1);
                    yield promises_1.default.writeFile('./base/products.json', JSON.stringify(products, null, 2));
                }
                else {
                    throw new Error('Product not found');
                }
            }
            catch (error) {
                console.error(error);
                throw new Error('Product not found');
            }
        });
    }
    setImage(id, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.readFile();
            const productFound = findProductIndex(products, id);
            productFound.pictureUrl = image;
            yield promises_1.default.writeFile('./base/products.json', JSON.stringify(products, null, 2));
            return true;
        });
    }
}
function findProductIndex(products, id) {
    const productFound = products.find((product) => product.id === id) || null;
    if (!productFound) {
        throw new Error('Product not found');
    }
    return productFound;
}
exports.default = ProductProcessor;
