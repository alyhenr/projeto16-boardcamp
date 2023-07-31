import dayjs from "dayjs";

import { db } from "../database/database.js";
import getWithoutAuth from "../helpers/getWithoutAuth.js";
import postAndInsert from "../helpers/postAndInsert.js";
import createArraysWithData from "../helpers/createArraysWithData.js";

export const getRentals = (_, res) => {
    getWithoutAuth("rentals", res, null, {
        use: true,
        rows: ["rentals.*", "customers.id as c_id", "customers.name as c_name",
            "games.id as g_id, games.name as g_name"],
        tablesToJoin: ["customers", "games"],
        conditions: [`rentals."customerId" = customers.id`, `rentals."gameId" = games.id`],
        formatToSend: dbResponse => {
            const dataToSend = [];
            dbResponse.forEach(row => {
                const customer = { id: row["c_id"], name: row["c_name"] };
                const game = { id: row["g_id"], name: row["g_name"] };

                row.rentDate = dayjs(row.rentDate).format('YYYY-MM-DD');
                row.returnDate = dayjs(row.returnDate).format('YYYY-MM-DD');

                delete row["c_id"];
                delete row["c_name"];
                delete row["g_id"];
                delete row["g_name"];

                dataToSend.push({ ...row, customer, game });
            });

            return dataToSend;
        },
    });
};

export const insertRental = async (req, res) => {
    const { customerId, gameId, daysRented } = req.body;
    try {
        const activeRentals = await db.query(`
            SELECT * FROM "rentals"
            WHERE "returnDate" IS NULL
            AND "gameId" = $1
        `, [gameId]);
        const n = activeRentals.rowCount;

        const dbResponse = await db.query(`
            SELECT "pricePerDay" FROM "games"
            WHERE id = $1
            AND "stockTotal" > $2
        `, [gameId, n]);

        if (dbResponse.rowCount == 0) {
            return res.status(400).send(`Jogo não está disponível: gameId = ${gameId}`);
        }

        const originalPrice = dbResponse.rows[0]["pricePerDay"] * daysRented;
        const dataToInsert = {
            customerId,
            gameId,
            rentDate: dayjs().format("YYYY-MM-DD"),
            daysRented,
            returnDate: null,
            originalPrice,
            delayFee: null,
        }
        const [keysNames, values] = createArraysWithData(dataToInsert, customerId);

        const query = `
            INSERT INTO "rentals"
            (${keysNames.join(", ")})
            SELECT ${keysNames.map((_, i) => `$${i + 1}`).join(", ")}
            WHERE
            EXISTS (
                SELECT id FROM "customers"
                WHERE id = $${values.length}
            )
        `;

        postAndInsert(query, values, res, 400, `Id de usuário não encontrado: customerId = ${customerId}`);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }


};

export const finishRental = async (req, res) => {
    const { id } = req.params;
    const todayDate = dayjs().format('YYYY-MM-DD').toString().replaceAll("-", "");
    try {
        //Check if id exists:
        if ((await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])).rowCount == 0) {
            return res.sendStatus(404);
        }

        //Proceed to update the rental, if it's not already update:
        const dbResponse = await db.query(`
            UPDATE rentals
            SET "returnDate" = DATE(${todayDate}::text),
            "delayFee" =
                CASE WHEN "rentDate" + "daysRented" < DATE(${todayDate}::text)
                THEN "originalPrice" / "daysRented" * (DATE(${todayDate}::text) - "rentDate" - "daysRented")
                ELSE 0 END
            WHERE id = $1
            AND "returnDate" IS NULL;
        `, [id]);

        if (dbResponse.rowCount == 0) {
            return res.sendStatus(400);
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }



};

export const deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
        //Check if id exists:
        if ((await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])).rowCount == 0) {
            return res.sendStatus(404);
        }

        const dbResponse = await db.query(`
            DELETE FROM rentals WHERE id = $1 AND "returnDate" IS NOT NULL
        `, [id]);

        if (dbResponse.rowCount == 0) {
            return res.sendStatus(400);
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};