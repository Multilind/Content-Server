const FamiliaModel = require("./Familia");
const LinguaModel = require("../Lingua/Lingua");
const Conteudo = require("../Conteudo");

exports.getAll = async () => {
  return FamiliaModel.findAll({
    attributes: ["id_familia", "id_conteudo", "nome"],
    include: [
      {
        model: LinguaModel,
        as: "linguas",
        attributes: ["id_lingua", "id_conteudo", "nome"],
      },
    ],
  });
};
exports.getFamilyByLanguage = async (idLingua) => {
  return LinguaModel.findOne({
    where: { id_lingua: idLingua },
    attributes: ["id_lingua", "nome"],
    include: [
      {
        model: FamiliaModel,
        as: "familia",
        attributes: ["id_familia", "nome"],
      },
    ],
  });
};
exports.searchByName = async (nome) => {
  return FamiliaModel.findOne({
    where: {
      nome,
    },
  });
};
exports.create = async (body) => {
  const conteudoCreated = await Conteudo.create();
  body.id_conteudo = conteudoCreated.id_conteudo;
  return FamiliaModel.create(body);
};
exports.searchById = async (idFamilia) => {
  return FamiliaModel.findOne({
    where: {
      id_familia: idFamilia,
    },
    include: [
      {
        model: LinguaModel,
        as: "linguas",
        attributes: ["id_lingua", "id_conteudo", "nome"],
      },
    ],
  });
};
exports.editById = async (body, idFamilia) => {
  return FamiliaModel.update(body, {
    where: {
      id_familia: idFamilia,
    },
  });
};
