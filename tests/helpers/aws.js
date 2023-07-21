const AWS = require('aws-sdk');

class AwsClient {
    constructor(creds) {
        this.sts = new AWS.STS(creds);
        this.region = creds['region'];
    }

    async credentialsSTS(account_number) {
        const params = {
            DurationSeconds: 3600,
            RoleArn: `arn:aws:iam::${account_number}:role/automationQA`,
            RoleSessionName: 'Automation',
        };

        try {
            const data = await this.sts.assumeRole(params).promise();
            return this.formatCredentials(data.Credentials, this.region);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    formatCredentials(credentials, region) {
        return {
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken,
            region: region
        };
    }

    async getValueSecretManager(credentials, secretId) {
        const secretsManager = new AWS.SecretsManager(credentials);
        const params = {
            SecretId: secretId
        };

        console.log('Starting search in Secrets Manager');
        let secret = await secretsManager.getSecretValue(params).promise();
        console.log('Search completed in Secrets Manager');
        return JSON.parse(secret.SecretString);
    }
}

module.exports = { AwsClient };