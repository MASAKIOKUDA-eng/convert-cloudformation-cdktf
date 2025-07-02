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
            'import { App, TerraformStack, TerraformOutput } from "cdktf";',
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
            const value = output.value;
            let outputValue = value;
            if (typeof value === 'string' && (value.includes('props.') || value.includes('.'))) {
                outputValue = value;
            }
            else {
                outputValue = JSON.stringify(value);
            }
            return `    new TerraformOutput(this, "${name}", {
      value: ${outputValue},
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
            .map(([key, value]) => {
            if (typeof value === 'string' && (value.includes('props.') || value.includes('.'))) {
                return `      ${key}: ${value},`;
            }
            else {
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
        var _a, _b;
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
            const innerType = ((_a = terraformType.match(/list\((.*)\)/)) === null || _a === void 0 ? void 0 : _a[1]) || 'any';
            return `${this.terraformTypeToTypeScript(innerType)}[]`;
        }
        else if (terraformType.startsWith('map')) {
            const innerType = ((_b = terraformType.match(/map\((.*)\)/)) === null || _b === void 0 ? void 0 : _b[1]) || 'any';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhdG9yL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFHN0I7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFDekI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUN4QixNQUF1QixFQUN2QixTQUFpQixFQUNqQixXQUE2QyxZQUFZO1FBRXpELDhDQUE4QztRQUM5QyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELFFBQVEsUUFBUSxFQUFFLENBQUM7WUFDakIsS0FBSyxZQUFZO2dCQUNmLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDUixLQUFLLFFBQVE7Z0JBQ1gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDM0MsTUFBTTtZQUNSLEtBQUssTUFBTTtnQkFDVCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxNQUFNLENBQUMsc0JBQXNCLENBQUMsTUFBdUIsRUFBRSxTQUFpQjtRQUM5RSxtQkFBbUI7UUFDbkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxD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QUMsRUFBRSxDQUFDLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFyVEQsd0NBcVRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFRlcnJhZm9ybUNvbmZpZywgVGVycmFmb3JtUmVzb3VyY2UgfSBmcm9tICcuLi9tYXBwZXInO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBDREtURiBjb2RlIGZyb20gVGVycmFmb3JtIGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIENka3RmR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIEdlbmVyYXRlIENES1RGIGNvZGUgZnJvbSBUZXJyYWZvcm0gY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0gY29uZmlnIFRlcnJhZm9ybSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBvdXRwdXREaXIgT3V0cHV0IGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gbGFuZ3VhZ2UgVGFyZ2V0IGxhbmd1YWdlICh0eXBlc2NyaXB0LCBweXRob24sIGV0Yy4pXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdlbmVyYXRlQ29kZShcbiAgICBjb25maWc6IFRlcnJhZm9ybUNvbmZpZywgXG4gICAgb3V0cHV0RGlyOiBzdHJpbmcsIFxuICAgIGxhbmd1YWdlOiAndHlwZXNjcmlwdCcgfCAncHl0aG9uJyB8ICdqYXZhJyA9ICd0eXBlc2NyaXB0J1xuICApOiB2b2lkIHtcbiAgICAvLyBDcmVhdGUgb3V0cHV0IGRpcmVjdG9yeSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKG91dHB1dERpcikpIHtcbiAgICAgIGZzLm1rZGlyU3luYyhvdXRwdXREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgIGNhc2UgJ3R5cGVzY3JpcHQnOlxuICAgICAgICB0aGlzLmdlbmVyYXRlVHlwZVNjcmlwdENvZGUoY29uZmlnLCBvdXRwdXREaXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3B5dGhvbic6XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQeXRob25Db2RlKGNvbmZpZywgb3V0cHV0RGlyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdqYXZhJzpcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUphdmFDb2RlKGNvbmZpZywgb3V0cHV0RGlyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGxhbmd1YWdlOiAke2xhbmd1YWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBUeXBlU2NyaXB0IENES1RGIGNvZGVcbiAgICogQHBhcmFtIGNvbmZpZyBUZXJyYWZvcm0gY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0gb3V0cHV0RGlyIE91dHB1dCBkaXJlY3RvcnlcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHlwZVNjcmlwdENvZGUoY29uZmlnOiBUZXJyYWZvcm1Db25maWcsIG91dHB1dERpcjogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gR2VuZXJhdGUgbWFpbi50c1xuICAgIGNvbnN0IG1haW5Db2RlID0gdGhpcy5nZW5lcmF0ZVR5cGVTY3JpcHRNYWluRmlsZShjb25maWcpO1xuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dERpciwgJ21haW4udHMnKSwgbWFpbkNvZGUpO1xuXG4gICAgLy8gR2VuZXJhdGUgY2RrdGYuanNvblxuICAgIGNvbnN0IGNka3RmQ29uZmlnID0gdGhpcy5nZW5lcmF0ZUNka3RmQ29uZmlnKCk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0RGlyLCAnY2RrdGYuanNvbicpLCBKU09OLnN0cmluZ2lmeShjZGt0ZkNvbmZpZywgbnVsbCwgMikpO1xuXG4gICAgLy8gR2VuZXJhdGUgcGFja2FnZS5qc29uXG4gICAgY29uc3QgcGFja2FnZUpzb24gPSB0aGlzLmdlbmVyYXRlUGFja2FnZUpzb24oKTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXREaXIsICdwYWNrYWdlLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24sIG51bGwsIDIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBUeXBlU2NyaXB0IG1haW4gZmlsZVxuICAgKiBAcGFyYW0gY29uZmlnIFRlcnJhZm9ybSBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVR5cGVTY3JpcHRNYWluRmlsZShjb25maWc6IFRlcnJhZm9ybUNvbmZpZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaW1wb3J0cyA9IFtcbiAgICAgICdpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiOycsXG4gICAgICAnaW1wb3J0IHsgQXBwLCBUZXJyYWZvcm1TdGFjaywgVGVycmFmb3JtT3V0cHV0IH0gZnJvbSBcImNka3RmXCI7JyxcbiAgICAgICdpbXBvcnQgKiBhcyBhd3MgZnJvbSBcIkBjZGt0Zi9wcm92aWRlci1hd3NcIjsnLFxuICAgIF07XG5cbiAgICBjb25zdCB2YXJpYWJsZXMgPSBPYmplY3QuZW50cmllcyhjb25maWcudmFyaWFibGVzKS5tYXAoKFtuYW1lLCB2YXJpYWJsZV0pID0+IHtcbiAgICAgIGNvbnN0IHZhclR5cGUgPSAodmFyaWFibGUgYXMgYW55KS50eXBlIHx8ICdzdHJpbmcnO1xuICAgICAgcmV0dXJuIGAgIHB1YmxpYyByZWFkb25seSAke25hbWV9OiAke3RoaXMudGVycmFmb3JtVHlwZVRvVHlwZVNjcmlwdCh2YXJUeXBlKX07YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHZhcmlhYmxlSW5pdGlhbGl6ZXJzID0gT2JqZWN0LmVudHJpZXMoY29uZmlnLnZhcmlhYmxlcykubWFwKChbbmFtZSwgdmFyaWFibGVdKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSAodmFyaWFibGUgYXMgYW55KS5kZWZhdWx0O1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBgICAgIHRoaXMuJHtuYW1lfSA9IHByb3BzPy4ke25hbWV9ID8/ICR7SlNPTi5zdHJpbmdpZnkoZGVmYXVsdFZhbHVlKX07YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBgICAgIHRoaXMuJHtuYW1lfSA9IHByb3BzLiR7bmFtZX07YDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlcyA9IGNvbmZpZy5yZXNvdXJjZXMubWFwKHJlc291cmNlID0+IHRoaXMuZ2VuZXJhdGVUeXBlU2NyaXB0UmVzb3VyY2UocmVzb3VyY2UpKTtcblxuICAgIGNvbnN0IG91dHB1dHMgPSBPYmplY3QuZW50cmllcyhjb25maWcub3V0cHV0cykubWFwKChbbmFtZSwgb3V0cHV0XSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSAob3V0cHV0IGFzIGFueSkudmFsdWU7XG4gICAgICBsZXQgb3V0cHV0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgKHZhbHVlLmluY2x1ZGVzKCdwcm9wcy4nKSB8fCB2YWx1ZS5pbmNsdWRlcygnLicpKSkge1xuICAgICAgICBvdXRwdXRWYWx1ZSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0VmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBgICAgIG5ldyBUZXJyYWZvcm1PdXRwdXQodGhpcywgXCIke25hbWV9XCIsIHtcbiAgICAgIHZhbHVlOiAke291dHB1dFZhbHVlfSxcbiAgICAgIGRlc2NyaXB0aW9uOiAke0pTT04uc3RyaW5naWZ5KChvdXRwdXQgYXMgYW55KS5kZXNjcmlwdGlvbil9LFxuICAgIH0pO2A7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYCR7aW1wb3J0cy5qb2luKCdcXG4nKX1cblxuaW50ZXJmYWNlIE15U3RhY2tQcm9wcyB7XG4ke09iamVjdC5lbnRyaWVzKGNvbmZpZy52YXJpYWJsZXMpLm1hcCgoW25hbWUsIHZhcmlhYmxlXSkgPT4ge1xuICBjb25zdCB2YXJUeXBlID0gKHZhcmlhYmxlIGFzIGFueSkudHlwZSB8fCAnc3RyaW5nJztcbiAgY29uc3QgcmVxdWlyZWQgPSAodmFyaWFibGUgYXMgYW55KS5kZWZhdWx0ID09PSB1bmRlZmluZWQ7XG4gIHJldHVybiBgICAke25hbWV9JHtyZXF1aXJlZCA/ICcnIDogJz8nfTogJHt0aGlzLnRlcnJhZm9ybVR5cGVUb1R5cGVTY3JpcHQodmFyVHlwZSl9O2A7XG59KS5qb2luKCdcXG4nKX1cbn1cblxuY2xhc3MgTXlTdGFjayBleHRlbmRzIFRlcnJhZm9ybVN0YWNrIHtcbiR7dmFyaWFibGVzLmpvaW4oJ1xcbicpfVxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNeVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4ke3ZhcmlhYmxlSW5pdGlhbGl6ZXJzLmpvaW4oJ1xcbicpfVxuXG4gICAgLy8gRGVmaW5lIEFXUyBwcm92aWRlclxuICAgIG5ldyBhd3MuQXdzUHJvdmlkZXIodGhpcywgXCJhd3NcIiwge1xuICAgICAgcmVnaW9uOiBcInVzLXdlc3QtMlwiLCAvLyBDaGFuZ2UgYXMgbmVlZGVkXG4gICAgfSk7XG5cbiAgICAvLyBEZWZpbmUgcmVzb3VyY2VzXG4ke3Jlc291cmNlcy5qb2luKCdcXG5cXG4nKX1cblxuICAgIC8vIERlZmluZSBvdXRwdXRzXG4ke291dHB1dHMuam9pbignXFxuXFxuJyl9XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IE15U3RhY2soYXBwLCBcImNvbnZlcnRlZC1zdGFja1wiLCB7XG4gIC8vIFByb3ZpZGUgdmFsdWVzIGZvciByZXF1aXJlZCB2YXJpYWJsZXNcbn0pO1xuYXBwLnN5bnRoKCk7XG5gO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIFR5cGVTY3JpcHQgcmVzb3VyY2VcbiAgICogQHBhcmFtIHJlc291cmNlIFRlcnJhZm9ybSByZXNvdXJjZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUeXBlU2NyaXB0UmVzb3VyY2UocmVzb3VyY2U6IFRlcnJhZm9ybVJlc291cmNlKTogc3RyaW5nIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmVudHJpZXMocmVzb3VyY2UucHJvcGVydGllcylcbiAgICAgIC5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAodmFsdWUuaW5jbHVkZXMoJ3Byb3BzLicpIHx8IHZhbHVlLmluY2x1ZGVzKCcuJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGAgICAgICAke2tleX06ICR7dmFsdWV9LGA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGAgICAgICAke2tleX06ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfSxgO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgcmV0dXJuIGAgICAgY29uc3QgJHtyZXNvdXJjZS5uYW1lfSA9IG5ldyBhd3MuJHt0aGlzLnBhc2NhbENhc2UocmVzb3VyY2UudHlwZSl9KHRoaXMsIFwiJHtyZXNvdXJjZS5uYW1lfVwiLCB7XG4ke3Byb3BlcnRpZXN9XG4gICAgfSk7YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBjZGt0Zi5qc29uIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlQ2RrdGZDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgXCJsYW5ndWFnZVwiOiBcInR5cGVzY3JpcHRcIixcbiAgICAgIFwiYXBwXCI6IFwibnBtIHJ1biAtLXNpbGVudCBjb21waWxlICYmIG5vZGUgbWFpbi5qc1wiLFxuICAgICAgXCJwcm9qZWN0SWRcIjogXCJjb252ZXJ0ZWQtcHJvamVjdFwiLFxuICAgICAgXCJzZW5kQ3Jhc2hSZXBvcnRzXCI6IGZhbHNlLFxuICAgICAgXCJ0ZXJyYWZvcm1Qcm92aWRlcnNcIjogW1xuICAgICAgICBcImF3c0B+PiA0LjBcIlxuICAgICAgXSxcbiAgICAgIFwidGVycmFmb3JtTW9kdWxlc1wiOiBbXSxcbiAgICAgIFwiY29udGV4dFwiOiB7XG4gICAgICAgIFwiZXhjbHVkZVN0YWNrSWRGcm9tTG9naWNhbElkc1wiOiBcInRydWVcIixcbiAgICAgICAgXCJhbGxvd1NlcENoYXJzSW5Mb2dpY2FsSWRzXCI6IFwidHJ1ZVwiXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBwYWNrYWdlLmpzb25cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlUGFja2FnZUpzb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgXCJuYW1lXCI6IFwiY29udmVydGVkLWNka3RmLXByb2plY3RcIixcbiAgICAgIFwidmVyc2lvblwiOiBcIjEuMC4wXCIsXG4gICAgICBcIm1haW5cIjogXCJtYWluLmpzXCIsXG4gICAgICBcInR5cGVzXCI6IFwibWFpbi50c1wiLFxuICAgICAgXCJsaWNlbnNlXCI6IFwiTVBMLTIuMFwiLFxuICAgICAgXCJwcml2YXRlXCI6IHRydWUsXG4gICAgICBcInNjcmlwdHNcIjoge1xuICAgICAgICBcImdldFwiOiBcImNka3RmIGdldFwiLFxuICAgICAgICBcImJ1aWxkXCI6IFwidHNjXCIsXG4gICAgICAgIFwic3ludGhcIjogXCJjZGt0ZiBzeW50aFwiLFxuICAgICAgICBcImNvbXBpbGVcIjogXCJ0c2MgLS1wcmV0dHlcIixcbiAgICAgICAgXCJ3YXRjaFwiOiBcInRzYyAtd1wiLFxuICAgICAgICBcInRlc3RcIjogXCJqZXN0XCIsXG4gICAgICAgIFwidXBncmFkZVwiOiBcIm5wbSBpIGNka3RmQGxhdGVzdCBjZGt0Zi1jbGlAbGF0ZXN0XCIsXG4gICAgICAgIFwidXBncmFkZTpuZXh0XCI6IFwibnBtIGkgY2RrdGZAbmV4dCBjZGt0Zi1jbGlAbmV4dFwiXG4gICAgICB9LFxuICAgICAgXCJlbmdpbmVzXCI6IHtcbiAgICAgICAgXCJub2RlXCI6IFwiPj0xNC4wXCJcbiAgICAgIH0sXG4gICAgICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgICAgIFwiQGNka3RmL3Byb3ZpZGVyLWF3c1wiOiBcIl4xMi4wLjBcIixcbiAgICAgICAgXCJjZGt0ZlwiOiBcIl4wLjE1LjBcIixcbiAgICAgICAgXCJjb25zdHJ1Y3RzXCI6IFwiXjEwLjEuMFwiXG4gICAgICB9LFxuICAgICAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgICAgICBcIkB0eXBlcy9qZXN0XCI6IFwiXjI5LjQuMFwiLFxuICAgICAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjE4LjE0LjZcIixcbiAgICAgICAgXCJqZXN0XCI6IFwiXjI5LjUuMFwiLFxuICAgICAgICBcInRzLWplc3RcIjogXCJeMjkuMC41XCIsXG4gICAgICAgIFwidHMtbm9kZVwiOiBcIl4xMC45LjFcIixcbiAgICAgICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjQuOS41XCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIFB5dGhvbiBDREtURiBjb2RlXG4gICAqIEBwYXJhbSBjb25maWcgVGVycmFmb3JtIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIG91dHB1dERpciBPdXRwdXQgZGlyZWN0b3J5XG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVB5dGhvbkNvZGUoX2NvbmZpZzogVGVycmFmb3JtQ29uZmlnLCBvdXRwdXREaXI6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIFNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb24gLSB3b3VsZCBuZWVkIHRvIGJlIGV4cGFuZGVkIGZvciBhIHJlYWwgdG9vbFxuICAgIGNvbnN0IG1haW5Db2RlID0gYCMhL3Vzci9iaW4vZW52IHB5dGhvblxuZnJvbSBjb25zdHJ1Y3RzIGltcG9ydCBDb25zdHJ1Y3RcbmZyb20gY2RrdGYgaW1wb3J0IEFwcCwgVGVycmFmb3JtU3RhY2ssIFRlcnJhZm9ybU91dHB1dFxuZnJvbSBjZGt0Zl9jZGt0Zl9wcm92aWRlcl9hd3MgaW1wb3J0IEF3c1Byb3ZpZGVyXG5cbmNsYXNzIE15U3RhY2soVGVycmFmb3JtU3RhY2spOlxuICAgIGRlZiBfX2luaXRfXyhzZWxmLCBzY29wZTogQ29uc3RydWN0LCBpZDogc3RyKTpcbiAgICAgICAgc3VwZXIoKS5fX2luaXRfXyhzY29wZSwgaWQpXG5cbiAgICAgICAgIyBEZWZpbmUgQVdTIHByb3ZpZGVyXG4gICAgICAgIEF3c1Byb3ZpZGVyKHNlbGYsIFwiYXdzXCIsIHJlZ2lvbj1cInVzLXdlc3QtMlwiKVxuXG4gICAgICAgICMgVE9ETzogQWRkIHJlc291cmNlcyBhbmQgb3V0cHV0c1xuXG5hcHAgPSBBcHAoKVxuTXlTdGFjayhhcHAsIFwiY29udmVydGVkLXN0YWNrXCIpXG5hcHAuc3ludGgoKVxuYDtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXREaXIsICdtYWluLnB5JyksIG1haW5Db2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBKYXZhIENES1RGIGNvZGVcbiAgICogQHBhcmFtIGNvbmZpZyBUZXJyYWZvcm0gY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0gb3V0cHV0RGlyIE91dHB1dCBkaXJlY3RvcnlcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlSmF2YUNvZGUoX2NvbmZpZzogVGVycmFmb3JtQ29uZmlnLCBvdXRwdXREaXI6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIFNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb24gLSB3b3VsZCBuZWVkIHRvIGJlIGV4cGFuZGVkIGZvciBhIHJlYWwgdG9vbFxuICAgIGNvbnN0IG1haW5Db2RlID0gYHBhY2thZ2UgY29tLm15Y29tcGFueS5hcHA7XG5cbmltcG9ydCBjb20uaGFzaGljb3JwLmNka3RmLkFwcDtcbmltcG9ydCBjb20uaGFzaGljb3JwLmNka3RmLlRlcnJhZm9ybVN0YWNrO1xuaW1wb3J0IHNvZnR3YXJlLmNvbnN0cnVjdHMuQ29uc3RydWN0O1xuaW1wb3J0IGNvbS5oYXNoaWNvcnAuY2RrdGYucHJvdmlkZXJzLmF3cy5Bd3NQcm92aWRlcjtcblxucHVibGljIGNsYXNzIE1haW4gZXh0ZW5kcyBUZXJyYWZvcm1TdGFjayB7XG4gICAgcHVibGljIE1haW4oZmluYWwgQ29uc3RydWN0IHNjb3BlLCBmaW5hbCBTdHJpbmcgaWQpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICAvLyBEZWZpbmUgQVdTIHByb3ZpZGVyXG4gICAgICAgIEF3c1Byb3ZpZGVyLkJ1aWxkZXIuY3JlYXRlKHRoaXMsIFwiYXdzXCIpXG4gICAgICAgICAgICAucmVnaW9uKFwidXMtd2VzdC0yXCIpXG4gICAgICAgICAgICAuYnVpbGQoKTtcblxuICAgICAgICAvLyBUT0RPOiBBZGQgcmVzb3VyY2VzIGFuZCBvdXRwdXRzXG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykge1xuICAgICAgICBmaW5hbCBBcHAgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgICBuZXcgTWFpbihhcHAsIFwiY29udmVydGVkLXN0YWNrXCIpO1xuICAgICAgICBhcHAuc3ludGgoKTtcbiAgICB9XG59XG5gO1xuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dERpciwgJ01haW4uamF2YScpLCBtYWluQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBUZXJyYWZvcm0gdHlwZSB0byBUeXBlU2NyaXB0IHR5cGVcbiAgICogQHBhcmFtIHRlcnJhZm9ybVR5cGUgVGVycmFmb3JtIHR5cGVcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHRlcnJhZm9ybVR5cGVUb1R5cGVTY3JpcHQodGVycmFmb3JtVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGVycmFmb3JtVHlwZS5zdGFydHNXaXRoKCdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgIH0gZWxzZSBpZiAodGVycmFmb3JtVHlwZS5zdGFydHNXaXRoKCdudW1iZXInKSkge1xuICAgICAgcmV0dXJuICdudW1iZXInO1xuICAgIH0gZWxzZSBpZiAodGVycmFmb3JtVHlwZS5zdGFydHNXaXRoKCdib29sJykpIHtcbiAgICAgIHJldHVybiAnYm9vbGVhbic7XG4gICAgfSBlbHNlIGlmICh0ZXJyYWZvcm1UeXBlLnN0YXJ0c1dpdGgoJ2xpc3QnKSkge1xuICAgICAgY29uc3QgaW5uZXJUeXBlID0gdGVycmFmb3JtVHlwZS5tYXRjaCgvbGlzdFxcKCguKilcXCkvKT8uWzFdIHx8ICdhbnknO1xuICAgICAgcmV0dXJuIGAke3RoaXMudGVycmFmb3JtVHlwZVRvVHlwZVNjcmlwdChpbm5lclR5cGUpfVtdYDtcbiAgICB9IGVsc2UgaWYgKHRlcnJhZm9ybVR5cGUuc3RhcnRzV2l0aCgnbWFwJykpIHtcbiAgICAgIGNvbnN0IGlubmVyVHlwZSA9IHRlcnJhZm9ybVR5cGUubWF0Y2goL21hcFxcKCguKilcXCkvKT8uWzFdIHx8ICdhbnknO1xuICAgICAgcmV0dXJuIGBSZWNvcmQ8c3RyaW5nLCAke3RoaXMudGVycmFmb3JtVHlwZVRvVHlwZVNjcmlwdChpbm5lclR5cGUpfT5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2FueSc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgc3RyaW5nIHRvIFBhc2NhbENhc2VcbiAgICogQHBhcmFtIHN0ciBJbnB1dCBzdHJpbmdcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHBhc2NhbENhc2Uoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHJcbiAgICAgIC5zcGxpdCgnXycpXG4gICAgICAubWFwKHBhcnQgPT4gcGFydC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHBhcnQuc2xpY2UoMSkpXG4gICAgICAuam9pbignJyk7XG4gIH1cbn1cbiJdfQ==