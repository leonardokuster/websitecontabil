import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Employee extends Model {

    static associate(models) {
      this.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
      this.hasMany(models.Dependent, { foreignKey: 'employeeId', as: 'dependents' });
    }
  }
  Employee.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    sexo: DataTypes.STRING,
    corEtnia: DataTypes.STRING,
    dataNascimento: DataTypes.DATE,
    localNascimento: DataTypes.STRING,
    cpf: DataTypes.STRING,
    rg: DataTypes.STRING,
    orgaoExpedidor: DataTypes.STRING,
    dataRg: DataTypes.DATE,
    cep: DataTypes.STRING,
    endereco: DataTypes.STRING,
    numeroCasa: DataTypes.STRING,
    complementoCasa: DataTypes.STRING,
    bairro: DataTypes.STRING,
    cidade: DataTypes.STRING,
    estado: DataTypes.STRING,
    nomeMae: DataTypes.STRING,
    nomePai: DataTypes.STRING,
    escolaridade: DataTypes.STRING,
    estadoCivil: DataTypes.STRING,
    nomeConjuge: DataTypes.STRING,
    pis: DataTypes.STRING,
    numeroCt: DataTypes.STRING,
    serie: DataTypes.STRING,
    dataCt: DataTypes.DATE,
    carteiraDigital: DataTypes.BOOLEAN,
    tituloEleitoral: DataTypes.STRING,
    zona: DataTypes.STRING,
    secao: DataTypes.STRING,
    funcao: DataTypes.STRING,
    dataAdmissao: DataTypes.DATE,
    salario: DataTypes.DECIMAL,
    contratoExperiencia: DataTypes.BOOLEAN,
    horarios: DataTypes.STRING,
    insalubridade: DataTypes.BOOLEAN,
    periculosidade: DataTypes.BOOLEAN,
    quebraDeCaixa: DataTypes.BOOLEAN,
    valeTransporte: DataTypes.BOOLEAN,
    quantidadeVales: DataTypes.STRING,
    companyId: {
      type: DataTypes.UUID, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};