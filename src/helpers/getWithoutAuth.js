import { db } from "../database/database.js";

export default async (dbName, res, id = null) => {
    let query = `
            SELECT * FROM ${dbName}
        `;

    if (id != null) {
        query += `WHERE id = ${id}`;
    }

    try {
        const listOfCustomers = await db.query(query);

        if (id != null && listOfCustomers.rowCount == 0) { return res.sendStatus(404); }

        res.status(200).send(listOfCustomers.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
}
