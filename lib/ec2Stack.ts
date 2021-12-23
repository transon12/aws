import { AutoScalingGroup } from "@aws-cdk/aws-autoscaling";
import * as ec2 from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import * as cdk from '@aws-cdk/core';
import { readFileSync } from 'fs';


interface propsInterface extends cdk.StackProps {
  vpc: ec2.Vpc;
}
export class ec2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: propsInterface) {
    super(scope, id, props);
    const webAmiName = <string>process.env.AMI_NAME;
    const vpc = props.vpc;

    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    });
    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    // alb sg
    const albSg = new ec2.SecurityGroup(this, "alb-sg", {
      vpc,
      allowAllOutbound: true,
    });
    albSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    // create the EC2 Instance
    new ec2.Instance(this, 'public-ec2', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },

      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'simple-instance-2-key',
    });

    const ec2Private = new ec2.Instance(this, "Private-ec2", {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: webserverSG,
      keyName: "simple-instance-2-key",
    });

    const autoScale = new AutoScalingGroup(this, "autoScale", {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.lookup({
        name: webAmiName,
      }),
      securityGroup: webserverSG,
      minCapacity: 1,
      maxCapacity: 2,
      keyName: "simple-instance-2-key",
    });

    const alb = new ApplicationLoadBalancer(this, "alb", {
      vpc: vpc,
      internetFacing: true,
      securityGroup: albSg,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
        onePerAz: true,
      },
    });

    const listener = alb.addListener("abl-setting", {
      port: 80
    })

    listener.addTargets("alb-target", {
      port: 80,
      targets: [autoScale],
      healthCheck: {
        healthyHttpCodes: "200",
        path: "/",
      },
    })

    const userDataScript = readFileSync('./lib/user-data.sh', 'utf8');
    ec2Private.addUserData(userDataScript);
  }
}