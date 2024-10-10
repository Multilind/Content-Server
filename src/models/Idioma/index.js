const IdiomaModel = require("./Idioma");
const Conteudo = require("../Conteudo");
const LocalidadeModel = require("../Localidade/Localidade");
const LinguaModel = require("../Lingua/Lingua");
const FamiliaModel = require("../Familia/Familia");
const EtniaModel = require("../Etnia/Etnia");

exports.create = async (idioma) => {
  const conteudoCreated = await Conteudo.create();
  idioma.id_conteudo = conteudoCreated.id_conteudo;
  return IdiomaModel.create(idioma);
};
exports.searchAll = async (query) => {
  return IdiomaModel.findAll({
    where: query,
    attributes: ["id_conteudo"],
    include: [
      { model: LocalidadeModel, as: "localidade" },
      {
        model: LinguaModel,
        as: "lingua",
        attributes: ["id_lingua", "nome"],
        include: [
          {
            model: FamiliaModel,
            as: "familia",
            attributes: ["id_familia", "nome"],
          },
          { model: EtniaModel, as: "etnia" },
        ],
      },
    ],
  });
};
