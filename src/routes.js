import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Inclusão de Aluno apenas com autenticação
routes.post('/sessions', SessionController.store);

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Mezzalira' });
});

routes.use(authMiddleware);

routes.post('/student', StudentController.store);

routes.put('/student/:id', StudentController.update);

export default routes;
