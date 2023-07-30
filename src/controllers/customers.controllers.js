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

export const getCustomers = async (req, res) => { getWithoutAuth("customers", res); };

export const getCustomerById = (req, res) => {
    const { id } = req.params;
    getWithoutAuth("customers", res, id);
};

export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const {
        name, phone, cpf, birthday
    } = res.locals.customerInfo;

    const query = `
        UPDATE "customers" SET name = $1, phone = $2, birthday = $3
        WHERE cpf = $4 AND id = $5
    `;
    try {
        const dbResponse = await db.query(query, [name, phone, birthday, cpf, id]);

        if (dbResponse.rowCount == 0) {
            return res.status(409).send("CPF não corresponde ao id enviado.")
        }

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};