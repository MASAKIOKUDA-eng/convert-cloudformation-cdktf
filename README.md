# CloudFormation to CDKTF Converter

A tool to convert AWS CloudFormation templates to CDK for Terraform (CDKTF) code.

## Overview

This project provides a conversion tool that takes AWS CloudFormation templates (in JSON or YAML format) and generates equivalent CDK for Terraform (CDKTF) code. The tool currently supports generating code in TypeScript, with basic support for Python and Java.

## Features

- Parse CloudFormation templates (JSON/YAML)
- Support for CloudFormation intrinsic functions (!Ref, !GetAtt)
- Map CloudFormation resources to Terraform resources
- Generate CDKTF code in TypeScript (with basic Python and Java support)
- CLI interface for easy usage

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/convert-cloudformation-cdktf.git
cd convert-cloudformation-cdktf

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### CLI

```bash
# Using node directly
node lib/cli/index.js --input path/to/template.yaml --output ./output-dir --language typescript

# Example with the included sample template
node lib/cli/index.js --input sample-templates/s3-bucket.yaml --output ./output
```

### Options

- `--input`, `-i`: Path to the CloudFormation template file (required)
- `--output`, `-o`: Output directory for CDKTF code (default: './cdktf-output')
- `--language`, `-l`: Target language for CDKTF code (choices: 'typescript', 'python', 'java', default: 'typescript')
- `--help`, `-h`: Show help information

## Example Conversion

### Input: CloudFormation Template (YAML)

Below is a sample CloudFormation template for an S3 bucket that's included in the `sample-templates` directory:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Sample template for S3 bucket'

Parameters:
  BucketName:
    Type: String
    Description: Name of the S3 bucket
    Default: my-sample-bucket

Resources:
  MyS3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Ref BucketName
      AccessControl: Private
      VersioningConfiguration:
        Status: Enabled
      Tags:
        - Key: Environment
          Value: Development

Outputs:
  BucketArn:
    Description: ARN of the S3 bucket
    Value: !GetAtt MyS3Bucket.Arn
  BucketName:
    Description: Name of the S3 bucket
    Value: !Ref MyS3Bucket
```

### Converting the Template

To convert this template to CDKTF code:

```bash
node lib/cli/index.js --input sample-templates/s3-bucket.yaml --output ./output
```

### Output: Generated CDKTF Code (TypeScript)

The tool will generate the following files in the output directory:

1. `main.ts` - The main CDKTF code
2. `cdktf.json` - CDKTF configuration
3. `package.json` - Package dependencies

The generated `main.ts` will look like this:

```typescript
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
```

## Working with the Generated Code

After generating the CDKTF code, you can use it with the CDKTF CLI:

```bash
# Navigate to the output directory
cd output

# Install dependencies
npm install

# Install CDKTF CLI if you haven't already
npm install -g cdktf-cli

# Initialize CDKTF (if needed)
cdktf init --template=typescript --local

# Synthesize Terraform configuration
npm run synth

# Deploy the infrastructure (requires Terraform)
cdktf deploy
```

Note: You may need to adjust some property names in the generated code to match the exact CDKTF provider requirements.

## Supported Resources

Currently, the tool supports mapping the following CloudFormation resources to Terraform:

- AWS::S3::Bucket
- AWS::IAM::Role
- AWS::Lambda::Function
- AWS::DynamoDB::Table

More resources will be added in future updates.

## Development

### Project Structure

```
convert-cloudformation-cdktf/
├── src/
│   ├── parser/       # CloudFormation template parser
│   │   └── index.ts  # Parses CloudFormation templates
│   ├── mapper/       # Resource mapping logic
│   │   └── index.ts  # Maps CloudFormation to Terraform resources
│   ├── generator/    # CDKTF code generation
│   │   └── index.ts  # Generates CDKTF code
│   └── cli/          # Command-line interface
│       └── index.ts  # CLI entry point
├── sample-templates/ # Sample CloudFormation templates
│   └── s3-bucket.yaml # Sample S3 bucket template
└── package.json      # Project dependencies
```

### Building

```bash
npm run build        # Build the project
```

### Testing

```bash
# Run the converter with a sample template
node lib/cli/index.js --input sample-templates/s3-bucket.yaml --output ./test-output
```

## Adding More Resource Types

To add support for more CloudFormation resource types:

1. Update the `resourceTypeMapping` in `src/mapper/index.ts`
2. Add specific property mapping logic if needed
3. Test with sample templates

## Limitations

- Not all CloudFormation resources and functions are supported yet
- Complex intrinsic functions (Fn::Join, Fn::Sub, etc.) might not be correctly converted
- Generated code may require manual adjustments for optimal functionality
- Resource properties might need renaming to match CDKTF conventions
- The tool currently focuses on TypeScript output, with basic Python and Java support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
