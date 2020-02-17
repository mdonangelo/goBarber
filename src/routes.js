import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import authMiddleware from './app/middlewares/auth';

import multer from 'multer';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';

import ProviderController from './app/controllers/ProviderController';

const routes = new Router();
const upload = multer(multerConfig);

// Routes for user
routes.post('/users', UserController.store);

// Routes for session
routes.post('/sessions', SessionController.store);

// Middleware to autentication
routes.use(authMiddleware)

// Routes for users
routes.put('/users', UserController.update);

// Routes for files
routes.post('/files', upload.single('file'), FileController.store);

// Routes for provider
routes.get('/providers', ProviderController.index);

// Appointment
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

// Schedule
routes.get('/schedules', ScheduleController.index);

export default routes;
