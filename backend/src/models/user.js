import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {

    static associate(models) {
      this.hasMany(models.Company, { foreignKey: 'userId', as: 'companies' });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true
    },
    nome: DataTypes.STRING,
    telefonePessoal: DataTypes.STRING,
    emailPessoal: DataTypes.STRING,
    dataNascimento: DataTypes.DATE,
    cpf: DataTypes.STRING,
    senha: DataTypes.STRING,
    tipo: {
      type: DataTypes.ENUM('admin', 'collaborator', 'user'),
      defaultValue: 'user',
      allowNull: false
    },
    possuiEmpresa: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};