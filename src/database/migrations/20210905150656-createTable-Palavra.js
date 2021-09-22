"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable("Palavra", {
        id_palavra: {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        id_lingua: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Lingua",
            key: "id_lingua",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        id_conteudo: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Conteudo",
            key: "id_conteudo",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        nome: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        significado: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Palavra");
  },
};