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
exports.routes = routes;
const fastify_1 = __importDefault(require("fastify"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("stream/promises");
const products_1 = __importDefault(require("./repository/products"));
const user_1 = __importDefault(require("./repository/user"));
const authentication_1 = __importDefault(require("./auth/authentication"));
const cors_1 = __importDefault(require("@fastify/cors"));
const glob_1 = require("glob");
const server = (0, fastify_1.default)({
    logger: {
        level: 'debug',
    }
});
server.register(multipart_1.default, {
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});
// Endpoint customizado para servir imagens sem precisar da extensão
const axios_1 = __importDefault(require("axios"));
server.get('/products/image/:filename', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = request.params;
    const imageDir = path_1.default.join(__dirname, '..', 'tmp/images');
    // Procura por qualquer extensão de imagem
    const files = (0, glob_1.globSync)(`${imageDir}/${filename}.*`);
    if (files.length > 0) {
        const filePath = files[0];
        return reply.send(fs_1.default.createReadStream(filePath));
    }
    // Se não encontrar localmente, busca o produto no banco
    const product = yield products_1.default.findById(Number(filename));
    if (product && product.pictureUrl) {
        try {
            const response = yield axios_1.default.get(product.pictureUrl, { responseType: 'stream' });
            reply.header('Content-Type', response.headers['content-type'] || 'image/jpeg');
            return reply.send(response.data);
        }
        catch (err) {
            // continua para imagem padrão
        }
    }
    // Se não encontrar nada, retorna imagem padrão
    const defaultImagePath = path_1.default.join(imageDir, 'NO_IMAGE_FOUND.png');
    if (fs_1.default.existsSync(defaultImagePath)) {
        return reply.send(fs_1.default.createReadStream(defaultImagePath));
    }
    else {
        return reply.status(404).send({ message: 'Imagem não encontrada' });
    }
}));
server.addHook('onRequest', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    server.log.debug({ method: request.method, url: request.url }, 'Request received');
}));
server.addHook('preHandler', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    server.log.info({ params: request.params, query: request.query }, 'Request received');
}));
server.addHook('onResponse', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    server.log.info({
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        time: reply.elapsedTime + 'ms',
    }, 'Response sent');
}));
server.addHook('onError', (request, reply, error) => __awaiter(void 0, void 0, void 0, function* () {
    server.log.error({
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        error: error.message,
    }, 'Error');
}));
function routes(fastify, options) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.register(cors_1.default, {
            origin: '*', // Permite todas as origens
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
        });
        fastify.decorate('authMiddleware', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const token = request.headers.authorization;
            if (!token) {
                return reply.status(401).send({ message: 'Token not found' });
            }
            try {
                const decoded = authentication_1.default.verifyToken(token);
                request.user = decoded;
            }
            catch (err) {
                return reply.status(401).send({ message: err.message });
            }
        }));
        fastify.decorate('requireRole', (allowedRoles) => {
            const allowedRolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
            return (request, reply) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const userRoles = ((_a = request.user) === null || _a === void 0 ? void 0 : _a.roles) || ((_b = request.user) === null || _b === void 0 ? void 0 : _b.role) || [];
                const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
                const ok = roles.some(role => allowedRolesList.includes(role));
                if (!ok) {
                    return reply.status(403).send({ message: 'insufficient permissions' });
                }
                return request;
            });
        });
        fastify.get('/products', {
            preHandler: [fastify.authMiddleware, fastify.requireRole('admin')]
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield products_1.default.findAll();
                reply.status(200).send({
                    success: true,
                    message: 'Products fetched successfully',
                    data: products
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: 'Error fetching products'
                });
            }
        }));
        fastify.get('/products/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            try {
                const product = yield products_1.default.findById(id);
                reply.status(200).send({
                    success: true,
                    message: 'Product fetched successfully',
                    data: product
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: 'Error fetching product'
                });
            }
        }));
        fastify.post('/products/create', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const product = request.body;
            try {
                const newProduct = yield products_1.default.create(product);
                reply.status(201).send({
                    success: true,
                    message: 'Product created successfully',
                    data: newProduct
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: 'Error creating product'
                });
            }
        }));
        fastify.put('/products/update/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const product = request.body;
            try {
                const updatedProduct = yield products_1.default.update(id, product);
                reply.status(200).send({
                    success: true,
                    message: 'Product updated successfully',
                    data: updatedProduct
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: 'Error updating product'
                });
            }
        }));
        fastify.delete('/products/delete/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            try {
                yield products_1.default.delete(id);
                reply.status(200).send({
                    success: true,
                    message: 'Product deleted successfully'
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: 'Error deleting product'
                });
            }
        }));
        fastify.put('/products/upload_image/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const data = yield request.file();
            try {
                if (!data.mimetype.startsWith('image/')) {
                    reply.status(400).send({
                        success: false,
                        message: 'Only image files are allowed',
                        data: null
                    });
                    return;
                }
                data.fieldname = id.toString() + '.' + data.mimetype.split('/')[1];
                const destination = path_1.default.join(__dirname, '..', 'tmp/images');
                const save_path = path_1.default.join(destination, data.fieldname);
                yield fs_1.default.promises.mkdir(destination, { recursive: true });
                yield (0, promises_1.pipeline)(data.file, fs_1.default.createWriteStream(save_path));
                const server_address = server.server.address();
                const image_url = "http://" + server_address.address + ':' + server_address.port + '/products/image/' + data.fieldname;
                yield products_1.default.update(id, { pictureUrl: image_url });
                reply.status(200).send({
                    success: true,
                    message: 'Image uploaded successfully',
                    data: save_path
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: 'Error uploading image'
                });
            }
        }));
        fastify.post('/login', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            try {
                const user = yield user_1.default.findByEmailAndPassword(email, password);
                const tokens = new authentication_1.default(user).mountToken();
                reply.status(200).send({
                    success: true,
                    data: tokens,
                    message: 'Login successful'
                });
            }
            catch (error) {
                reply.status(400).send({
                    success: false,
                    data: null,
                    message: error
                });
            }
        }));
    });
}
//   fastify.get('/products/:id', async (request: FastifyRequest, reply: FastifyReply) => {
//     const { id } = request.params as { id: number };
//     const product = await processor.getProductById(id);
//     try {
//       reply.status(200).send({
//         success: true,
//         message: 'Product fetched successfully',
//         data: product
//       });
//     } catch (error) {
//       reply.status(400).send({
//         success: false,
//         data: product,
//         message: 'Error fetching product'
//       });
//     }
//   });
//   fastify.post('/products/create', { schema: createProductSchema }	, async (request: FastifyRequest, reply: FastifyReply) => {
//     try {
//       const product = await processor.createProduct(request.body as Product);
//       return {message: 'Product created successfully', data: product, success: true}
//     } catch (error) {
//       return {message: 'Error creating product', success: false}
//     }
//   });
//   fastify.put('/products/update/:id', async (request: FastifyRequest, reply: FastifyReply) => {
//     const { id } = request.params as { id: number };
//     const product = await processor.updateProduct(id, request.body as Product);
//     try {
//       reply.status(200).send({
//         success: true,
//         message: 'Product updated successfully',
//         data: product
//       });
//     } catch (error) {
//       reply.status(400).send({
//         success: false,
//         data: null,
//         message: 'Error updating product'
//       });
//     }
//   });
//   fastify.delete('/products/delete/:id', async (request: FastifyRequest, reply: FastifyReply) => {
//     const { id } = request.params as { id: number };
//     const product = await processor.deleteProduct(id);
//     console.log(id);
//     try {
//       reply.status(200).send({
//         success: true,
//         message: 'Product deleted successfully',
//         data: product
//       });
//     } catch (error) {
//       reply.status(400).send({
//         success: false,
//         data: product,
//         message: 'Error deleting product'
//       });
//     }
//   });
//   fastify.put('/products/upload_image/:id', async (request: FastifyRequest, reply: FastifyReply) => {
//     const { id } = request.params as { id: number };
//     const data = await request.file() as MultipartFile;
//     if (!data.mimetype.startsWith('image/')) {
//       reply.status(400).send({
//         success: false,
//         message: 'Only image files are allowed',
//         data: null
//       });
//       return;
//     }
//     data.fieldname = id.toString() + '.' + data.mimetype.split('/')[1];
//     const destination = path.join(__dirname, '..', 'tmp/images');
//     const save_path = path.join(destination, data.fieldname);
//     await fs.promises.mkdir(destination, { recursive: true }); 
//     await pipeline(data.file, fs.createWriteStream(save_path));
//     const server_address = server.server.address() as AddressInfo;
//     const image_url = "http://" + server_address.address + ':' + server_address.port + '/products/image/' + data.fieldname;
//     await processor.setImage(id, image_url);
//     reply.status(200).send({
//       success: true,
//       message: 'Image uploaded successfully',
//       data: save_path
//     });
//   });
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Azure App Service usa a variável PORT
        const port = Number(process.env.PORT) || 8081;
        const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
        yield server.listen({ port, host });
        console.log(`🚀 Server running on ${host}:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
server.register(routes);
start();
// const processor = new ProductProcessor();
// processor.main();
