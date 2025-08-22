import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pendente', 'em_andamento', 'atendido'),
      defaultValue: 'pendente',
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Contact',
  });
  return Contact;
};