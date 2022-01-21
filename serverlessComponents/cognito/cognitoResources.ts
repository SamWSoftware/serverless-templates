import type { AWS } from '@serverless/typescript';
const CognitoResources: AWS['resources']['Resources'] = {
    CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
            AutoVerifiedAttributes: ['email'],
            Policies: {
                PasswordPolicy: {
                    MinimumLength: 8,
                    RequireLowercase: false,
                    RequireNumbers: false,
                    RequireUppercase: false,
                    RequireSymbols: false,
                },
            },
            AdminCreateUserConfig: {
                AllowAdminCreateUserOnly: true,
            },
            AccountRecoverySetting: {
                RecoveryMechanisms: [
                    {
                        Name: 'verified_email',
                        Priority: 1,
                    },
                    // {
                    //   Name: 'admin_only',
                    //   Priority: 2,
                    // },
                ],
            },
        },
    },
    CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
            UserPoolId: { Ref: 'CognitoUserPool' },
            CallbackURLs: [
                '${self:custom.clientOrigins.${self:provider.stage}, "http://localhost:3000"}',
            ],
            DefaultRedirectURI:
                '${self:custom.clientOrigins.${self:provider.stage}, "http://localhost:3000"}',
            SupportedIdentityProviders: ['COGNITO'],
        },
    },
    WebUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
            UserPoolId: { Ref: 'CognitoUserPool' },
            ClientName: 'web',
            ExplicitAuthFlows: [
                'ALLOW_USER_SRP_AUTH',
                'ALLOW_USER_PASSWORD_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
            ],
            PreventUserExistenceErrors: 'ENABLED',
        },
    },
    UserPoolDomain: {
        Type: 'AWS::Cognito::UserPoolDomain',
        Properties: {
            Domain: 'ztm-app-${self:provider.stage}',
            UserPoolId: { Ref: 'CognitoUserPool' },
        },
    },
    IdentityPool: {
        Type: 'AWS::Cognito::IdentityPool',
        Properties: {
            AllowUnauthenticatedIdentities: false,
            CognitoIdentityProviders: [
                {
                    ClientId: { Ref: 'WebUserPoolClient' },
                    ProviderName: { 'Fn::GetAtt': ['CognitoUserPool', 'ProviderName'] },
                },
            ],
        },
    },
    IdentityPoolRoleAttachment: {
        Type: 'AWS::Cognito::IdentityPoolRoleAttachment',
        Properties: {
            IdentityPoolId: { Ref: 'IdentityPool' },
            Roles: {
                authenticated: {
                    'Fn::GetAtt': ['AuthenticatedRole', 'Arn'],
                },
            },
        },
    },
    AuthenticatedRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
            AssumeRolePolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: {
                            Federated: 'cognito-identity.amazonaws.com',
                        },
                        Action: ['sts:AssumeRoleWithWebIdentity'],
                    },
                ],
            },
            Policies: [
                // add whatever policies you need here
            ],
        },
    },
};

export default CognitoResources;
