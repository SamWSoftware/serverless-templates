# Website Hosting Template

## Usage

Create a Route53 Hosted Zone
In Route 53, click `Create hosted zone` and enter the domain name for the hosted zone.

Create an SSL Cert

[create a certificate](https://console.aws.amazon.com/acm/home?region=us-east-1)
Make sure that you're in the `us-west-1` region (N. Virginia) as certificates in other regions won't work with cloudfront.
Request a public certificate
Create a certificate for `*.yourdomainname.com` which can then be used for any website in that AWS account.
If you're certificate is in the same account as the R53 DNS then click "Create records in Route 53. Else manually add the CNAME `name` and `value` to the R53 hosted zone.
In a few minutes you should see the status show `Issued`. Copy the certificate ID and paste it into the `custom.certificates` section for all of the stages.
