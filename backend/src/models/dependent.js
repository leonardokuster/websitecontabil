import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Dependent extends Model {

    static associate(models) {
      this.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });
    }
  }
  Dependent.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nomeDependente: DataTypes.STRING,
    dataNascimentoDependente: DataTypes.DATE,
    cpfDependente: DataTypes.STRING,
    localNascimentoDependente: DataTypes.STRING,
    employeeId: {
      type: DataTypes.UUID, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Dependent',
  });
  return Dependent;
};