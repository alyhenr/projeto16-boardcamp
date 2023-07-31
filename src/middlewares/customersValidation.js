const removeNonNumerics = str => str.split("").filter(c => !c.match(/[^0-9]/g)).join("");

export default (customersSchema) => (
    (req, res, next) => {
        let { name, phone, cpf, birthday } = req.body;

        if (!birthday.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
            return res.status(400).send(
                "Insira uma data em formato válido: yyyy-mm-dd"
            );
        }

        cpf = removeNonNumerics(cpf);
        phone = removeNonNumerics(phone);
        const customerInfo = { name, phone, cpf, birthday };
        const validation = customersSchema.validate(customerInfo);

        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message)
            return res.status(400).send(errors)
        }

        res.locals.customerInfo = customerInfo;
        next();
    }
);