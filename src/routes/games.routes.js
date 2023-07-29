import { Router } from "express";

import gamesValidation from "../middlewares/gamesValidation.js";
import gamesSchema from "../schemas/games.schemas.js";
import { insertGame, getGames } from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.post("/games", gamesValidation(gamesSchema), insertGame);
gamesRouter.get("/games", getGames);

export default gamesRouter;
