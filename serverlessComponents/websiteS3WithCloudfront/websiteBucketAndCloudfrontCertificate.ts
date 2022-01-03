import { AWS } from '@serverless/typescript/index';

const WebsiteBucketAndCloudfront: AWS['resources'] = {
    Resources: {
        FrontendS3Bucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: '${self:custom.websiteBucket}',
                AccessControl: 'PublicRead',
                WebsiteConfiguration: {
                    IndexDocument: 'index.html',
                    ErrorDocument: 'index.html',
                },
                CorsConfiguration: {
                    CorsRules: [
                        {
                            AllowedHeaders: ['*'],
                            AllowedMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
                            AllowedOrigins: ['*'],
                            ExposedHeaders: [
                                'x-amz-server-side-encryption',
                                'x-amz-request-id',
                                'x-amz-id-2',
                                'ETag',
                            ],
                        },
                    ],
                },
            },
        },
        FrontendS3BucketPolicy: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: { Ref: 'FrontendS3Bucket' },
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: '*',
                            Action: 's3:GetObject',
                            Resource: {
                                'Fn::Join': [
                                    '/',
                                    [{ 'Fn::GetAtt': ['FrontendS3Bucket', 'Arn'] }, '*'],
                                ],
                            },
                        },
                    ],
                },
            },
        },

        ACMCertificate: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: '${self:custom.domainName.${opt:stage, self:provider.stage}}',
                DomainValidationOptions: [
                    {
                        DomainName: '${self:custom.domainName.${opt:stage, self:provider.stage}}',
                        HostedZoneId: '${self:custom.hostedZoneId}',
                    },
                ],
                ValidationMethod: 'DNS',
            },
        },

        CloudFrontDistribution: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    DefaultRootObject: 'index.html',
                    Origins: [
                        {
                            DomainName: { 'Fn::GetAtt': ['FrontendS3Bucket', 'DomainName'] },
                            Id: { 'Fn::GetAtt': ['FrontendS3Bucket', 'DomainName'] },
                            CustomOriginConfig: {
                                HTTPPort: 80,
                                HTTPSPort: 443,
                                OriginProtocolPolicy: 'https-only',
                            },
                        },
                    ],
                    Enabled: 'true',
                    HttpVersion: 'http2',
                    DefaultCacheBehavior: {
                        TargetOriginId: { 'Fn::GetAtt': ['FrontendS3Bucket', 'DomainName'] },
                        ViewerProtocolPolicy: 'redirect-to-https',
                        AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                        CachedMethods: ['GET', 'HEAD'],
                        ForwardedValues: {
                            QueryString: true,
                            Headers: ['Origin'],
                        },
                        Compress: false,
                    },
                    Aliases: ['${self:custom.domainName.${opt:stage, self:provider.stage}}'],
                    ViewerCertificate: {
                        AcmCertificateArn: { Ref: 'ACMCertificate' },
                        SslSupportMethod: 'sni-only',
                        MinimumProtocolVersion: 'TLSv1.2_2018',
                    },
                },
            },
        },

        Route53Record: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: '${self:custom.hostedZoneId}',
                Name: '${self:custom.domainName.${opt:stage, self:provider.stage}}',
                TTL: '300',
                Type: 'A',
                AliasTarget: {
                    HostedZoneId: '${self:custom.hostedZoneId}',
                    DNSName: {
                        'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
                    },
                },
            },
        },
    },
};
export default WebsiteBucketAndCloudfront;
