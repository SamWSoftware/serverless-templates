import type { AWS } from '@serverless/typescript';
import CognitoResources from './serverless/cognito';
import DynamoResources from './serverless/dynamo';
import functions from './serverless/functions';

const serverlessConfiguration: AWS = {
    service: 'apicognitodyanamo',
    frameworkVersion: '2',
    custom: {
        tables: {
            table1Name: 'myTableName',
        },

        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
    },
    package: {
        individually: true,
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            singleTable: '${self:custom.tables.table1Name}',
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
    },
    functions,
    resources: {
        Resources: {
            ...CognitoResources,
            ...DynamoResources,
        },
    },
};

module.exports = serverlessConfiguration;
