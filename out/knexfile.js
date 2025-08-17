"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "5432"),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
        migrations: {
            directory: "./config/database/migrations",
            extension: "ts"
        },
        seeds: {
            directory: "./config/database/seeds",
            extension: "ts"
        }
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        } : {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "5432"),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        },
        migrations: {
            directory: "./config/database/migrations",
            extension: "ts"
        },
        seeds: {
            directory: "./config/database/seeds",
            extension: "ts"
        }
    }
};
exports.default = config;
