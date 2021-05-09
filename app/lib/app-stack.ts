import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, 'mybucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const cluster = new ecs.Cluster(this, 'mycluster', {});

    const loadBalancedFargateService= new ecsPatterns.ApplicationMultipleTargetGroupsFargateService(this, 'myservice', {
      cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      targetGroups: [
        {
          containerPort: 80,
        },
        {
          containerPort: 90,
          pathPattern: 'a/b/c',
          priority: 10
        }
      ]
    });
  }
}
