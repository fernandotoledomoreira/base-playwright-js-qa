const { test, HookFunction, expect } = require('@playwright/test');
const { LivrosClient } = require('./clients/livrosClient');
const { Contract } = require('../helpers/contract');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { ApiUtils } = require('../helpers/apiUtils');
const { HooksClient } = require('./clients/hooks');

test.beforeEach(async () => {
    await new HooksClient().beforeTestsGetCreds();
});

test.describe('CRUD API Test example @makeCrud', () => {
    test('POST /livros @postLivros', async ({ request }) => {
        const payloadFile = require('./mocks/payloadPostLivros');
        const livrosClient = new LivrosClient(request);
        const contract = new Contract();
        const req = await livrosClient.postLivros(payloadFile.payloadPostLivros(), 201);
        const responseApi = JSON.parse(req.apiResponse);
        contract.validateContract(responseApi, '../specs/schemas/post_livros.json');
        await livrosClient.validateDataPersistence(responseApi);
    });

    const recordsPostLivros = parse(fs.readFileSync(path.join(__dirname, '../specs/examples/examplesPostLivros.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPostLivros) {
        test(`Validate the POST /livros request filled in the field ${record.field} with the value ${record.value} @exploratoryPostLivros`, async ({ request }) => {
            const payloadFile = require('./mocks/payloadPostLivros');
            const apiUtils = new ApiUtils();
            const originalPayload = payloadFile.payloadPostLivros();
            const payloadPostLivros = await apiUtils.payloadExploratoryReturn(JSON.parse(originalPayload), record);
            const livrosClient = new LivrosClient(request);
            const req = await livrosClient.postLivros(payloadPostLivros, parseInt(record.code));
        });
    }

    test('GET /livros/id @getLivroById', async ({ request }) => {
        const payloadFile = require('./mocks/payloadPostLivros');
        const payload = payloadFile.payloadPostLivros();
        const livrosClient = new LivrosClient(request);
        const req = await livrosClient.postLivros(payload, 201);
        const id = JSON.parse(req.apiResponse)['id'];
        await livrosClient.getLivroByID(id, 200);
    });

    test('PATCH /livros @patchLivros', async ({ request }) => {
        const payloadFile = require('./mocks/payloadPostLivros');
        const payload = payloadFile.payloadPostLivros();
        const livrosClient = new LivrosClient(request);
        const reqPost = await livrosClient.postLivros(payload, 201);
        const id = JSON.parse(reqPost.apiResponse)['id'];
        const payloadPatch = payloadFile.payloadPatchLivros();
        await livrosClient.patchLivros(id, payloadPatch, 200);
    });

    test('PUT /livros @putLivros', async ({ request }) => {
        const payloadFile = require('./mocks/payloadPostLivros');
        const payload = payloadFile.payloadPostLivros();
        const livrosClient = new LivrosClient(request);
        const reqPost = await livrosClient.postLivros(payload, 201);
        const id = JSON.parse(reqPost.apiResponse)['id'];
        const payloadPut = payloadFile.payloadPutLivros();
        await livrosClient.patchLivros(id, payloadPut, 200);
    });

    test('DELETE /livros/id @deleteLivros', async ({ request }) => {
        const payloadFile = require('./mocks/payloadPostLivros');
        const payload = payloadFile.payloadPostLivros();
        const livrosClient = new LivrosClient(request);
        const reqPost = await livrosClient.postLivros(payload, 201);
        const id = JSON.parse(reqPost.apiResponse)['id'];
        await livrosClient.deleteLivroByID(id, 200);
    });
});
