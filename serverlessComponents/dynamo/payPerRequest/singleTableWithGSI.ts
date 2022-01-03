import type { AWS } from '@serverless/typescript';

const DynamoResources: AWS['resources']['Resources'] = {
    table1: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
            TableName: '${self:custom.tables.table1Name}',
            AttributeDefinitions: [
                {
                    AttributeName: 'id',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'pk',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'sk',
                    AttributeType: 'S',
                },
            ],

            KeySchema: [
                {
                    AttributeName: 'id',
                    KeyType: 'HASH',
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'gsi1',
                    KeySchema: [
                        {
                            AttributeName: 'pk',
                            KeyType: 'HASH',
                        },
                        {
                            AttributeName: 'sk',
                            KeyType: 'RANGE',
                        },
                    ],
                    Projection: {
                        ProjectionType: 'ALL',
                    },
                },
            ],
        },
    },
};

export default DynamoResources;
