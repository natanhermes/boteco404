import express from 'express';
import routes from './routes';

import './database';

class App {
  constructor() {
    // método que é chamado automaticamente quando instanciar a classe
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
