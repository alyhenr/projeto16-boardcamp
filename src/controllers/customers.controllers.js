import dayjs from "dayjs";

import { db } from "../database/database.js";
import getWithoutAuth from "../helpers/getWithoutAuth.js";

export const insertCustomer = async (req, res) => {
    const {
        name, phone, cpf, birthday
    } = res.locals.customerInfo;
    const query = `
        INSERT INTO "customers"
            (name, phone, cpf, birthday)
            SELECT $1, $2, $3::varchar, $4
            WHERE
            NOT EXISTS (
                SELECT "cpf" FROM "customers" WHERE "cpf" = $3::varchar
            )
    `;

    try {
        const dbResponse = await db.query(query, [name, phone, cpf, birthday]);

        if (dbResponse.rowCount == 0) {
            return res.status(409).send("CPF já cadastrado.")
        }

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export const getCustomers = async (req, res) => { getWithoutAuth("customers", res, null, undefined, { needed: true, dateFieldName: "birthday" }); };

export const getCustomerById = (req, res) => {
    const { id } = req.params;
    getWithoutAuth("customers", res, id, undefined, { needed: true, dateFieldName: "birthday" });
};

export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const {
        name, phone, cpf, birthday
    } = res.locals.customerInfo;

    const query = `
        UPDATE "customers" SET
        name = $1, phone = $2, birthday = $3, cpf = $4
        WHERE id = $5 AND (cpf = $4 OR NOT EXISTS(
            SELECT cpf FROM "customers" WHERE cpf = $4
        ))
    `;
    try {
        const dbResponse = await db.query(query, [name, phone, birthday, cpf, id]);

        if (dbResponse.rowCount == 0) {
            return res.status(409).send("CPF não corresponde ao id enviado e pertence a outro usuário.")
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};