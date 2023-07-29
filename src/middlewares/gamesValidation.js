export default (gamesSchema) => (
    (req, res, next) => {
        const { name, image, stockTotal, pricePerDay } = req.body;
        const gameInfo = { name, image, stockTotal, pricePerDay };

        const validation = gamesSchema.validate({ ...gameInfo });

        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message)
            return res.status(400).send(errors)
        }

        next();
    }
);
