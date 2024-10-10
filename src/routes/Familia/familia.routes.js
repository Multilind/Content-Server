import { Router } from "express";
const router = Router();

import {
  getOne,
  create,
  getAll,
  update,
  deleteOne,
  getFamiliaByLang,
} from "../../controllers/Familia";

const idFamilia = "/:id_familia";

router.get(idFamilia, getOne);
router.get("/lingua/:id_lingua", getFamiliaByLang);
router.get("/", getAll);
router.post("/", create);
router.put(idFamilia, update);
router.delete(idFamilia, deleteOne);

export default router;
