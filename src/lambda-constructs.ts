import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdanj from '@aws-cdk/aws-lambda-nodejs';
import { Construct } from '@aws-cdk/core';


/**
 * Display customized error pages, or mask 4XX error pages, based on where the error originated.
 *
 * see https://aws.amazon.com/tw/blogs/networking-and-content-delivery/customize-403-error-pages-from-amazon-cloudfront-origin-with-lambdaedge/
 */
export class CustomErrorPage extends Construct {
  readonly lambdaFunction: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: Construct, id: string) {
    super(scope, id );
    const func = new lambdanj.NodejsFunction(this, 'CustomFunc', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: path.join(__dirname, './lambda/cf-custom-error-page/index.ts'),
    });

    this.eventType = cf.LambdaEdgeEventType.ORIGIN_RESPONSE,
    this.lambdaFunction = func.currentVersion;
  }
};

/**
 * Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins.
 *
 * see use case - see https://aws.amazon.com/tw/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
 */
export class DefaultDirIndex extends Construct {
  readonly lambdaFunction: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: Construct, id: string) {
    super(scope, id );
    const func = new lambdanj.NodejsFunction(this, 'DefaultDirIndexFunc', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: path.join(__dirname, './lambda/cf-default-dir-index/index.ts'),
    });

    this.eventType = cf.LambdaEdgeEventType.ORIGIN_REQUEST,
    this.lambdaFunction = func.currentVersion;
  }
};