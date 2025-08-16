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
const products_1 = __importDefault(require("../../repository/products"));
const database_1 = __importDefault(require("../../../config/database/database"));
jest.mock('../../../config/database/database', () => ({
    transaction: jest.fn((callback) => {
        const mockTrx = (tableName) => {
            const queryBuilder = {
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue({
                    id: 1,
                    name: 'Produto Teste',
                    description: 'Descrição Teste',
                    price: 10.5,
                    category: 'Categoria Teste',
                    pictureUrl: 'http://localhost:3000/produto.jpg'
                })
            };
            return queryBuilder;
        };
        mockTrx.rollback = jest.fn();
        mockTrx.destroy = jest.fn();
        mockTrx.commit = jest.fn();
        return callback(mockTrx);
    })
}));
describe('ProductsRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('findById', () => {
        it('deve retornar um produto pelo id', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 1;
            const result = yield products_1.default.findById(id);
            expect(result).toEqual({
                id: 1,
                name: 'Produto Teste',
                description: 'Descrição Teste',
                price: 10.5,
                category: 'Categoria Teste',
                pictureUrl: 'http://localhost:3000/produto.jpg'
            });
            expect(database_1.default.transaction).toHaveBeenCalledTimes(1);
        }));
    });
});
