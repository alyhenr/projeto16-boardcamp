import { db } from "../database/database.js";

export default async (query, values, res, errStatus, errMessage) => {
    try {
        const dbResponse = await db.query(query, values);

        if (dbResponse.rowCount == 0) {
            return res.status(errStatus).send(errMessage);
        }

        return res.sendStatus(201);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
