import * as fs from 'fs';
import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { CustomWebAcl } from './custom-waf';
import * as constructs from './lambda-constructs';

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1',
};

const app = new cdk.App();
const stack = new cdk.Stack(app, 'awsus-dev', { env: devEnv });
const bucket = new s3.Bucket(stack, 'demoBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'error.html',
});

// Create pages
fs.mkdirSync(path.join(__dirname, 'a/b/c'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'index.html'), '<h1>Hello CDK!</h1>');
fs.writeFileSync(path.join(__dirname, 'a/b/c/index.html'), '<h1>Hello CDK from a/b/c/ path!!</h1>');
fs.writeFileSync(path.join(__dirname, 'error.html'), '<h1>This is an ERROR.</h1>');
fs.writeFileSync(path.join(__dirname, '404.html'), '<h1>This is a custom 404 error page.</h1>');

// Put pages to s3 bucket
new BucketDeployment(stack, 'Deployment', {
  sources: [Source.asset(path.join(__dirname, './'))],
  destinationBucket: bucket,
  retainOnDelete: false,
});

// CloudFront OriginAccessIdentity for bucket
const originAccessIdentity = new cf.OriginAccessIdentity(stack, 'OriginAccessIdentity', {
  comment: `CloudFront OriginAccessIdentity for ${bucket.bucketName}`,
});

// Create custom error page construct.
const customErrorPage = new constructs.CustomErrorPage(stack, 'CustomErrorPage');

// Create default Index construct.
const defaultIndex = new constructs.DefaultDirIndex(stack, 'DefaultIndexPage');

// Create Custom Waf V2 Rule.
const customWebAcl = new CustomWebAcl(stack, 'CustomWebAcl');

// Cloudfront distribution
const distribution = new cf.CloudFrontWebDistribution(stack, 'Distribution', {
  originConfigs: [
    {
      s3OriginSource: {
        originAccessIdentity,
        s3BucketSource: bucket,
      },
      behaviors: [{
        isDefaultBehavior: true,
        defaultTtl: cdk.Duration.seconds(10),
        lambdaFunctionAssociations: [customErrorPage, defaultIndex],
      }],
    },
  ],
  webACLId: customWebAcl.webAcl.attrArn.toString(),
});
distribution.node.addDependency(customWebAcl);

new cdk.CfnOutput(stack, 'DistributionDomainName', {
  value: distribution.distributionDomainName,
});
app.synth();