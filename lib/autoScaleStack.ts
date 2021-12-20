import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

export class autoScalingStack extends cdk.Stack {
    private autoScaling: autoscaling.AutoScalingGroup;
    constructor(scope: cdk.Construct,
        id: string,
        props?: props) {
        super(scope, id, props);

        // create autoscalingGroup
        this.autoScaling = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc: props.Vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.lookup({
                name: <string>process.env.AMI_NAME,
            }),
            securityGroup: props.sg.getAutoScalingSg(),
            minCapacity: 1,
            maxCapacity: 4,
        });

        const workerUtilizationMetric = new cloudwatch.Metric({
            namespace: 'MyService',
            metricName: 'WorkerUtilization'
        });

        this.autoScaling.scaleOnMetric('ScaleToCPU', {
            metric: workerUtilizationMetric,
            scalingSteps: [
                { upper: 10, change: -1 },
                { lower: 50, change: +1 },
                { lower: 70, change: +3 },
            ],

            // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
            // 'change' numbers before as percentages instead of capacity counts.
            adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
        });

    };

    getAutoscaling() {
        return this.autoScaling;
    }
}