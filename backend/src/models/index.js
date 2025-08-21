import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; 
import Sequelize from 'sequelize';
import process from 'process';
import configFile from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
  })
  .catch(error => {
    console.error("Erro ao conectar com o banco de dados:", error);
  });

const fileNames = fs
  .readdirSync(__dirname)
  .filter(file => (
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js') &&
    !file.startsWith('.')
  ));

for (const file of fileNames) {
  
  const modelPath = path.join(__dirname, file);
  const modelURL = pathToFileURL(modelPath).href;
  const { default: model } = await import(modelURL);
  
  const modelInstance = model(sequelize, Sequelize.DataTypes);
  db[modelInstance.name] = modelInstance;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize };
export default db;