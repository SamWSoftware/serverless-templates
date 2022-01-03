const corsSettings = {
    headers: [
        // Specify allowed headers
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
    ],
    allowCredentials: false,
};

interface Authorizer {
    name: string;
    type: string;
    arn: {
        'Fn::GetAtt': string[];
    };
}
const authorizer: Authorizer = {
    name: 'authorizer',
    type: 'COGNITO_USER_POOLS',
    arn: { 'Fn::GetAtt': ['CognitoUserPool', 'Arn'] },
};

const functions = {
    getFlights: {
        handler: 'src/lambdas/getFlights/index.handler',
        events: [
            {
                http: {
                    method: 'get',
                    path: 'flights',
                    cors: corsSettings,
                    authorizer,
                    responses: {
                        200: {
                            description: 'successful API Response',
                            bodyType: 'getFlightsResponse',
                        },
                        400: {
                            description: 'failed API Response - user error',
                        },
                    },
                },
            },
        ],
    },
    bookFlight: {
        handler: 'src/lambdas/bookFlight/index.handler',
        events: [
            {
                http: {
                    method: 'post',
                    path: 'flights/{flightID}',
                    cors: corsSettings,
                    authorizer,
                    bodyType: 'PostFlightBody',
                },
            },
        ],
    },

    fakeGet: {
        handler: 'src/lambdas/getFlights/index.handler',
        events: [
            {
                http: {
                    method: 'get',
                    path: 'fake',
                    cors: corsSettings,
                    authorizer,
                },
            },
        ],
    },
};

export default functions;
