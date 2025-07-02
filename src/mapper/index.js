"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMapper = void 0;
/**
 * Maps CloudFormation resources to Terraform resources
 */
class ResourceMapper {
    /**
     * Map a CloudFormation template to Terraform configuration
     * @param template CloudFormation template
     */
    static mapTemplate(template) {
        const resources = [];
        const variables = {};
        const outputs = {};
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
    static mapResource(name, resource) {
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
    static mapProperties(_resourceType, properties) {
        // This is a simplified implementation
        // In a real implementation, you would need to handle specific property mappings for each resource type
        const result = {};
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
    static transformValue(value) {
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                return value.map(item => this.transformValue(item));
            }
            else {
                // Handle intrinsic functions like Ref, GetAtt, etc.
                if ('Ref' in value) {
                    return `\${var.${value.Ref}}`;
                }
                else if ('Fn::GetAtt' in value) {
                    const [resourceName, attribute] = value['Fn::GetAtt'];
                    return `\${${this.resourceTypeMapping[resourceName]}.${this.sanitizeResourceName(resourceName)}.${this.camelToSnakeCase(attribute)}}`;
                }
                else {
                    const result = {};
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
    static transformExpression(expression) {
        // Simplified implementation
        if (typeof expression === 'object' && expression !== null) {
            if ('Ref' in expression) {
                return `\${var.${expression.Ref}}`;
            }
            else if ('Fn::GetAtt' in expression) {
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
    static mapParameterType(cfnType) {
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
    static camelToSnakeCase(str) {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
    /**
     * Sanitize resource name for Terraform
     * @param name Resource name
     */
    static sanitizeResourceName(name) {
        return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    }
}
exports.ResourceMapper = ResourceMapper;
// Resource type mapping from CloudFormation to Terraform
ResourceMapper.resourceTypeMapping = {
    'AWS::S3::Bucket': 'aws_s3_bucket',
    'AWS::IAM::Role': 'aws_iam_role',
    'AWS::Lambda::Function': 'aws_lambda_function',
    'AWS::DynamoDB::Table': 'aws_dynamodb_table',
    // Add more mappings as needed
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFlQTs7R0FFRztBQUNILE1BQWEsY0FBYztJQVV6Qjs7O09BR0c7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWdDO1FBQ3hELE1BQU0sU0FBUyxHQUF3QixFQUFFLENBQUM7UUFDMUMsTUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQztRQUMxQyxNQUFNLE9BQU8sR0FBd0IsRUFBRSxDQUFDO1FBRXhDLDhCQUE4QjtRQUM5QixJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUM1RCxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDdkMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO29CQUN0QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7aUJBQy9CLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRTtZQUM5RCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNELElBQUksaUJBQWlCLEVBQUUsQ0FBQztnQkFDdEIsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILGNB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SUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7WUFDeEksQ0FBQztRQUNILENBQUM7UUFDRCxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQWU7UUFDN0MsUUFBUSxPQUFPLEVBQUUsQ0FBQztZQUNoQixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxRQUFRLENBQUM7WUFDbEIsS0FBSyxRQUFRO2dCQUNYLE9BQU8sUUFBUSxDQUFDO1lBQ2xCLEtBQUssb0JBQW9CO2dCQUN2QixPQUFPLGNBQWMsQ0FBQztZQUN4QjtnQkFDRSxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFXO1FBQ3pDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7T0FHRztJQUNLLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFZO1FBQzlDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzRCxDQUFDOztBQTVLSCx3Q0E2S0M7QUE1S0MseURBQXlEO0FBQ2pDLGtDQUFtQixHQUEyQjtJQUNwRSxpQkFBaUIsRUFBRSxlQUFlO0lBQ2xDLGdCQUFnQixFQUFFLGNBQWM7SUFDaEMsdUJBQXVCLEVBQUUscUJBQXFCO0lBQzlDLHNCQUFzQixFQUFFLG9CQUFvQjtJQUM1Qyw4QkFBOEI7Q0FDL0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsb3VkRm9ybWF0aW9uUmVzb3VyY2UsIENsb3VkRm9ybWF0aW9uVGVtcGxhdGUgfSBmcm9tICcuLi9wYXJzZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRlcnJhZm9ybVJlc291cmNlIHtcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIGRlcGVuZGVuY2llcz86IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlcnJhZm9ybUNvbmZpZyB7XG4gIHJlc291cmNlczogVGVycmFmb3JtUmVzb3VyY2VbXTtcbiAgdmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBvdXRwdXRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xufVxuXG4vKipcbiAqIE1hcHMgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VzIHRvIFRlcnJhZm9ybSByZXNvdXJjZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc291cmNlTWFwcGVyIHtcbiAgLy8gUmVzb3VyY2UgdHlwZSBtYXBwaW5nIGZyb20gQ2xvdWRGb3JtYXRpb24gdG8gVGVycmFmb3JtXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHJlc291cmNlVHlwZU1hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgJ0FXUzo6UzM6OkJ1Y2tldCc6ICdhd3NfczNfYnVja2V0JyxcbiAgICAnQVdTOjpJQU06OlJvbGUnOiAnYXdzX2lhbV9yb2xlJyxcbiAgICAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJzogJ2F3c19sYW1iZGFfZnVuY3Rpb24nLFxuICAgICdBV1M6OkR5bmFtb0RCOjpUYWJsZSc6ICdhd3NfZHluYW1vZGJfdGFibGUnLFxuICAgIC8vIEFkZCBtb3JlIG1hcHBpbmdzIGFzIG5lZWRlZFxuICB9O1xuXG4gIC8qKlxuICAgKiBNYXAgYSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSB0byBUZXJyYWZvcm0gY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0gdGVtcGxhdGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWFwVGVtcGxhdGUodGVtcGxhdGU6IENsb3VkRm9ybWF0aW9uVGVtcGxhdGUpOiBUZXJyYWZvcm1Db25maWcge1xuICAgIGNvbnN0IHJlc291cmNlczogVGVycmFmb3JtUmVzb3VyY2VbXSA9IFtdO1xuICAgIGNvbnN0IHZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IG91dHB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAgIC8vIE1hcCBwYXJhbWV0ZXJzIHRvIHZhcmlhYmxlc1xuICAgIGlmICh0ZW1wbGF0ZS5QYXJhbWV0ZXJzKSB7XG4gICAgICBPYmplY3QuZW50cmllcyh0ZW1wbGF0ZS5QYXJhbWV0ZXJzKS5mb3JFYWNoKChbbmFtZSwgcGFyYW1dKSA9PiB7XG4gICAgICAgIHZhcmlhYmxlc1tuYW1lXSA9IHtcbiAgICAgICAgICB0eXBlOiB0aGlzLm1hcFBhcmFtZXRlclR5cGUocGFyYW0uVHlwZSksXG4gICAgICAgICAgZGVmYXVsdDogcGFyYW0uRGVmYXVsdCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcGFyYW0uRGVzY3JpcHRpb24sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBNYXAgcmVzb3VyY2VzXG4gICAgT2JqZWN0LmVudHJpZXModGVtcGxhdGUuUmVzb3VyY2VzKS5mb3JFYWNoKChbbmFtZSwgcmVzb3VyY2VdKSA9PiB7XG4gICAgICBjb25zdCB0ZXJyYWZvcm1SZXNvdXJjZSA9IHRoaXMubWFwUmVzb3VyY2UobmFtZSwgcmVzb3VyY2UpO1xuICAgICAgaWYgKHRlcnJhZm9ybVJlc291cmNlKSB7XG4gICAgICAgIHJlc291cmNlcy5wdXNoKHRlcnJhZm9ybVJlc291cmNlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIE1hcCBvdXRwdXRzXG4gICAgaWYgKHRlbXBsYXRlLk91dHB1dHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRlbXBsYXRlLk91dHB1dHMpLmZvckVhY2goKFtuYW1lLCBvdXRwdXRdKSA9PiB7XG4gICAgICAgIG91dHB1dHNbbmFtZV0gPSB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihvdXRwdXQuVmFsdWUpLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBvdXRwdXQuRGVzY3JpcHRpb24sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyByZXNvdXJjZXMsIHZhcmlhYmxlcywgb3V0cHV0cyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcCBhIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHRvIGEgVGVycmFmb3JtIHJlc291cmNlXG4gICAqIEBwYXJhbSBuYW1lIFJlc291cmNlIG5hbWVcbiAgICogQHBhcmFtIHJlc291cmNlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBtYXBSZXNvdXJjZShuYW1lOiBzdHJpbmcsIHJlc291cmNlOiBDbG91ZEZvcm1hdGlvblJlc291cmNlKTogVGVycmFmb3JtUmVzb3VyY2UgfCBudWxsIHtcbiAgICBjb25zdCB0ZXJyYWZvcm1UeXBlID0gdGhpcy5yZXNvdXJjZVR5cGVNYXBwaW5nW3Jlc291cmNlLlR5cGVdO1xuICAgIFxuICAgIGlmICghdGVycmFmb3JtVHlwZSkge1xuICAgICAgY29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCByZXNvdXJjZSB0eXBlOiAke3Jlc291cmNlLlR5cGV9YCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5tYXBQcm9wZXJ0aWVzKHJlc291cmNlLlR5cGUsIHJlc291cmNlLlByb3BlcnRpZXMpO1xuICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IHJlc291cmNlLkRlcGVuZHNPbiBcbiAgICAgID8gQXJyYXkuaXNBcnJheShyZXNvdXJjZS5EZXBlbmRzT24pIFxuICAgICAgICA/IHJlc291cmNlLkRlcGVuZHNPbiBcbiAgICAgICAgOiBbcmVzb3VyY2UuRGVwZW5kc09uXVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGVycmFmb3JtVHlwZSxcbiAgICAgIG5hbWU6IHRoaXMuc2FuaXRpemVSZXNvdXJjZU5hbWUobmFtZSksXG4gICAgICBwcm9wZXJ0aWVzLFxuICAgICAgZGVwZW5kZW5jaWVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWFwIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgdG8gVGVycmFmb3JtIHByb3BlcnRpZXNcbiAgICogQHBhcmFtIHJlc291cmNlVHlwZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlXG4gICAqIEBwYXJhbSBwcm9wZXJ0aWVzIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXNcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIG1hcFByb3BlcnRpZXMoX3Jlc291cmNlVHlwZTogc3RyaW5nLCBwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb25cbiAgICAvLyBJbiBhIHJlYWwgaW1wbGVtZW50YXRpb24sIHlvdSB3b3VsZCBuZWVkIHRvIGhhbmRsZSBzcGVjaWZpYyBwcm9wZXJ0eSBtYXBwaW5ncyBmb3IgZWFjaCByZXNvdXJjZSB0eXBlXG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgXG4gICAgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBjb25zdCB0ZXJyYWZvcm1LZXkgPSB0aGlzLmNhbWVsVG9TbmFrZUNhc2Uoa2V5KTtcbiAgICAgIHJlc3VsdFt0ZXJyYWZvcm1LZXldID0gdGhpcy50cmFuc2Zvcm1WYWx1ZSh2YWx1ZSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm0gQ2xvdWRGb3JtYXRpb24gdmFsdWVzIHRvIFRlcnJhZm9ybSB2YWx1ZXNcbiAgICogQHBhcmFtIHZhbHVlIENsb3VkRm9ybWF0aW9uIHZhbHVlXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyB0cmFuc2Zvcm1WYWx1ZSh2YWx1ZTogYW55KTogYW55IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5tYXAoaXRlbSA9PiB0aGlzLnRyYW5zZm9ybVZhbHVlKGl0ZW0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnRyaW5zaWMgZnVuY3Rpb25zIGxpa2UgUmVmLCBHZXRBdHQsIGV0Yy5cbiAgICAgICAgaWYgKCdSZWYnIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGBcXCR7dmFyLiR7dmFsdWUuUmVmfX1gO1xuICAgICAgICB9IGVsc2UgaWYgKCdGbjo6R2V0QXR0JyBpbiB2YWx1ZSkge1xuICAgICAgICAgIGNvbnN0IFtyZXNvdXJjZU5hbWUsIGF0dHJpYnV0ZV0gPSB2YWx1ZVsnRm46OkdldEF0dCddO1xuICAgICAgICAgIHJldHVybiBgXFwkeyR7dGhpcy5yZXNvdXJjZVR5cGVNYXBwaW5nW3Jlc291cmNlTmFtZV19LiR7dGhpcy5zYW5pdGl6ZVJlc291cmNlTmFtZShyZXNvdXJjZU5hbWUpfS4ke3RoaXMuY2FtZWxUb1NuYWtlQ2FzZShhdHRyaWJ1dGUpfX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChbaywgdl0pID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFt0aGlzLmNhbWVsVG9TbmFrZUNhc2UoayldID0gdGhpcy50cmFuc2Zvcm1WYWx1ZSh2KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm0gQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvbnMgdG8gVGVycmFmb3JtIGV4cHJlc3Npb25zXG4gICAqIEBwYXJhbSBleHByZXNzaW9uIENsb3VkRm9ybWF0aW9uIGV4cHJlc3Npb25cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbjogYW55KTogc3RyaW5nIHtcbiAgICAvLyBTaW1wbGlmaWVkIGltcGxlbWVudGF0aW9uXG4gICAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnb2JqZWN0JyAmJiBleHByZXNzaW9uICE9PSBudWxsKSB7XG4gICAgICBpZiAoJ1JlZicgaW4gZXhwcmVzc2lvbikge1xuICAgICAgICByZXR1cm4gYFxcJHt2YXIuJHtleHByZXNzaW9uLlJlZn19YDtcbiAgICAgIH0gZWxzZSBpZiAoJ0ZuOjpHZXRBdHQnIGluIGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgW3Jlc291cmNlTmFtZSwgYXR0cmlidXRlXSA9IGV4cHJlc3Npb25bJ0ZuOjpHZXRBdHQnXTtcbiAgICAgICAgcmV0dXJuIGBcXCR7JHt0aGlzLnJlc291cmNlVHlwZU1hcHBpbmdbcmVzb3VyY2VOYW1lXX0uJHt0aGlzLnNhbml0aXplUmVzb3VyY2VOYW1lKHJlc291cmNlTmFtZSl9LiR7dGhpcy5jYW1lbFRvU25ha2VDYXNlKGF0dHJpYnV0ZSl9fWA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcoZXhwcmVzc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogTWFwIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlciB0eXBlIHRvIFRlcnJhZm9ybSB2YXJpYWJsZSB0eXBlXG4gICAqIEBwYXJhbSBjZm5UeXBlIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlciB0eXBlXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBtYXBQYXJhbWV0ZXJUeXBlKGNmblR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgc3dpdGNoIChjZm5UeXBlKSB7XG4gICAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgICByZXR1cm4gJ3N0cmluZyc7XG4gICAgICBjYXNlICdOdW1iZXInOlxuICAgICAgICByZXR1cm4gJ251bWJlcic7XG4gICAgICBjYXNlICdDb21tYURlbGltaXRlZExpc3QnOlxuICAgICAgICByZXR1cm4gJ2xpc3Qoc3RyaW5nKSc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ2FueSc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgY2FtZWxDYXNlIHRvIHNuYWtlX2Nhc2VcbiAgICogQHBhcmFtIHN0ciBjYW1lbENhc2Ugc3RyaW5nXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBjYW1lbFRvU25ha2VDYXNlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgJ18kMScpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgcmVzb3VyY2UgbmFtZSBmb3IgVGVycmFmb3JtXG4gICAqIEBwYXJhbSBuYW1lIFJlc291cmNlIG5hbWVcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHNhbml0aXplUmVzb3VyY2VOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5hbWUucmVwbGFjZSgvW15hLXpBLVowLTlfXS9nLCAnXycpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbn1cbiJdfQ==