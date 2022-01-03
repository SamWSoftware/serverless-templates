import type { AWS } from '@serverless/typescript';
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
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            singleTable: '${self:custom.tables.table1Name}',
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
    },
    functions,
};

module.exports = serverlessConfiguration;
