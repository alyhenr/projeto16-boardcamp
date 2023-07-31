import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Server on, port: ${port}`); });