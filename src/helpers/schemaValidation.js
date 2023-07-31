export default (data, schema, res) => {
    const validation = schema.validate(data);

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(400).send(errors)
    }
}