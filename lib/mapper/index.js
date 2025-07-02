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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFwcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWVBOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBVXpCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBZ0M7UUFDeEQsTUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQztRQUMxQyxNQUFNLFNBQVMsR0FBd0IsRUFBRSxDQUFDO1FBQzFDLE1BQU0sT0FBTyxHQUF3QixFQUFFLENBQUM7UUFFeEMsOEJBQThCO1FBQzlCLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQzVELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRztvQkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUN2QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87b0JBQ3RCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztpQkFDL0IsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELGdCQUFnQjtRQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQzlELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO2dCQUN0QixTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDcEMsQ0FBQztRQUNILENBQUMs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QixDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztZQUN4SSxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBZTtRQUM3QyxRQUFRLE9BQU8sRUFBRSxDQUFDO1lBQ2hCLEtBQUssUUFBUTtnQkFDWCxPQUFPLFFBQVEsQ0FBQztZQUNsQixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxRQUFRLENBQUM7WUFDbEIsS0FBSyxvQkFBb0I7Z0JBQ3ZCLE9BQU8sY0FBYyxDQUFDO1lBQ3hCO2dCQUNFLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQVc7UUFDekMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQVk7UUFDOUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNELENBQUM7O0FBNUtILHdDQTZLQztBQTVLQyx5REFBeUQ7QUFDakMsa0NBQW1CLEdBQTJCO0lBQ3BFLGlCQUFpQixFQUFFLGVBQWU7SUFDbEMsZ0JBQWdCLEVBQUUsY0FBYztJQUNoQyx1QkFBdUIsRUFBRSxxQkFBcUI7SUFDOUMsc0JBQXNCLEVBQUUsb0JBQW9CO0lBQzVDLDhCQUE4QjtDQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xvdWRGb3JtYXRpb25SZXNvdXJjZSwgQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZSB9IGZyb20gJy4uL3BhcnNlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVycmFmb3JtUmVzb3VyY2Uge1xuICB0eXBlOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgcHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgZGVwZW5kZW5jaWVzPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVycmFmb3JtQ29uZmlnIHtcbiAgcmVzb3VyY2VzOiBUZXJyYWZvcm1SZXNvdXJjZVtdO1xuICB2YXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIG91dHB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT47XG59XG5cbi8qKlxuICogTWFwcyBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMgdG8gVGVycmFmb3JtIHJlc291cmNlc1xuICovXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VNYXBwZXIge1xuICAvLyBSZXNvdXJjZSB0eXBlIG1hcHBpbmcgZnJvbSBDbG91ZEZvcm1hdGlvbiB0byBUZXJyYWZvcm1cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgcmVzb3VyY2VUeXBlTWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAnQVdTOjpTMzo6QnVja2V0JzogJ2F3c19zM19idWNrZXQnLFxuICAgICdBV1M6OklBTTo6Um9sZSc6ICdhd3NfaWFtX3JvbGUnLFxuICAgICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nOiAnYXdzX2xhbWJkYV9mdW5jdGlvbicsXG4gICAgJ0FXUzo6RHluYW1vREI6OlRhYmxlJzogJ2F3c19keW5hbW9kYl90YWJsZScsXG4gICAgLy8gQWRkIG1vcmUgbWFwcGluZ3MgYXMgbmVlZGVkXG4gIH07XG5cbiAgLyoqXG4gICAqIE1hcCBhIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIHRvIFRlcnJhZm9ybSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtYXBUZW1wbGF0ZSh0ZW1wbGF0ZTogQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZSk6IFRlcnJhZm9ybUNvbmZpZyB7XG4gICAgY29uc3QgcmVzb3VyY2VzOiBUZXJyYWZvcm1SZXNvdXJjZVtdID0gW107XG4gICAgY29uc3QgdmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgY29uc3Qgb3V0cHV0czogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXG4gICAgLy8gTWFwIHBhcmFtZXRlcnMgdG8gdmFyaWFibGVzXG4gICAgaWYgKHRlbXBsYXRlLlBhcmFtZXRlcnMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRlbXBsYXRlLlBhcmFtZXRlcnMpLmZvckVhY2goKFtuYW1lLCBwYXJhbV0pID0+IHtcbiAgICAgICAgdmFyaWFibGVzW25hbWVdID0ge1xuICAgICAgICAgIHR5cGU6IHRoaXMubWFwUGFyYW1ldGVyVHlwZShwYXJhbS5UeXBlKSxcbiAgICAgICAgICBkZWZhdWx0OiBwYXJhbS5EZWZhdWx0LFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBwYXJhbS5EZXNjcmlwdGlvbixcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE1hcCByZXNvdXJjZXNcbiAgICBPYmplY3QuZW50cmllcyh0ZW1wbGF0ZS5SZXNvdXJjZXMpLmZvckVhY2goKFtuYW1lLCByZXNvdXJjZV0pID0+IHtcbiAgICAgIGNvbnN0IHRlcnJhZm9ybVJlc291cmNlID0gdGhpcy5tYXBSZXNvdXJjZShuYW1lLCByZXNvdXJjZSk7XG4gICAgICBpZiAodGVycmFmb3JtUmVzb3VyY2UpIHtcbiAgICAgICAgcmVzb3VyY2VzLnB1c2godGVycmFmb3JtUmVzb3VyY2UpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTWFwIG91dHB1dHNcbiAgICBpZiAodGVtcGxhdGUuT3V0cHV0cykge1xuICAgICAgT2JqZWN0LmVudHJpZXModGVtcGxhdGUuT3V0cHV0cykuZm9yRWFjaCgoW25hbWUsIG91dHB1dF0pID0+IHtcbiAgICAgICAgb3V0cHV0c1tuYW1lXSA9IHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKG91dHB1dC5WYWx1ZSksXG4gICAgICAgICAgZGVzY3JpcHRpb246IG91dHB1dC5EZXNjcmlwdGlvbixcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7IHJlc291cmNlcywgdmFyaWFibGVzLCBvdXRwdXRzIH07XG4gIH1cblxuICAvKipcbiAgICogTWFwIGEgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdG8gYSBUZXJyYWZvcm0gcmVzb3VyY2VcbiAgICogQHBhcmFtIG5hbWUgUmVzb3VyY2UgbmFtZVxuICAgKiBAcGFyYW0gcmVzb3VyY2UgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIG1hcFJlc291cmNlKG5hbWU6IHN0cmluZywgcmVzb3VyY2U6IENsb3VkRm9ybWF0aW9uUmVzb3VyY2UpOiBUZXJyYWZvcm1SZXNvdXJjZSB8IG51bGwge1xuICAgIGNvbnN0IHRlcnJhZm9ybVR5cGUgPSB0aGlzLnJlc291cmNlVHlwZU1hcHBpbmdbcmVzb3VyY2UuVHlwZV07XG4gICAgXG4gICAgaWYgKCF0ZXJyYWZvcm1UeXBlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFVuc3VwcG9ydGVkIHJlc291cmNlIHR5cGU6ICR7cmVzb3VyY2UuVHlwZX1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLm1hcFByb3BlcnRpZXMocmVzb3VyY2UuVHlwZSwgcmVzb3VyY2UuUHJvcGVydGllcyk7XG4gICAgY29uc3QgZGVwZW5kZW5jaWVzID0gcmVzb3VyY2UuRGVwZW5kc09uIFxuICAgICAgPyBBcnJheS5pc0FycmF5KHJlc291cmNlLkRlcGVuZHNPbikgXG4gICAgICAgID8gcmVzb3VyY2UuRGVwZW5kc09uIFxuICAgICAgICA6IFtyZXNvdXJjZS5EZXBlbmRzT25dXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0ZXJyYWZvcm1UeXBlLFxuICAgICAgbmFtZTogdGhpcy5zYW5pdGl6ZVJlc291cmNlTmFtZShuYW1lKSxcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgICBkZXBlbmRlbmNpZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXAgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyB0byBUZXJyYWZvcm0gcHJvcGVydGllc1xuICAgKiBAcGFyYW0gcmVzb3VyY2VUeXBlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGVcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllc1xuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgbWFwUHJvcGVydGllcyhfcmVzb3VyY2VUeXBlOiBzdHJpbmcsIHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBpbXBsZW1lbnRhdGlvblxuICAgIC8vIEluIGEgcmVhbCBpbXBsZW1lbnRhdGlvbiwgeW91IHdvdWxkIG5lZWQgdG8gaGFuZGxlIHNwZWNpZmljIHByb3BlcnR5IG1hcHBpbmdzIGZvciBlYWNoIHJlc291cmNlIHR5cGVcbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBcbiAgICBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGNvbnN0IHRlcnJhZm9ybUtleSA9IHRoaXMuY2FtZWxUb1NuYWtlQ2FzZShrZXkpO1xuICAgICAgcmVzdWx0W3RlcnJhZm9ybUtleV0gPSB0aGlzLnRyYW5zZm9ybVZhbHVlKHZhbHVlKTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBDbG91ZEZvcm1hdGlvbiB2YWx1ZXMgdG8gVGVycmFmb3JtIHZhbHVlc1xuICAgKiBAcGFyYW0gdmFsdWUgQ2xvdWRGb3JtYXRpb24gdmFsdWVcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHRyYW5zZm9ybVZhbHVlKHZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLm1hcChpdGVtID0+IHRoaXMudHJhbnNmb3JtVmFsdWUoaXRlbSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlIGludHJpbnNpYyBmdW5jdGlvbnMgbGlrZSBSZWYsIEdldEF0dCwgZXRjLlxuICAgICAgICBpZiAoJ1JlZicgaW4gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gYFxcJHt2YXIuJHt2YWx1ZS5SZWZ9fWA7XG4gICAgICAgIH0gZWxzZSBpZiAoJ0ZuOjpHZXRBdHQnIGluIHZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgW3Jlc291cmNlTmFtZSwgYXR0cmlidXRlXSA9IHZhbHVlWydGbjo6R2V0QXR0J107XG4gICAgICAgICAgcmV0dXJuIGBcXCR7JHt0aGlzLnJlc291cmNlVHlwZU1hcHBpbmdbcmVzb3VyY2VOYW1lXX0uJHt0aGlzLnNhbml0aXplUmVzb3VyY2VOYW1lKHJlc291cmNlTmFtZSl9LiR7dGhpcy5jYW1lbFRvU25ha2VDYXNlKGF0dHJpYnV0ZSl9fWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgICAgICAgT2JqZWN0LmVudHJpZXModmFsdWUpLmZvckVhY2goKFtrLCB2XSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W3RoaXMuY2FtZWxUb1NuYWtlQ2FzZShrKV0gPSB0aGlzLnRyYW5zZm9ybVZhbHVlKHYpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9ucyB0byBUZXJyYWZvcm0gZXhwcmVzc2lvbnNcbiAgICogQHBhcmFtIGV4cHJlc3Npb24gQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvblxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgdHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uOiBhbnkpOiBzdHJpbmcge1xuICAgIC8vIFNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb25cbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdvYmplY3QnICYmIGV4cHJlc3Npb24gIT09IG51bGwpIHtcbiAgICAgIGlmICgnUmVmJyBpbiBleHByZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBgXFwke3Zhci4ke2V4cHJlc3Npb24uUmVmfX1gO1xuICAgICAgfSBlbHNlIGlmICgnRm46OkdldEF0dCcgaW4gZXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBbcmVzb3VyY2VOYW1lLCBhdHRyaWJ1dGVdID0gZXhwcmVzc2lvblsnRm46OkdldEF0dCddO1xuICAgICAgICByZXR1cm4gYFxcJHske3RoaXMucmVzb3VyY2VUeXBlTWFwcGluZ1tyZXNvdXJjZU5hbWVdfS4ke3RoaXMuc2FuaXRpemVSZXNvdXJjZU5hbWUocmVzb3VyY2VOYW1lKX0uJHt0aGlzLmNhbWVsVG9TbmFrZUNhc2UoYXR0cmlidXRlKX19YDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhleHByZXNzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXAgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyIHR5cGUgdG8gVGVycmFmb3JtIHZhcmlhYmxlIHR5cGVcbiAgICogQHBhcmFtIGNmblR5cGUgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyIHR5cGVcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIG1hcFBhcmFtZXRlclR5cGUoY2ZuVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKGNmblR5cGUpIHtcbiAgICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICAgIGNhc2UgJ0NvbW1hRGVsaW1pdGVkTGlzdCc6XG4gICAgICAgIHJldHVybiAnbGlzdChzdHJpbmcpJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnYW55JztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBjYW1lbENhc2UgdG8gc25ha2VfY2FzZVxuICAgKiBAcGFyYW0gc3RyIGNhbWVsQ2FzZSBzdHJpbmdcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGNhbWVsVG9TbmFrZUNhc2Uoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCAnXyQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZSByZXNvdXJjZSBuYW1lIGZvciBUZXJyYWZvcm1cbiAgICogQHBhcmFtIG5hbWUgUmVzb3VyY2UgbmFtZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgc2FuaXRpemVSZXNvdXJjZU5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOV9dL2csICdfJykudG9Mb3dlckNhc2UoKTtcbiAgfVxufVxuIl19