export default (data, valToCheck) => {
    const keysNames = [];
    const values = [];
    Object.entries(data).forEach(entry => {
        keysNames.push(`"${entry[0]}"`);
        values.push(entry[1]);
    })
    values.push(valToCheck);

    return [keysNames, values];
};
