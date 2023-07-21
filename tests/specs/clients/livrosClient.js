const { expect } = require('@playwright/test');
const { PostgreSQLClient } = require('../../helpers/postgres');

class LivrosClient {
    /**
    * @param {import('playwright').APIRequest} request
    */
    constructor(request) {
        this.request = request;
        this.baseUri = `${process.env.uri_api}:${process.env.api_port}`
    }

    headers() {
        return JSON.stringify({
            "Content-Type": "application/json",
            "Accept": "application/json"
        });
    }

    credentialsDataBase() {
        return {
            user: process.env.db_user,
            host: process.env.db_host,
            database: process.env.db_name,
            password: process.env.db_pass,
            port: 5432,
        }
    }

    async validateDataPersistence(responseApi) {
        const credsDb = this.credentialsDataBase();
        const id = responseApi.id
        const pg = new PostgreSQLClient(credsDb.user, credsDb.host, credsDb.database, credsDb.password, credsDb.port);
        const query = `SELECT * FROM public.livros WHERE id=${id};`
        const respDb = await pg.queryExecute(query);
        console.log(respDb);

        expect(responseApi.nome).toEqual(respDb[0].nome);
        expect(responseApi.autor).toEqual(respDb[0].autor);
        expect(responseApi.qtde_paginas).toEqual(respDb[0].qtde_paginas);
    }

    async postLivros(payload, statusCode = 201) {
        const path = '/livros'
        const uri = this.baseUri + path;
        console.log('Starting Request POST: ', path);
        console.log('Uri: ' + uri);
        console.log("Payload: ");
        console.log(JSON.parse(payload));
        const apiRequest = await this.request.post(uri, { data: JSON.parse(payload), headers: JSON.parse(this.headers()) });
        const apiResponse = await apiRequest.text();
        console.log(`Response: ${path} `);
        console.log(apiResponse);
        console.log(`StatusCode ${path}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { apiResponse: apiResponse, payloadSended: JSON.parse(payload) }
    }

    async patchLivros(id, payload, statusCode = 200) {
        const path = `/livros/${id}`
        const uri = this.baseUri + path;
        console.log('Starting Request PATCH: ', path);
        console.log('Uri: ' + uri);
        console.log("Payload: ");
        console.log(JSON.parse(payload));
        const apiRequest = await this.request.patch(uri, { data: JSON.parse(payload), headers: JSON.parse(this.headers()) });
        const apiResponse = await apiRequest.text();
        console.log(`Response: ${path} `);
        console.log(apiResponse);
        console.log(`StatusCode ${path}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { apiResponse: apiResponse, payloadSended: JSON.parse(payload) }
    }

    async putLivros(id, payload, statusCode = 200) {
        const path = `/livros/${id}`
        const uri = this.baseUri + path;
        console.log('Starting Request PUT: ', path);
        console.log('Uri: ' + uri);
        console.log("Payload: ");
        console.log(JSON.parse(payload));
        const apiRequest = await this.request.put(uri, { data: JSON.parse(payload), headers: JSON.parse(this.headers()) });
        const apiResponse = await apiRequest.text();
        console.log(`Response: ${path} `);
        console.log(apiResponse);
        console.log(`StatusCode ${path}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { apiResponse: apiResponse, payloadSended: JSON.parse(payload) }
    }

    async getLivroByID(id, statusCode = 201) {
        const path = `/livros/${id}`
        const uri = this.baseUri + path;
        console.log('Starting Request GET: ', path);
        console.log('Uri: ' + uri);
        const apiRequest = await this.request.get(uri, { headers: JSON.parse(this.headers()) });
        const apiResponse = await apiRequest.text();
        console.log(`Response: ${path} `);
        console.log(apiResponse);
        console.log(`StatusCode ${path}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { apiResponse: apiResponse }
    }

    async deleteLivroByID(id, statusCode = 200) {
        const path = `/livros/${id}`
        const uri = this.baseUri + path;
        console.log('Starting Request DELETE: ', path);
        console.log('Uri: ' + uri);
        const apiRequest = await this.request.delete(uri, { headers: JSON.parse(this.headers()) });
        const apiResponse = await apiRequest.text();
        console.log(`Response: ${path} `);
        console.log(apiResponse);
        console.log(`StatusCode ${path}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { apiResponse: apiResponse }
    }

}

module.exports = { LivrosClient };