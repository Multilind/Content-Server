const DialetoModel = require("./Dialeto");
const Conteudo = require("../Conteudo");
const EtniaModel = require("../Etnia/Etnia");
const LinguaModel = require("../Lingua/Lingua");

exports.getAll = async () => {
  return DialetoModel.findAll({
    raw: true,
  });
};
exports.create = async (dialeto) => {
  const conteudoCreated = await Conteudo.create();
  dialeto.id_conteudo = conteudoCreated.id_conteudo;
  return DialetoModel.create(dialeto);
};
exports.searchAll = async (query) => {
  return DialetoModel.findAll({
    where: query,
    attributes: [],
    include: [
      { model: EtniaModel, as: "etnia", attributes: ["id_etnia", "nome"] },
      { model: LinguaModel, as: "lingua", attributes: ["id_lingua", "nome"] },
    ],
  });
};