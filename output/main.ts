import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import * as aws from "@cdktf/provider-aws";

interface MyStackProps {
  BucketName?: string;
}

class MyStack extends TerraformStack {
  public readonly BucketName: string;

  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id);

    this.BucketName = props?.BucketName ?? "my-sample-bucket";

    // Define AWS provider
    new aws.AwsProvider(this, "aws", {
      region: "us-west-2", // Change as needed
    });

    // Define resources
    const mys3bucket = new aws.AwsS3Bucket(this, "mys3bucket", {
      _bucket_name: props.BucketName,
      _access_control: "Private",
      _versioning_configuration: {"_status":"Enabled"},
      _tags: [{"_key":"Environment","_value":"Development"}],
    });

    // Define outputs
    new TerraformOutput(this, "BucketArn", {
      value: mys3bucket._arn,
      description: "ARN of the S3 bucket",
    });

    new TerraformOutput(this, "BucketName", {
      value: "mys3bucket",
      description: "Name of the S3 bucket",
    });
  }
}

const app = new App();
new MyStack(app, "converted-stack", {
  // Provide values for required variables
});
app.synth();
