import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Dependent extends Model {

    static associate(models) {
      this.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });
    }
  }
  Dependent.init({
    nomeDependente: DataTypes.STRING,
    dataNascimentoDependente: DataTypes.DATE,
    cpfDependente: DataTypes.STRING,
    localNascimentoDependente: DataTypes.STRING,
    employeeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dependent',
  });
  return Dependent;
};