const { DataFaker } = require('../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function payloadPostLivros() {
    return JSON.stringify({
        "nome": `${new DataFaker().getFullName()}`,
        "autor": `${new DataFaker().getCompanyName()}`,
        "dataPublicacao": "2023-04-03",
        "qtdePaginas": new DataFaker().getRandomNumber(400)
    });
}

function payloadPutLivros() {
    return payloadPostLivros();
}
function payloadPatchLivros() {
    return JSON.stringify({
        "autor": `${new DataFaker().getCompanyName()}`
    });
}

module.exports = { payloadPostLivros, payloadPutLivros, payloadPatchLivros };