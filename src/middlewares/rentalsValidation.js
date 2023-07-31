import schemaValidation from "../helpers/schemaValidation.js";

export default (rentalsSchema) => (
    (req, res, next) => {
        const { customerId, gameId, daysRented } = req.body;
        schemaValidation({
            customerId, gameId, daysRented,
        }, rentalsSchema, res);
        next();
    }
)