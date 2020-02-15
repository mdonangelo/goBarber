import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import multer from 'multer';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Middleware de verificação de autenticação
routes.use(authMiddleware)

// Rotas
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
