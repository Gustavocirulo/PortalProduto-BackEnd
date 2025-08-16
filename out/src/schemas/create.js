"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createProductSchema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            pictureUrl: { type: 'string' },
        },
        required: ['id', 'name', 'description', 'price', 'category', 'pictureUrl'],
    },
    response: {
        201: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: { type: 'object' },
            },
        },
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }
            },
        },
    }
};
exports.default = createProductSchema;
