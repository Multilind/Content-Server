const LinguaModel = require("./Lingua");
const FamiliaModel = require("../Familia/Familia");
const Conteudo = require("../Conteudo");

exports.searchByName = async (nome) => {
  return LinguaModel.findOne({
    where: {
      nome: nome,
    },
  });
};
exports.create = async (lingua) => {
  const conteudoCreated = await Conteudo.create();
  lingua.id_conteudo = conteudoCreated.id_conteudo;
  return LinguaModel.create(lingua);
};
exports.searchById = async (id) => {
  return LinguaModel.findOne({
    where: { id_lingua: id },
    attributes: ["id_lingua", "id_conteudo", "nome"],
    include: [
      {
        model: FamiliaModel,
        as: "familia",
        attributes: ["id_familia", "nome"],
      },
    ],
  });
};
exports.searchAll = async () => {
  return LinguaModel.findAll({
    raw: true,
    nest: true,
    include: [
      {
        model: FamiliaModel,
        as: "familia",
        attributes: ["id_familia", "nome"],
      },
    ],
  });
};
exports.delete = async (id) => {
  return LinguaModel.destroy({
    where: {
      id_lingua: id,
    },
  });
};
exports.editById = async (body, id) => {
  return LinguaModel.update(body, { where: { id_lingua: id } });
};
