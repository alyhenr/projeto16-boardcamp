import joi from "joi";

export default joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().positive().required(),
    pricePerDay: joi.number().positive().required(),
});