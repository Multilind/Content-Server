const supertest = require("supertest");
import app from '../../../src/app'
const modelLingua = require("../../../src/models/Lingua");


describe("Testes Familia", () => {
  describe("Testes de criação de Familia", () => {
    it("Familia - 200 - Criado com sucesso", async () => {
      const data = { nome: "Familia-test" };
      const result = await supertest(app).post("/familia").send(data);
      expect(result.status).toStrictEqual(200);
      expect(result.body).toBeTruthy();
    });

    it("Familia - 400 - Nome Existente", async () => {
      const data = { nome: "Familia-test" };
      const result = await supertest(app).post("/familia").send(data);

      expect(result.status).toStrictEqual(400);
      expect(result.body).toMatchObject({
        error: "Nome já existente - Familia - Familia-test",
      });
    });

    it("Familia - 400 - Nome Vazio", async () => {
      const data = { nome: "" };
      const result = await supertest(app).post("/familia").send(data);

      expect(result.status).toStrictEqual(400);
      expect(result.body).toMatchObject({
        error: "Nome inválido - Familia - ",
      });
    });
  });

  describe("Testes de listagem Familia", () => {
    let lingua; 
  
    beforeAll(async () => {
      lingua = await modelLingua.create({ nome: "tupi-guarani" });
    });
    it("Familia - 200 - listando com sucesso - Por ID", async () => {
      const result = await supertest(app).get("/familia/1");

      expect(result.status).toStrictEqual(200);
   
    });
    it("Familia - 200 - listando com sucesso - Todos", async () => {
      const result = await supertest(app).get("/familias");

      expect(result.status).toStrictEqual(200);
      expect(result.body.length).toBeTruthy();

    });

    it("Familia - 200 - listando com sucesso - Todos", async () => {
      const result = await supertest(app).get(`/familia/lingua/${lingua.id_lingua}`);

      expect(result.status).toStrictEqual(200);
    });
  });

  describe("Testes de atualização de Familia", () => {
    it("Familia - 200 - Atualizando com sucesso - Por ID", async () => {
      const data = {
        nome: "Familia-test2",
      };
      supertest(app)
        .put("/familia/1")
        .send(data)
        .then(async (result) => {
          expect(result.status).toStrictEqual(200);
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe("Testes de deleção de Familia", () => {
    it("Familia - 200 - Deletando com sucesso - Por ID", async () => {
      const result = await supertest(app).delete("/familia/1");
      expect(result.status).toStrictEqual(200);
      expect(result.body).toMatchObject({
        Result: "Familia deletado com sucesso",
      });
    });
  });
});
