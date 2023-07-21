class ApiUtils {

    async payloadExploratoryReturn(payload, record) {
        const { ExamplesConvert } = require('../helpers/examplesConvert');
        if (record.field.includes('.')) {
            const objects = record.field.split('.');
            payload[objects[0]][objects[1]][objects[2]] = new ExamplesConvert().transformData(record.value);
        } else {
            payload[record.field] = new ExamplesConvert().transformData(record.value);
        }
        return JSON.stringify(payload);
    }
};

module.exports = { ApiUtils };