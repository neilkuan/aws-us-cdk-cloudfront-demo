import * as wafv2 from '@aws-cdk/aws-wafv2';
import { Construct } from '@aws-cdk/core';
export class CustomWebAcl extends Construct {
  readonly webAcl:wafv2.CfnWebACL;
  constructor(scope: Construct, id: string) {
    super(scope, id );
    this.webAcl = new wafv2.CfnWebACL(this, 'webACL', {
      name: 'cdk-webACL',
      defaultAction: {
        block: {},
      },
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'cdk-webACL',
      },
      rules: [{
        action: {
          allow: {},
        },
        name: 'allow-default-index-and-end-slash',
        priority: 0,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'CustomWafACL',
        },
        statement: {
          orStatement: {
            statements: [
              {
                byteMatchStatement: {
                  searchString: '.html',
                  fieldToMatch: {
                    uriPath: {},
                  },
                  textTransformations: [
                    {
                      priority: 0,
                      type: 'NONE',
                    },
                  ],
                  positionalConstraint: 'ENDS_WITH',
                },
              },
              {
                byteMatchStatement: {
                  searchString: '/',
                  fieldToMatch: {
                    uriPath: {},
                  },
                  textTransformations: [
                    {
                      priority: 0,
                      type: 'NONE',
                    },
                  ],
                  positionalConstraint: 'ENDS_WITH',
                },
              },
            ],
          },
        },
      }],
    });
  }
};