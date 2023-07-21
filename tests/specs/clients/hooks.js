class HooksClient {
    async beforeTestsGetCreds() {
        const { AwsClient } = require("../../helpers/aws");

        const credentialsQaTeam = {
            accessKeyId: process.env.aws_access_key_id_temp_qa,
            secretAccessKey: process.env.aws_secret_access_key_temp_qa,
            region: process.env.region
        };

        const awsClient = new AwsClient(credentialsQaTeam);
        const credentials = await awsClient.credentialsSTS(process.env.account_qa);
        const getSM = await awsClient.getValueSecretManager(credentials, 'api-livaria-credentials');
        Object.assign(process.env, getSM);
        return getSM;
    }
}

module.exports = { HooksClient };