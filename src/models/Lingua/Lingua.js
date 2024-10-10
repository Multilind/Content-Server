const databaseConfig = require("../../config/database");
const Conteudo = require("../Conteudo/Conteudo");
const Familia = require("../Familia/Familia");

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(databaseConfig);

const Lingua = sequelize.define(
  "Lingua",
  {
    id_lingua: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_familia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Familia",
        key: "id_familia",
      },
      onUpdate: "SET NULL",
      onDelete: "SET NULL",
    },
    id_conteudo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Conteudo",
        key: "id_conteudo",
      },
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    glottocode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nomes_alternativos: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Lingua",
    timestamps: false,
  }
);

Lingua.hasOne(Conteudo, {
  foreignKey: "id_conteudo",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  sourceKey: "id_conteudo",
});
Lingua.hasOne(Familia, {
  foreignKey: "id_familia",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  sourceKey: "id_familia",
  as: "familia",
});
Familia.hasMany(Lingua, {
  foreignKey: "id_familia",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  sourceKey: "id_familia",
  as: "linguas",
});
module.exports = Lingua;
