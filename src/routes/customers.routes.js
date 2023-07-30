import { Router } from "express";

import customersValidation from "../middlewares/customersValidation.js";
import customersSchema from "../schemas/customers.schemas.js";
import { insertCustomer, getCustomers, getCustomerById, updateCustomer } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.post("/customers", customersValidation(customersSchema), insertCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.put("/customers/:id", customersValidation(customersSchema), updateCustomer);

export default customersRouter;
