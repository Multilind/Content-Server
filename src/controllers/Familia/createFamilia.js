/* istanbul ignore file */
import Familia from "../../models/Familia";
import { HttpException } from "../../error/HttpException";

export async function create(request, response) {
  const { nome } = request.body;
  if (!nome) {
    throw new HttpException(400, `Nome inválido - Familia - ${nome}`);
  }

  const nameAlreadyExists = await Familia.searchByName(nome);
  if (nameAlreadyExists) {
    throw new HttpException(400, `Nome já existente - Familia - ${nome}`);
  }

  const familia = await Familia.create({
    nome,
  });

  response.send(familia);
}
