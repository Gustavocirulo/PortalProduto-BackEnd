#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Gerando chaves seguras para sua aplicação Azure\n');

// Gerar JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET:', jwtSecret);

// Gerar uma senha segura para o banco
const dbPassword = crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
console.log('DB_PASSWORD:', dbPassword);

// Gerar um salt para bcrypt (opcional)
const saltRounds = Math.floor(Math.random() * 5) + 10; // Entre 10-14
console.log('BCRYPT_SALT_ROUNDS:', saltRounds);

console.log('\n📋 Copie essas chaves para suas variáveis de ambiente no Azure!');
console.log('⚠️  NUNCA compartilhe essas chaves ou as coloque no código!');
