"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Authentication {
    constructor(user) {
        this.user = user;
    }
    mountToken() {
        return {
            access_token: this.generateToken(this.user),
            refresh_token: this.generateRefreshToken(this.user)
        };
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, type: 'access' }, process.env.JWT_SECRET || '', { expiresIn: '1d', algorithm: 'HS256' });
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            if (decoded instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error('Token expired');
            }
            else if (decoded instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            return decoded;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, type: 'refresh' }, process.env.JWT_SECRET || '', { expiresIn: '7d', algorithm: 'HS256' });
    }
}
exports.default = Authentication;
