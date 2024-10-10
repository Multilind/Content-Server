const modelFamilia = require("../../../src/models/Familia");
const modelLingua = require("../../../src/models/Lingua");
const modelConteudo = require("../../../src/models/Conteudo");

describe("\n## TESTES TRONCO\n", () => {
  const familiaName = "Macro-Jê123";
  const linguaNome = ["tupi-guarani", "tupi-guarani2"];

  describe("Listagem de Familia", () => {
    it("Listando com metodo getAll() com banco vazio", async () => {
      const familia = await modelFamilia.getAll();
      expect(familia.length).toEqual(0);
    });
    it("Listando com metodo searchByID(1) com banco vazio", async () => {
      const familia = await modelFamilia.searchById(1);
      expect(familia).toEqual(null);
    });
  });
  describe("Criação de Familia", () => {
    it("Criando familia com o metodo create() - 1", async () => {
      const familia = await modelFamilia.create({ nome: "Macro-Jê" });
      expect(familia).toMatchObject({
        id_familia: 1,
        nome: "Macro-Jê",
        id_conteudo: 8,
      });
    });
    it("Criando familia com o metodo create() - 2", async () => {
      const familia = await modelFamilia.create({ nome: "Macro-Jê1" });
      expect(familia).toMatchObject({
        id_familia: 2,
        nome: "Macro-Jê1",
        id_conteudo: 9,
      });
    });
  });
  describe("Atualização de Familia", () => {
    it("Atualizando familia, com o metodo editById({}, 1)", async () => {
      const result = await modelFamilia.editById({ nome: "Macro-Jê12" }, 1);
      expect(result).toEqual([1]);
    });
    it("Atualizando familia, com o metodo editById({}, 2)", async () => {
      const result = await modelFamilia.editById({ nome: familiaName }, 2);
      expect(result).toEqual([1]);
    });
  });
  describe("Listando após a Atualização de Familia", () => {
    it("listando familia, com o metodo searchById(1)", async () => {
      const familia = await modelFamilia.searchById(1);
      expect(familia).toMatchObject({
        id_familia: 1,
        nome: "Macro-Jê12",
        id_conteudo: 8,
        linguas: [],
      });
    });
    it("Listando familia, com o metodo searchById(2)", async () => {
      const familia = await modelFamilia.searchById(2);
      expect(familia).toMatchObject({
        id_familia: 2,
        nome: familiaName,
        id_conteudo: 9,
        linguas: [],
      });
    });
    it("Listando familia, com o metodo searchByName('Macro-Jê123')", async () => {
      const familia = await modelFamilia.searchByName("Macro-Jê123");
      expect(familia).toMatchObject({
        id_familia: 2,
        nome: familiaName,
        id_conteudo: 9,
      });
    });
  });
  // describe("Deleção de Familia", () => {
  //   it("Deletando Familia, com o metodo delete(8) através do conteudo", async () => {
  //     const result = await modelConteudo.delete(8);
  //     expect(result).toEqual(1);
  //   });
  // });
  describe("Relacionamento Lingua e Familia", () => {
    it("Criando lingua com um familia - 1", async () => {
      const linguas = await modelLingua.create({
        nome: linguaNome[0],
        id_familia: 2,
      });
      expect(linguas).toMatchObject({
        id_conteudo: 10,
        id_familia: 2,
        id_lingua: 4,
        nome: linguaNome[0],
      });
    });
    it("Listando familia com relacionamento searchById(2) - 1", async () => {
      const familia = await modelFamilia.searchById(2);
      expect(familia).toMatchObject({
        id_familia: 2,
        id_conteudo: 9,
        nome: familiaName,
        linguas: [
          {
            id_lingua: 4,
            id_conteudo: 10,
            nome: linguaNome[0],
          },
        ],
      });
    });
    it("Criando lingua com um familia - 2", async () => {
      const linguas = await modelLingua.create({
        nome: linguaNome[1],
        id_familia: 2,
      });
      expect(linguas).toMatchObject({
        id_conteudo: 11,
        id_familia: 2,
        id_lingua: 5,
        nome: linguaNome[1],
      });
    });
    it("Listando familia com relacionamento searchById(2) - 2", async () => {
      const familia = await modelFamilia.searchById(2);
      expect(familia).toMatchObject({
        id_familia: 2,
        id_conteudo: 9,
        nome: familiaName,
        linguas: [
          {
            id_lingua: 4,
            id_conteudo: 10,
            nome: linguaNome[0],
          },
          {
            id_lingua: 5,
            id_conteudo: 11,
            nome: linguaNome[1],
          },
        ],
      });
    });
    it("Resgatando familia com id da lingua", async () => {
      const familia = await modelFamilia.getFamilyByLanguage(4);
      expect(familia).toMatchObject({
        id_lingua: 4,
        nome: linguaNome[0],
        familia: {
          id_familia: 2,
          nome: familiaName,
        },
      });
    });
  });
});
