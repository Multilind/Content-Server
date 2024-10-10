/* istanbul ignore file */

import Familia from "../../models/Familia";
import { HttpException } from "../../error/HttpException";

export async function update(request, response) {
  const { nome } = request.body;
  if (!nome) {
    throw new HttpException(400, "Nome inválido - Familia");
  }

  const nameAlreadyExists = await Familia.searchByName(nome);
  if (nameAlreadyExists) {
    throw new HttpException(400, `Nome já existente - Familia - ${nome}`);
  }

  const { id_familia } = request.params;
  const idValido = await Familia.searchById(id_familia);

  if (!id_familia || !idValido) {
    throw new HttpException(400, `ID inválido - Familia - ID ${id_familia}`);
  }

  await Familia.editById({ nome }, id_familia);

  const familia = await Familia.searchById(id_familia);

  response.send(familia);
}
