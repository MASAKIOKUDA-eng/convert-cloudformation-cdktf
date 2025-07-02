import { CloudFormationTemplate } from '../parser';
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
export declare class ResourceMapper {
    private static readonly resourceTypeMapping;
    /**
     * Map a CloudFormation template to Terraform configuration
     * @param template CloudFormation template
     */
    static mapTemplate(template: CloudFormationTemplate): TerraformConfig;
    /**
     * Map a CloudFormation resource to a Terraform resource
     * @param name Resource name
     * @param resource CloudFormation resource
     */
    private static mapResource;
    /**
     * Map CloudFormation properties to Terraform properties
     * @param resourceType CloudFormation resource type
     * @param properties CloudFormation properties
     */
    private static mapProperties;
    /**
     * Transform CloudFormation values to Terraform values
     * @param value CloudFormation value
     */
    private static transformValue;
    /**
     * Transform CloudFormation expressions to Terraform expressions
     * @param expression CloudFormation expression
     */
    private static transformExpression;
    /**
     * Map CloudFormation parameter type to Terraform variable type
     * @param cfnType CloudFormation parameter type
     */
    private static mapParameterType;
    /**
     * Convert camelCase to snake_case
     * @param str camelCase string
     */
    private static camelToSnakeCase;
    /**
     * Sanitize resource name for Terraform
     * @param name Resource name
     */
    private static sanitizeResourceName;
}
