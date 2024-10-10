/* istanbul ignore file */

import Familia from "../../models/Familia";

export async function getAll(request, response) {
  const etniasEncontrada = await Familia.getAll();
  response.send(etniasEncontrada);
}
