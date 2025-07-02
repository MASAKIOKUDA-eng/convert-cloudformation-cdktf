"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdktfGenerator = void 0;
const fs = require("fs");
const path = require("path");
/**
 * Generates CDKTF code from Terraform configuration
 */
class CdktfGenerator {
    /**
     * Generate CDKTF code from Terraform configuration
     * @param config Terraform configuration
     * @param outputDir Output directory
     * @param language Target language (typescript, python, etc.)
     */
    static generateCode(config, outputDir, language = 'typescript') {
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
    static generateTypeScriptCode(config, outputDir) {
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
    static generateTypeScriptMainFile(config) {
        const imports = [
            'import { Construct } from "constructs";',
            'import { App, TerraformStack } from "cdktf";',
            'import * as aws from "@cdktf/provider-aws";',
        ];
        const variables = Object.entries(config.variables).map(([name, variable]) => {
            const varType = variable.type || 'string';
            return `  public readonly ${name}: ${this.terraformTypeToTypeScript(varType)};`;
        });
        const variableInitializers = Object.entries(config.variables).map(([name, variable]) => {
            const defaultValue = variable.default;
            if (defaultValue !== undefined) {
                return `    this.${name} = props?.${name} ?? ${JSON.stringify(defaultValue)};`;
            }
            else {
                return `    this.${name} = props.${name};`;
            }
        });
        const resources = config.resources.map(resource => this.generateTypeScriptResource(resource));
        const outputs = Object.entries(config.outputs).map(([name, output]) => {
            return `    new TerraformOutput(this, "${name}", {
      value: ${output.value},
      description: ${JSON.stringify(output.description)},
    });`;
        });
        return `${imports.join('\n')}

interface MyStackProps {
${Object.entries(config.variables).map(([name, variable]) => {
            const varType = variable.type || 'string';
            const required = variable.default === undefined;
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
    static generateTypeScriptResource(resource) {
        const properties = Object.entries(resource.properties)
            .map(([key, value]) => `      ${key}: ${JSON.stringify(value)},`)
            .join('\n');
        return `    new aws.${this.pascalCase(resource.type)}(this, "${resource.name}", {
${properties}
    });`;
    }
    /**
     * Generate cdktf.json configuration
     */
    static generateCdktfConfig() {
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
    static generatePackageJson() {
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
    static generatePythonCode(_config, outputDir) {
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
    static generateJavaCode(_config, outputDir) {
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
    static terraformTypeToTypeScript(terraformType) {
        if (terraformType.startsWith('string')) {
            return 'string';
        }
        else if (terraformType.startsWith('number')) {
            return 'number';
        }
        else if (terraformType.startsWith('bool')) {
            return 'boolean';
        }
        else if (terraformType.startsWith('list')) {
            const innerType = terraformType.match(/list\((.*)\)/)?.[1] || 'any';
            return `${this.terraformTypeToTypeScript(innerType)}[]`;
        }
        else if (terraformType.startsWith('map')) {
            const innerType = terraformType.match(/map\((.*)\)/)?.[1] || 'any';
            return `Record<string, ${this.terraformTypeToTypeScript(innerType)}>`;
        }
        else {
            return 'any';
        }
    }
    /**
     * Convert string to PascalCase
     * @param str Input string
     */
    static pascalCase(str) {
        return str
            .split('_')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }
}
exports.CdktfGenerator = CdktfGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBRzdCOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBQ3pCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FDeEIsTUFBdUIsRUFDdkIsU0FBaUIsRUFDakIsV0FBNkMsWUFBWTtRQUV6RCw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxRQUFRLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLEtBQUssWUFBWTtnQkFDZixJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNO1lBQ1IsS0FBSyxRQUFRO2dCQUNYLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzNDLE1BQU07WUFDUixLQUFLLE1BQU07Z0JBQ1QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDekMsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDekQsQ0FBQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssTUFBTSxDQUFDLHNCQUFzQixDQUFDLE1BQXVCLEVBQUUsU0FBaUI7UUFDOUUsbUJBQW1CO1FBQ25CLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxF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O1lBQ25FLE9BQU8sa0JBQWtCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3hFLENBQUM7YUFBTSxDQUFDO1lBQ04sT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBVztRQUNuQyxPQUFPLEdBQUc7YUFDUCxLQUFLLENBQUMsR0FBRyxDQUFDO2FBQ1YsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNkLENBQUM7Q0FDRjtBQXRTRCx3Q0FzU0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVGVycmFmb3JtQ29uZmlnLCBUZXJyYWZvcm1SZXNvdXJjZSB9IGZyb20gJy4uL21hcHBlcic7XG5cbi8qKlxuICogR2VuZXJhdGVzIENES1RGIGNvZGUgZnJvbSBUZXJyYWZvcm0gY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY2xhc3MgQ2RrdGZHZW5lcmF0b3Ige1xuICAvKipcbiAgICogR2VuZXJhdGUgQ0RLVEYgY29kZSBmcm9tIFRlcnJhZm9ybSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBjb25maWcgVGVycmFmb3JtIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIG91dHB1dERpciBPdXRwdXQgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBsYW5ndWFnZSBUYXJnZXQgbGFuZ3VhZ2UgKHR5cGVzY3JpcHQsIHB5dGhvbiwgZXRjLilcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2VuZXJhdGVDb2RlKFxuICAgIGNvbmZpZzogVGVycmFmb3JtQ29uZmlnLCBcbiAgICBvdXRwdXREaXI6IHN0cmluZywgXG4gICAgbGFuZ3VhZ2U6ICd0eXBlc2NyaXB0JyB8ICdweXRob24nIHwgJ2phdmEnID0gJ3R5cGVzY3JpcHQnXG4gICk6IHZvaWQge1xuICAgIC8vIENyZWF0ZSBvdXRwdXQgZGlyZWN0b3J5IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMob3V0cHV0RGlyKSkge1xuICAgICAgZnMubWtkaXJTeW5jKG91dHB1dERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgY2FzZSAndHlwZXNjcmlwdCc6XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVUeXBlU2NyaXB0Q29kZShjb25maWcsIG91dHB1dERpcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHl0aG9uJzpcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVB5dGhvbkNvZGUoY29uZmlnLCBvdXRwdXREaXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2phdmEnOlxuICAgICAgICB0aGlzLmdlbmVyYXRlSmF2YUNvZGUoY29uZmlnLCBvdXRwdXREaXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbGFuZ3VhZ2U6ICR7bGFuZ3VhZ2V9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIFR5cGVTY3JpcHQgQ0RLVEYgY29kZVxuICAgKiBAcGFyYW0gY29uZmlnIFRlcnJhZm9ybSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBvdXRwdXREaXIgT3V0cHV0IGRpcmVjdG9yeVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUeXBlU2NyaXB0Q29kZShjb25maWc6IFRlcnJhZm9ybUNvbmZpZywgb3V0cHV0RGlyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBHZW5lcmF0ZSBtYWluLnRzXG4gICAgY29uc3QgbWFpbkNvZGUgPSB0aGlzLmdlbmVyYXRlVHlwZVNjcmlwdE1haW5GaWxlKGNvbmZpZyk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0RGlyLCAnbWFpbi50cycpLCBtYWluQ29kZSk7XG5cbiAgICAvLyBHZW5lcmF0ZSBjZGt0Zi5qc29uXG4gICAgY29uc3QgY2RrdGZDb25maWcgPSB0aGlzLmdlbmVyYXRlQ2RrdGZDb25maWcoKTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXREaXIsICdjZGt0Zi5qc29uJyksIEpTT04uc3RyaW5naWZ5KGNka3RmQ29uZmlnLCBudWxsLCAyKSk7XG5cbiAgICAvLyBHZW5lcmF0ZSBwYWNrYWdlLmpzb25cbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IHRoaXMuZ2VuZXJhdGVQYWNrYWdlSnNvbigpO1xuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dERpciwgJ3BhY2thZ2UuanNvbicpLCBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbiwgbnVsbCwgMikpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIFR5cGVTY3JpcHQgbWFpbiBmaWxlXG4gICAqIEBwYXJhbSBjb25maWcgVGVycmFmb3JtIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHlwZVNjcmlwdE1haW5GaWxlKGNvbmZpZzogVGVycmFmb3JtQ29uZmlnKTogc3RyaW5nIHtcbiAgICBjb25zdCBpbXBvcnRzID0gW1xuICAgICAgJ2ltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7JyxcbiAgICAgICdpbXBvcnQgeyBBcHAsIFRlcnJhZm9ybVN0YWNrIH0gZnJvbSBcImNka3RmXCI7JyxcbiAgICAgICdpbXBvcnQgKiBhcyBhd3MgZnJvbSBcIkBjZGt0Zi9wcm92aWRlci1hd3NcIjsnLFxuICAgIF07XG5cbiAgICBjb25zdCB2YXJpYWJsZXMgPSBPYmplY3QuZW50cmllcyhjb25maWcudmFyaWFibGVzKS5tYXAoKFtuYW1lLCB2YXJpYWJsZV0pID0+IHtcbiAgICAgIGNvbnN0IHZhclR5cGUgPSAodmFyaWFibGUgYXMgYW55KS50eXBlIHx8ICdzdHJpbmcnO1xuICAgICAgcmV0dXJuIGAgIHB1YmxpYyByZWFkb25seSAke25hbWV9OiAke3RoaXMudGVycmFmb3JtVHlwZVRvVHlwZVNjcmlwdCh2YXJUeXBlKX07YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHZhcmlhYmxlSW5pdGlhbGl6ZXJzID0gT2JqZWN0LmVudHJpZXMoY29uZmlnLnZhcmlhYmxlcykubWFwKChbbmFtZSwgdmFyaWFibGVdKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSAodmFyaWFibGUgYXMgYW55KS5kZWZhdWx0O1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBgICAgIHRoaXMuJHtuYW1lfSA9IHByb3BzPy4ke25hbWV9ID8/ICR7SlNPTi5zdHJpbmdpZnkoZGVmYXVsdFZhbHVlKX07YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBgICAgIHRoaXMuJHtuYW1lfSA9IHByb3BzLiR7bmFtZX07YDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlcyA9IGNvbmZpZy5yZXNvdXJjZXMubWFwKHJlc291cmNlID0+IHRoaXMuZ2VuZXJhdGVUeXBlU2NyaXB0UmVzb3VyY2UocmVzb3VyY2UpKTtcblxuICAgIGNvbnN0IG91dHB1dHMgPSBPYmplY3QuZW50cmllcyhjb25maWcub3V0cHV0cykubWFwKChbbmFtZSwgb3V0cHV0XSkgPT4ge1xuICAgICAgcmV0dXJuIGAgICAgbmV3IFRlcnJhZm9ybU91dHB1dCh0aGlzLCBcIiR7bmFtZX1cIiwge1xuICAgICAgdmFsdWU6ICR7KG91dHB1dCBhcyBhbnkpLnZhbHVlfSxcbiAgICAgIGRlc2NyaXB0aW9uOiAke0pTT04uc3RyaW5naWZ5KChvdXRwdXQgYXMgYW55KS5kZXNjcmlwdGlvbil9LFxuICAgIH0pO2A7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYCR7aW1wb3J0cy5qb2luKCdcXG4nKX1cblxuaW50ZXJmYWNlIE15U3RhY2tQcm9wcyB7XG4ke09iamVjdC5lbnRyaWVzKGNvbmZpZy52YXJpYWJsZXMpLm1hcCgoW25hbWUsIHZhcmlhYmxlXSkgPT4ge1xuICBjb25zdCB2YXJUeXBlID0gKHZhcmlhYmxlIGFzIGFueSkudHlwZSB8fCAnc3RyaW5nJztcbiAgY29uc3QgcmVxdWlyZWQgPSAodmFyaWFibGUgYXMgYW55KS5kZWZhdWx0ID09PSB1bmRlZmluZWQ7XG4gIHJldHVybiBgICAke25hbWV9JHtyZXF1aXJlZCA/ICcnIDogJz8nfTogJHt0aGlzLnRlcnJhZm9ybVR5cGVUb1R5cGVTY3JpcHQodmFyVHlwZSl9O2A7XG59KS5qb2luKCdcXG4nKX1cbn1cblxuY2xhc3MgTXlTdGFjayBleHRlbmRzIFRlcnJhZm9ybVN0YWNrIHtcbiR7dmFyaWFibGVzLmpvaW4oJ1xcbicpfVxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNeVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4ke3ZhcmlhYmxlSW5pdGlhbGl6ZXJzLmpvaW4oJ1xcbicpfVxuXG4gICAgLy8gRGVmaW5lIEFXUyBwcm92aWRlclxuICAgIG5ldyBhd3MuQXdzUHJvdmlkZXIodGhpcywgXCJhd3NcIiwge1xuICAgICAgcmVnaW9uOiBcInVzLXdlc3QtMlwiLCAvLyBDaGFuZ2UgYXMgbmVlZGVkXG4gICAgfSk7XG5cbiAgICAvLyBEZWZpbmUgcmVzb3VyY2VzXG4ke3Jlc291cmNlcy5qb2luKCdcXG5cXG4nKX1cblxuICAgIC8vIERlZmluZSBvdXRwdXRzXG4ke291dHB1dHMuam9pbignXFxuXFxuJyl9XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IE15U3RhY2soYXBwLCBcImNvbnZlcnRlZC1zdGFja1wiLCB7XG4gIC8vIFByb3ZpZGUgdmFsdWVzIGZvciByZXF1aXJlZCB2YXJpYWJsZXNcbn0pO1xuYXBwLnN5bnRoKCk7XG5gO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIFR5cGVTY3JpcHQgcmVzb3VyY2VcbiAgICogQHBhcmFtIHJlc291cmNlIFRlcnJhZm9ybSByZXNvdXJjZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUeXBlU2NyaXB0UmVzb3VyY2UocmVzb3VyY2U6IFRlcnJhZm9ybVJlc291cmNlKTogc3RyaW5nIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmVudHJpZXMocmVzb3VyY2UucHJvcGVydGllcylcbiAgICAgIC5tYXAoKFtrZXksIHZhbHVlXSkgPT4gYCAgICAgICR7a2V5fTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9LGApXG4gICAgICAuam9pbignXFxuJyk7XG5cbiAgICByZXR1cm4gYCAgICBuZXcgYXdzLiR7dGhpcy5wYXNjYWxDYXNlKHJlc291cmNlLnR5cGUpfSh0aGlzLCBcIiR7cmVzb3VyY2UubmFtZX1cIiwge1xuJHtwcm9wZXJ0aWVzfVxuICAgIH0pO2A7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgY2RrdGYuanNvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZUNka3RmQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwibGFuZ3VhZ2VcIjogXCJ0eXBlc2NyaXB0XCIsXG4gICAgICBcImFwcFwiOiBcIm5wbSBydW4gLS1zaWxlbnQgY29tcGlsZSAmJiBub2RlIG1haW4uanNcIixcbiAgICAgIFwicHJvamVjdElkXCI6IFwiY29udmVydGVkLXByb2plY3RcIixcbiAgICAgIFwic2VuZENyYXNoUmVwb3J0c1wiOiBmYWxzZSxcbiAgICAgIFwidGVycmFmb3JtUHJvdmlkZXJzXCI6IFtcbiAgICAgICAgXCJhd3NAfj4gNC4wXCJcbiAgICAgIF0sXG4gICAgICBcInRlcnJhZm9ybU1vZHVsZXNcIjogW10sXG4gICAgICBcImNvbnRleHRcIjoge1xuICAgICAgICBcImV4Y2x1ZGVTdGFja0lkRnJvbUxvZ2ljYWxJZHNcIjogXCJ0cnVlXCIsXG4gICAgICAgIFwiYWxsb3dTZXBDaGFyc0luTG9naWNhbElkc1wiOiBcInRydWVcIlxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgcGFja2FnZS5qc29uXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVBhY2thZ2VKc29uKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwibmFtZVwiOiBcImNvbnZlcnRlZC1jZGt0Zi1wcm9qZWN0XCIsXG4gICAgICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICAgICAgXCJtYWluXCI6IFwibWFpbi5qc1wiLFxuICAgICAgXCJ0eXBlc1wiOiBcIm1haW4udHNcIixcbiAgICAgIFwibGljZW5zZVwiOiBcIk1QTC0yLjBcIixcbiAgICAgIFwicHJpdmF0ZVwiOiB0cnVlLFxuICAgICAgXCJzY3JpcHRzXCI6IHtcbiAgICAgICAgXCJnZXRcIjogXCJjZGt0ZiBnZXRcIixcbiAgICAgICAgXCJidWlsZFwiOiBcInRzY1wiLFxuICAgICAgICBcInN5bnRoXCI6IFwiY2RrdGYgc3ludGhcIixcbiAgICAgICAgXCJjb21waWxlXCI6IFwidHNjIC0tcHJldHR5XCIsXG4gICAgICAgIFwid2F0Y2hcIjogXCJ0c2MgLXdcIixcbiAgICAgICAgXCJ0ZXN0XCI6IFwiamVzdFwiLFxuICAgICAgICBcInVwZ3JhZGVcIjogXCJucG0gaSBjZGt0ZkBsYXRlc3QgY2RrdGYtY2xpQGxhdGVzdFwiLFxuICAgICAgICBcInVwZ3JhZGU6bmV4dFwiOiBcIm5wbSBpIGNka3RmQG5leHQgY2RrdGYtY2xpQG5leHRcIlxuICAgICAgfSxcbiAgICAgIFwiZW5naW5lc1wiOiB7XG4gICAgICAgIFwibm9kZVwiOiBcIj49MTQuMFwiXG4gICAgICB9LFxuICAgICAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgICAgICBcIkBjZGt0Zi9wcm92aWRlci1hd3NcIjogXCJeMTIuMC4wXCIsXG4gICAgICAgIFwiY2RrdGZcIjogXCJeMC4xNS4wXCIsXG4gICAgICAgIFwiY29uc3RydWN0c1wiOiBcIl4xMC4xLjBcIlxuICAgICAgfSxcbiAgICAgIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICAgICAgXCJAdHlwZXMvamVzdFwiOiBcIl4yOS40LjBcIixcbiAgICAgICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4xOC4xNC42XCIsXG4gICAgICAgIFwiamVzdFwiOiBcIl4yOS41LjBcIixcbiAgICAgICAgXCJ0cy1qZXN0XCI6IFwiXjI5LjAuNVwiLFxuICAgICAgICBcInRzLW5vZGVcIjogXCJeMTAuOS4xXCIsXG4gICAgICAgIFwidHlwZXNjcmlwdFwiOiBcIl40LjkuNVwiXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBQeXRob24gQ0RLVEYgY29kZVxuICAgKiBAcGFyYW0gY29uZmlnIFRlcnJhZm9ybSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBvdXRwdXREaXIgT3V0cHV0IGRpcmVjdG9yeVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVQeXRob25Db2RlKF9jb25maWc6IFRlcnJhZm9ybUNvbmZpZywgb3V0cHV0RGlyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBTaW1wbGlmaWVkIGltcGxlbWVudGF0aW9uIC0gd291bGQgbmVlZCB0byBiZSBleHBhbmRlZCBmb3IgYSByZWFsIHRvb2xcbiAgICBjb25zdCBtYWluQ29kZSA9IGAjIS91c3IvYmluL2VudiBweXRob25cbmZyb20gY29uc3RydWN0cyBpbXBvcnQgQ29uc3RydWN0XG5mcm9tIGNka3RmIGltcG9ydCBBcHAsIFRlcnJhZm9ybVN0YWNrLCBUZXJyYWZvcm1PdXRwdXRcbmZyb20gY2RrdGZfY2RrdGZfcHJvdmlkZXJfYXdzIGltcG9ydCBBd3NQcm92aWRlclxuXG5jbGFzcyBNeVN0YWNrKFRlcnJhZm9ybVN0YWNrKTpcbiAgICBkZWYgX19pbml0X18oc2VsZiwgc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cik6XG4gICAgICAgIHN1cGVyKCkuX19pbml0X18oc2NvcGUsIGlkKVxuXG4gICAgICAgICMgRGVmaW5lIEFXUyBwcm92aWRlclxuICAgICAgICBBd3NQcm92aWRlcihzZWxmLCBcImF3c1wiLCByZWdpb249XCJ1cy13ZXN0LTJcIilcblxuICAgICAgICAjIFRPRE86IEFkZCByZXNvdXJjZXMgYW5kIG91dHB1dHNcblxuYXBwID0gQXBwKClcbk15U3RhY2soYXBwLCBcImNvbnZlcnRlZC1zdGFja1wiKVxuYXBwLnN5bnRoKClcbmA7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0RGlyLCAnbWFpbi5weScpLCBtYWluQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgSmF2YSBDREtURiBjb2RlXG4gICAqIEBwYXJhbSBjb25maWcgVGVycmFmb3JtIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIG91dHB1dERpciBPdXRwdXQgZGlyZWN0b3J5XG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZUphdmFDb2RlKF9jb25maWc6IFRlcnJhZm9ybUNvbmZpZywgb3V0cHV0RGlyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBTaW1wbGlmaWVkIGltcGxlbWVudGF0aW9uIC0gd291bGQgbmVlZCB0byBiZSBleHBhbmRlZCBmb3IgYSByZWFsIHRvb2xcbiAgICBjb25zdCBtYWluQ29kZSA9IGBwYWNrYWdlIGNvbS5teWNvbXBhbnkuYXBwO1xuXG5pbXBvcnQgY29tLmhhc2hpY29ycC5jZGt0Zi5BcHA7XG5pbXBvcnQgY29tLmhhc2hpY29ycC5jZGt0Zi5UZXJyYWZvcm1TdGFjaztcbmltcG9ydCBzb2Z0d2FyZS5jb25zdHJ1Y3RzLkNvbnN0cnVjdDtcbmltcG9ydCBjb20uaGFzaGljb3JwLmNka3RmLnByb3ZpZGVycy5hd3MuQXdzUHJvdmlkZXI7XG5cbnB1YmxpYyBjbGFzcyBNYWluIGV4dGVuZHMgVGVycmFmb3JtU3RhY2sge1xuICAgIHB1YmxpYyBNYWluKGZpbmFsIENvbnN0cnVjdCBzY29wZSwgZmluYWwgU3RyaW5nIGlkKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgLy8gRGVmaW5lIEFXUyBwcm92aWRlclxuICAgICAgICBBd3NQcm92aWRlci5CdWlsZGVyLmNyZWF0ZSh0aGlzLCBcImF3c1wiKVxuICAgICAgICAgICAgLnJlZ2lvbihcInVzLXdlc3QtMlwiKVxuICAgICAgICAgICAgLmJ1aWxkKCk7XG5cbiAgICAgICAgLy8gVE9ETzogQWRkIHJlc291cmNlcyBhbmQgb3V0cHV0c1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBtYWluKFN0cmluZ1tdIGFyZ3MpIHtcbiAgICAgICAgZmluYWwgQXBwIGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgICAgbmV3IE1haW4oYXBwLCBcImNvbnZlcnRlZC1zdGFja1wiKTtcbiAgICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfVxufVxuYDtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXREaXIsICdNYWluLmphdmEnKSwgbWFpbkNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgVGVycmFmb3JtIHR5cGUgdG8gVHlwZVNjcmlwdCB0eXBlXG4gICAqIEBwYXJhbSB0ZXJyYWZvcm1UeXBlIFRlcnJhZm9ybSB0eXBlXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyB0ZXJyYWZvcm1UeXBlVG9UeXBlU2NyaXB0KHRlcnJhZm9ybVR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRlcnJhZm9ybVR5cGUuc3RhcnRzV2l0aCgnc3RyaW5nJykpIHtcbiAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICB9IGVsc2UgaWYgKHRlcnJhZm9ybVR5cGUuc3RhcnRzV2l0aCgnbnVtYmVyJykpIHtcbiAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICB9IGVsc2UgaWYgKHRlcnJhZm9ybVR5cGUuc3RhcnRzV2l0aCgnYm9vbCcpKSB7XG4gICAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICAgIH0gZWxzZSBpZiAodGVycmFmb3JtVHlwZS5zdGFydHNXaXRoKCdsaXN0JykpIHtcbiAgICAgIGNvbnN0IGlubmVyVHlwZSA9IHRlcnJhZm9ybVR5cGUubWF0Y2goL2xpc3RcXCgoLiopXFwpLyk/LlsxXSB8fCAnYW55JztcbiAgICAgIHJldHVybiBgJHt0aGlzLnRlcnJhZm9ybVR5cGVUb1R5cGVTY3JpcHQoaW5uZXJUeXBlKX1bXWA7XG4gICAgfSBlbHNlIGlmICh0ZXJyYWZvcm1UeXBlLnN0YXJ0c1dpdGgoJ21hcCcpKSB7XG4gICAgICBjb25zdCBpbm5lclR5cGUgPSB0ZXJyYWZvcm1UeXBlLm1hdGNoKC9tYXBcXCgoLiopXFwpLyk/LlsxXSB8fCAnYW55JztcbiAgICAgIHJldHVybiBgUmVjb3JkPHN0cmluZywgJHt0aGlzLnRlcnJhZm9ybVR5cGVUb1R5cGVTY3JpcHQoaW5uZXJUeXBlKX0+YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdhbnknO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHN0cmluZyB0byBQYXNjYWxDYXNlXG4gICAqIEBwYXJhbSBzdHIgSW5wdXQgc3RyaW5nXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBwYXNjYWxDYXNlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAuc3BsaXQoJ18nKVxuICAgICAgLm1hcChwYXJ0ID0+IHBhcnQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwYXJ0LnNsaWNlKDEpKVxuICAgICAgLmpvaW4oJycpO1xuICB9XG59XG4iXX0=