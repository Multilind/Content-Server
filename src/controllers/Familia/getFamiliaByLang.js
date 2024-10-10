/* istanbul ignore file */

import Familia from "../../models/Familia";
import { HttpException } from "../../error/HttpException";

export async function getFamiliaByLang(request, response) {
  const { id_lingua } = request.params;

  if (!id_lingua) {
    throw new HttpException(400, `ID inválido - ID Lingua - ${id_lingua}`);
  }

  const familiaFound = await Familia.getFamilyByLanguage(id_lingua);
  if (!familiaFound) {
    throw new HttpException(
      404,
      `Familia não encontrado - ID Lingua - ${id_lingua}`
    );
  }

  response.send(familiaFound);
}
