import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import * as iam from '@aws-cdk/aws-iam';
import { readFileSync } from 'fs';
// import { KeyPair } from 'cdk-ec2-key-pair';

export class VpcCreateNewStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC },
      ]
    });

    //Create a new security group. With this setup the instance will have no inbound permission and allow all outbound connections.
    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    });
    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
    );
    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
    );
    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
    );

    // //  create a Role for the EC2 Instance
    // const webserverRole = new iam.Role(this, 'webserver-role', {
    //   assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName(''),
    //   ],
    // });


    // create the EC2 Instance
    const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
      vpc,
      // set the subnet type to PUBLIC
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },

      securityGroup: webserverSG,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'simple-instance-2-key',
    });

    //  load contents of script
    const userDataScript = readFileSync('./lib/user-data.sh', 'utf8');
    // add the User Data script to the Instance
    ec2Instance.addUserData(userDataScript);
  }
}