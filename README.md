# CloudFormation to CDKTF Converter

A tool to convert AWS CloudFormation templates to CDK for Terraform (CDKTF) code.

## Overview

This project provides a conversion tool that takes AWS CloudFormation templates (in JSON or YAML format) and generates equivalent CDK for Terraform (CDKTF) code. The tool supports generating code in TypeScript, Python, and Java.

## Features

- Parse CloudFormation templates (JSON/YAML)
- Map CloudFormation resources to Terraform resources
- Generate CDKTF code in multiple languages
- Support for common AWS resources
- CLI interface for easy usage

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later
- CDKTF CLI (optional, for working with the generated code)

## Installation

```bash
# Clone the repository
git clone https://github.com/MASAKIOKUDA-eng/convert-cloudformation-cdktf.git
cd convert-cloudformation-cdktf

# Install dependencies
npm install

# Build the project
npm run build

# Link the CLI tool (optional)
npm link
```

## Usage

### CLI

```bash
# Using npx
npx cf-to-cdktf --input path/to/template.yaml --output ./output-dir --language typescript

# If linked globally
cf-to-cdktf --input path/to/template.yaml --output ./output-dir --language typescript
```

### API

```typescript
import { CloudFormationParser, ResourceMapper, CdktfGenerator } from 'cf-to-cdktf';

// Parse CloudFormation template
const template = CloudFormationParser.parseFile('path/to/template.yaml');

// Map to Terraform resources
const terraformConfig = ResourceMapper.mapTemplate(template);

// Generate CDKTF code
CdktfGenerator.generateCode(terraformConfig, './output-dir', 'typescript');
```

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
│   ├── mapper/       # Resource mapping logic
│   ├── generator/    # CDKTF code generation
│   └── cli/          # Command-line interface
├── sample-templates/ # Sample CloudFormation templates
└── tests/            # Test cases
```

### Building

```bash
npm run build        # Build the project
npm run build:watch  # Build in watch mode
```

### Testing

```bash
npm test
```

### Packaging

```bash
npm run package      # Create packages for different languages
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
