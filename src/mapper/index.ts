import { CloudFormationResource, CloudFormationTemplate } from '../parser';

export interface TerraformResource {
  type: string;
  name: string;
  properties: Record<string, any>;
  dependencies?: string[];
}

export interface TerraformConfig {
  resources: TerraformResource[];
  variables: Record<string, any>;
  outputs: Record<string, any>;
}

/**
 * Maps CloudFormation resources to Terraform resources
 */
export class ResourceMapper {
  // Resource type mapping from CloudFormation to Terraform
  private static readonly resourceTypeMapping: Record<string, string> = {
    'AWS::S3::Bucket': 'aws_s3_bucket',
    'AWS::IAM::Role': 'aws_iam_role',
    'AWS::Lambda::Function': 'aws_lambda_function',
    'AWS::DynamoDB::Table': 'aws_dynamodb_table',
    // Add more mappings as needed
  };

  /**
   * Map a CloudFormation template to Terraform configuration
   * @param template CloudFormation template
   */
  public static mapTemplate(template: CloudFormationTemplate): TerraformConfig {
    const resources: TerraformResource[] = [];
    const variables: Record<string, any> = {};
    const outputs: Record<string, any> = {};

    // Map parameters to variables
    if (template.Parameters) {
      Object.entries(template.Parameters).forEach(([name, param]) => {
        variables[name] = {
          type: this.mapParameterType(param.Type),
          default: param.Default,
          description: param.Description,
        };
      });
    }

    // Map resources
    Object.entries(template.Resources).forEach(([name, resource]) => {
      const terraformResource = this.mapResource(name, resource);
      if (terraformResource) {
        resources.push(terraformResource);
      }
    });

    // Map outputs
    if (template.Outputs) {
      Object.entries(template.Outputs).forEach(([name, output]) => {
        outputs[name] = {
          value: this.transformExpression(output.Value),
          description: output.Description,
        };
      });
    }

    return { resources, variables, outputs };
  }

  /**
   * Map a CloudFormation resource to a Terraform resource
   * @param name Resource name
   * @param resource CloudFormation resource
   */
  private static mapResource(name: string, resource: CloudFormationResource): TerraformResource | null {
    const terraformType = this.resourceTypeMapping[resource.Type];
    
    if (!terraformType) {
      console.warn(`Unsupported resource type: ${resource.Type}`);
      return null;
    }

    const properties = this.mapProperties(resource.Type, resource.Properties);
    const dependencies = resource.DependsOn 
      ? Array.isArray(resource.DependsOn) 
        ? resource.DependsOn 
        : [resource.DependsOn]
      : undefined;

    return {
      type: terraformType,
      name: this.sanitizeResourceName(name),
      properties,
      dependencies,
    };
  }

  /**
   * Map CloudFormation properties to Terraform properties
   * @param resourceType CloudFormation resource type
   * @param properties CloudFormation properties
   */
  private static mapProperties(_resourceType: string, properties: Record<string, any>): Record<string, any> {
    // This is a simplified implementation
    // In a real implementation, you would need to handle specific property mappings for each resource type
    const result: Record<string, any> = {};
    
    Object.entries(properties).forEach(([key, value]) => {
      const terraformKey = this.camelToSnakeCase(key);
      result[terraformKey] = this.transformValue(value);
    });
    
    return result;
  }

  /**
   * Transform CloudFormation values to Terraform values
   * @param value CloudFormation value
   */
  private static transformValue(value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(item => this.transformValue(item));
      } else {
        // Handle intrinsic functions like Ref, GetAtt, etc.
        if ('Ref' in value) {
          return `\${var.${value.Ref}}`;
        } else if ('Fn::GetAtt' in value) {
          const [resourceName, attribute] = value['Fn::GetAtt'];
          return `\${${this.resourceTypeMapping[resourceName]}.${this.sanitizeResourceName(resourceName)}.${this.camelToSnakeCase(attribute)}}`;
        } else {
          const result: Record<string, any> = {};
          Object.entries(value).forEach(([k, v]) => {
            result[this.camelToSnakeCase(k)] = this.transformValue(v);
          });
          return result;
        }
      }
    }
    return value;
  }

  /**
   * Transform CloudFormation expressions to Terraform expressions
   * @param expression CloudFormation expression
   */
  private static transformExpression(expression: any): string {
    // Simplified implementation
    if (typeof expression === 'object' && expression !== null) {
      if ('Ref' in expression) {
        return `\${var.${expression.Ref}}`;
      } else if ('Fn::GetAtt' in expression) {
        const [resourceName, attribute] = expression['Fn::GetAtt'];
        return `\${${this.resourceTypeMapping[resourceName]}.${this.sanitizeResourceName(resourceName)}.${this.camelToSnakeCase(attribute)}}`;
      }
    }
    return String(expression);
  }

  /**
   * Map CloudFormation parameter type to Terraform variable type
   * @param cfnType CloudFormation parameter type
   */
  private static mapParameterType(cfnType: string): string {
    switch (cfnType) {
      case 'String':
        return 'string';
      case 'Number':
        return 'number';
      case 'CommaDelimitedList':
        return 'list(string)';
      default:
        return 'any';
    }
  }

  /**
   * Convert camelCase to snake_case
   * @param str camelCase string
   */
  private static camelToSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  /**
   * Sanitize resource name for Terraform
   * @param name Resource name
   */
  private static sanitizeResourceName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  }
}
