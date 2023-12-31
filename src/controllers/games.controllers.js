import { db } from "../database/database.js";
import getWithoutAuth from "../helpers/getWithoutAuth.js";

export const insertGame = async (req, res) => {
    const { name, image, stockTotal, pricePerDay } = req.body;

    const query = `
        INSERT INTO "games"
        (name, image, "stockTotal", "pricePerDay")
        SELECT $1, $2, $3, $4
        WHERE
        NOT EXISTS (
            SELECT "name" FROM "games" WHERE "name" = $1
        )
    `;

    try {
        const dbResponse = await db.query(query, [name, image, stockTotal, pricePerDay]);

        if (dbResponse.rowCount == 0) {
            return res.status(409).send("Esse jogo já está registrado.");
        }

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export const getGames = async (req, res) => {
    const name = req.query.name?.split(" ")[0];
    getWithoutAuth("games", res, null, undefined, { needed: false }, !!name ? name : false);
};
