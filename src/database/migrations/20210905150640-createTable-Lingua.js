/* istanbul ignore file */

const { PrimaryKey, StringNotNull } = require("../Object");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable("Lingua", {
        id_lingua: PrimaryKey(Sequelize),
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
        id_familia: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "Familia",
            key: "id_familia",
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        },
        nome: StringNotNull(Sequelize),
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Lingua");
  },
};
