/* istanbul ignore file */

// import Familia from "../../models/Familia";
import { HttpException } from "../../error/HttpException";
// import Conteudo from "../../models/Conteudo";

export async function deleteOne(request, response) {
  const { id_familia } = request.params;
  if (!id_familia) {
    throw new HttpException(400, `ID inválido - Familia - ID ${id_familia}`);
  }

  // const familiaFound = await Familia.searchById(id_familia);

  // if (!familiaFound) {
  //   throw new HttpException(
  //     404,
  //     `Familia não encontrada - Familia - ID ${id_familia}`
  //   );
  // }
  // Conteudo.delete(familiaFound.id_conteudo);

  response.send({
    Result: "Familia deletado com sucesso",
  });
}
