import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration';

import databaseConfig from '../config/database';

const models = [User, Student, Plan, Registration];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // cria a conexão com banco
    this.connection = new Sequelize(databaseConfig);

    // inicializa a conexão em cada model
    models
      .map(model => model.init(this.connection))
      // faz as associações entre os models, expondo pro sequelize os relacionamentos
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
