import { db } from "../database/database.js";

export default async (dbName, res, id = null, withJoin = { use: false }) => {
    let query = withJoin.use
        ? `
            SELECT ${withJoin.rows.join(", ")} FROM ${dbName}
            ${withJoin.tablesToJoin.map((t, i) => (
            `JOIN ${t} ON ${withJoin.conditions[i]}`
        )).join(" ")}
        `
        : `
            SELECT * FROM ${dbName}
        `;


    if (id != null) {
        query += `WHERE id = ${id}`;
    }

    try {
        let data = (await db.query(query)).rows;
        if (withJoin.use) {
            data = withJoin.formatToSend(data);
        }
        if (id != null && data.length == 0) { return res.sendStatus(404); }

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
}
