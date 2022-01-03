import type { AWS } from '@serverless/typescript';
import WebsiteBucketAndCloudfront from './serverless/websiteBucketAndCloudfront';

const serverlessConfiguration: AWS = {
    service: 'websitehosting',
    frameworkVersion: '2',
    custom: {
        // customise this to your bucket name
        websiteBucket: '{self:provider.stage}-{self:service}-website-bucket',
        //customise the domain names to match the domains registered for each environment.
        domainName: {
            dev: 'dev.mydomainname.com',
            qa: 'qa.mydomainname.com',
            prod: 'mydomainname.com',
        },
        // update the hosted zone IDs from Route 53
        hostedZoneId: '123REW789KSU',
        // put in the SSL certificates created for the domain names
        certificates: {
            dev: 'arn:aws:acm:{region}:{accountID}:certificate/{certificateID}',
            qa: 'arn:aws:acm:{region}:{accountID}:certificate/{certificateID}',
            prod: 'arn:aws:acm:{region}:{accountID}:certificate/{certificateID}',
        },

        s3Sync: {},
    },

    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
    },

    plugins: ['serverless-sy-sync'],

    resources: {
        Conditions: {
            IsProd: { 'Fn::Equals': ['${opt:stage, self:provider.stage}', 'prod'] },
            NotProd: { 'Fn::Not': 'IsProd' },
        },
        ...WebsiteBucketAndCloudfront,
    },
};

module.exports = serverlessConfiguration;
