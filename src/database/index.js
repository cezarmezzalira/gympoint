import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';

import databaseConfig from '../config/database';

const models = [User, Student];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // cria a conexão com banco
    this.connection = new Sequelize(databaseConfig);

    // inicializa a conexão em cada model
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
