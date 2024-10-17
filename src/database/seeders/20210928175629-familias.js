"use strict";
/* istanbul ignore file */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "Familia",
      [
        {
          nome: "línguas arauanas",
          id_conteudo: 13,
        },
        {
          nome: "línguas aruaques",
          id_conteudo: 14,
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Familia", null, {});
  },
};
