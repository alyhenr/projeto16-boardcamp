import { Router } from "express";

import rentalsValidation from "../middlewares/rentalsValidation.js";
import rentalsSchema from "../schemas/rentals.schemas.js";
import { getRentals, insertRental, finishRental, deleteRental } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", rentalsValidation(rentalsSchema), insertRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", finishRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
