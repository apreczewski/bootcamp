import { Router } from 'express';

const routes = new Router();

routes.post('/users', (request, response) =>{
  return response.json()
};


export default routes;
