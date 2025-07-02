import * as fs from 'fs';
import * as path from 'path';
import { TerraformConfig, TerraformResource } from '../mapper';

/**
 * Generates CDKTF code from Terraform configuration
 */
export class CdktfGenerator {
  /**
   * Generate CDKTF code from Terraform configuration
   * @param config Terraform configuration
   * @param outputDir Output directory
   * @param language Target language (typescript, python, etc.)
   */
  public static generateCode(
    config: TerraformConfig, 
    outputDir: string, 
    language: 'typescript' | 'python' | 'java' = 'typescript'
  ): void {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    switch (language) {
      case 'typescript':
        this.generateTypeScriptCode(config, outputDir);
        break;
      case 'python':
        this.generatePythonCode(config, outputDir);
        break;
      case 'java':
        this.generateJavaCode(config, outputDir);
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  /**
   * Generate TypeScript CDKTF code
   * @param config Terraform configuration
   * @param outputDir Output directory
   */
  private static generateTypeScriptCode(config: TerraformConfig, outputDir: string): void {
    // Generate main.ts
    const mainCode = this.generateTypeScriptMainFile(config);
    fs.writeFileSync(path.join(outputDir, 'main.ts'), mainCode);

    // Generate cdktf.json
    const cdktfConfig = this.generateCdktfConfig();
    fs.writeFileSync(path.join(outputDir, 'cdktf.json'), JSON.stringify(cdktfConfig, null, 2));

    // Generate package.json
    const packageJson = this.generatePackageJson();
    fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  }

  /**
   * Generate TypeScript main file
   * @param config Terraform configuration
   */
  private static generateTypeScriptMainFile(config: TerraformConfig): string {
    const imports = [
      'import { Construct } from "constructs";',
      'import { App, TerraformStack, TerraformOutput } from "cdktf";',
      'import * as aws from "@cdktf/provider-aws";',
    ];

    const variables = Object.entries(config.variables).map(([name, variable]) => {
      const varType = (variable as any).type || 'string';
      return `  public readonly ${name}: ${this.terraformTypeToTypeScript(varType)};`;
    });

    const variableInitializers = Object.entries(config.variables).map(([name, variable]) => {
      const defaultValue = (variable as any).default;
      if (defaultValue !== undefined) {
        return `    this.${name} = props?.${name} ?? ${JSON.stringify(defaultValue)};`;
      } else {
        return `    this.${name} = props.${name};`;
      }
    });

    const resources = config.resources.map(resource => this.generateTypeScriptResource(resource));

    const outputs = Object.entries(config.outputs).map(([name, output]) => {
      const value = (output as any).value;
      let outputValue = value;
      
      if (typeof value === 'string' && (value.includes('props.') || value.includes('.'))) {
        outputValue = value;
      } else {
        outputValue = JSON.stringify(value);
      }
      
      return `    new TerraformOutput(this, "${name}", {
      value: ${outputValue},
      description: ${JSON.stringify((output as any).description)},
    });`;
    });

    return `${imports.join('\n')}

interface MyStackProps {
${Object.entries(config.variables).map(([name, variable]) => {
  const varType = (variable as any).type || 'string';
  const required = (variable as any).default === undefined;
  return `  ${name}${required ? '' : '?'}: ${this.terraformTypeToTypeScript(varType)};`;
}).join('\n')}
}

class MyStack extends TerraformStack {
${variables.join('\n')}

  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id);

${variableInitializers.join('\n')}

    // Define AWS provider
    new aws.AwsProvider(this, "aws", {
      region: "us-west-2", // Change as needed
    });

    // Define resources
${resources.join('\n\n')}

    // Define outputs
${outputs.join('\n\n')}
  }
}

const app = new App();
new MyStack(app, "converted-stack", {
  // Provide values for required variables
});
app.synth();
`;
  }

  /**
   * Generate TypeScript resource
   * @param resource Terraform resource
   */
  private static generateTypeScriptResource(resource: TerraformResource): string {
    const properties = Object.entries(resource.properties)
      .map(([key, value]) => {
        if (typeof value === 'string' && (value.includes('props.') || value.includes('.'))) {
          return `      ${key}: ${value},`;
        } else {
          return `      ${key}: ${JSON.stringify(value)},`;
        }
      })
      .join('\n');

    return `    const ${resource.name} = new aws.${this.pascalCase(resource.type)}(this, "${resource.name}", {
${properties}
    });`;
  }

  /**
   * Generate cdktf.json configuration
   */
  private static generateCdktfConfig(): any {
    return {
      "language": "typescript",
      "app": "npm run --silent compile && node main.js",
      "projectId": "converted-project",
      "sendCrashReports": false,
      "terraformProviders": [
        "aws@~> 4.0"
      ],
      "terraformModules": [],
      "context": {
        "excludeStackIdFromLogicalIds": "true",
        "allowSepCharsInLogicalIds": "true"
      }
    };
  }

  /**
   * Generate package.json
   */
  private static generatePackageJson(): any {
    return {
      "name": "converted-cdktf-project",
      "version": "1.0.0",
      "main": "main.js",
      "types": "main.ts",
      "license": "MPL-2.0",
      "private": true,
      "scripts": {
        "get": "cdktf get",
        "build": "tsc",
        "synth": "cdktf synth",
        "compile": "tsc --pretty",
        "watch": "tsc -w",
        "test": "jest",
        "upgrade": "npm i cdktf@latest cdktf-cli@latest",
        "upgrade:next": "npm i cdktf@next cdktf-cli@next"
      },
      "engines": {
        "node": ">=14.0"
      },
      "dependencies": {
        "@cdktf/provider-aws": "^12.0.0",
        "cdktf": "^0.15.0",
        "constructs": "^10.1.0"
      },
      "devDependencies": {
        "@types/jest": "^29.4.0",
        "@types/node": "^18.14.6",
        "jest": "^29.5.0",
        "ts-jest": "^29.0.5",
        "ts-node": "^10.9.1",
        "typescript": "^4.9.5"
      }
    };
  }

  /**
   * Generate Python CDKTF code
   * @param config Terraform configuration
   * @param outputDir Output directory
   */
  private static generatePythonCode(_config: TerraformConfig, outputDir: string): void {
    // Simplified implementation - would need to be expanded for a real tool
    const mainCode = `#!/usr/bin/env python
from constructs import Construct
from cdktf import App, TerraformStack, TerraformOutput
from cdktf_cdktf_provider_aws import AwsProvider

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        # Define AWS provider
        AwsProvider(self, "aws", region="us-west-2")

        # TODO: Add resources and outputs

app = App()
MyStack(app, "converted-stack")
app.synth()
`;
    fs.writeFileSync(path.join(outputDir, 'main.py'), mainCode);
  }

  /**
   * Generate Java CDKTF code
   * @param config Terraform configuration
   * @param outputDir Output directory
   */
  private static generateJavaCode(_config: TerraformConfig, outputDir: string): void {
    // Simplified implementation - would need to be expanded for a real tool
    const mainCode = `package com.mycompany.app;

import com.hashicorp.cdktf.App;
import com.hashicorp.cdktf.TerraformStack;
import software.constructs.Construct;
import com.hashicorp.cdktf.providers.aws.AwsProvider;

public class Main extends TerraformStack {
    public Main(final Construct scope, final String id) {
        super(scope, id);

        // Define AWS provider
        AwsProvider.Builder.create(this, "aws")
            .region("us-west-2")
            .build();

        // TODO: Add resources and outputs
    }

    public static void main(String[] args) {
        final App app = new App();
        new Main(app, "converted-stack");
        app.synth();
    }
}
`;
    fs.writeFileSync(path.join(outputDir, 'Main.java'), mainCode);
  }

  /**
   * Convert Terraform type to TypeScript type
   * @param terraformType Terraform type
   */
  private static terraformTypeToTypeScript(terraformType: string): string {
    if (terraformType.startsWith('string')) {
      return 'string';
    } else if (terraformType.startsWith('number')) {
      return 'number';
    } else if (terraformType.startsWith('bool')) {
      return 'boolean';
    } else if (terraformType.startsWith('list')) {
      const innerType = terraformType.match(/list\((.*)\)/)?.[1] || 'any';
      return `${this.terraformTypeToTypeScript(innerType)}[]`;
    } else if (terraformType.startsWith('map')) {
      const innerType = terraformType.match(/map\((.*)\)/)?.[1] || 'any';
      return `Record<string, ${this.terraformTypeToTypeScript(innerType)}>`;
    } else {
      return 'any';
    }
  }

  /**
   * Convert string to PascalCase
   * @param str Input string
   */
  private static pascalCase(str: string): string {
    return str
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}
