import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Company extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(models.Employee, { foreignKey: 'companyId', as: 'employees' });
    }
  }
  Company.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cnpj: DataTypes.STRING,
    nomeFantasia: DataTypes.STRING,
    razaoSocial: DataTypes.STRING,
    atividadesExercidas: DataTypes.STRING,
    capitalSocial: DataTypes.DECIMAL,
    cep: DataTypes.STRING,
    endereco: DataTypes.STRING,
    numeroEmpresa: DataTypes.STRING,
    complementoEmpresa: DataTypes.STRING,
    emailEmpresa: DataTypes.STRING,
    telefoneEmpresa: DataTypes.STRING,
    socios: DataTypes.STRING,
    userId: {
      type: DataTypes.UUID, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};