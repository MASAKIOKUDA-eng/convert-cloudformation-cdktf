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
                    return `props.${value.Ref}`;
                }
                else if ('Fn::GetAtt' in value) {
                    const [resourceName, attribute] = value['Fn::GetAtt'];
                    const resourceId = this.sanitizeResourceName(resourceName);
                    return `${resourceId}.${this.camelToSnakeCase(attribute)}`;
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
                if (expression.Ref.startsWith('AWS::') || expression.Ref === 'AWS::Region' || expression.Ref === 'AWS::AccountId') {
                    // AWS特殊変数の場合
                    return `"${expression.Ref}"`;
                }
                else {
                    // リソース参照の場合
                    const resourceId = this.sanitizeResourceName(expression.Ref);
                    return resourceId;
                }
            }
            else if ('Fn::GetAtt' in expression) {
                const [resourceName, attribute] = expression['Fn::GetAtt'];
                const resourceId = this.sanitizeResourceName(resourceName);
                return `${resourceId}.${this.camelToSnakeCase(attribute)}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFwcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWVBOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBVXpCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBZ0M7UUFDeEQsTUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQztRQUMxQyxNQUFNLFNBQVMsR0FBd0IsRUFBRSxDQUFDO1FBQzFDLE1BQU0sT0FBTyxHQUF3QixFQUFFLENBQUM7UUFFeEMsOEJBQThCO1FBQzlCLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQzVELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRztvQkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUN2QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87b0JBQ3RCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztpQkFDL0IsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELGdCQUFnQjtRQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQzlELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO2dCQUN0QixTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDcEMsQ0FBQztRQUNILENBQUMs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QUM7SUFDM0QsQ0FBQzs7QUFyTEgsd0NBc0xDO0FBckxDLHlEQUF5RDtBQUNqQyxrQ0FBbUIsR0FBMkI7SUFDcEUsaUJBQWlCLEVBQUUsZUFBZTtJQUNsQyxnQkFBZ0IsRUFBRSxjQUFjO0lBQ2hDLHVCQUF1QixFQUFFLHFCQUFxQjtJQUM5QyxzQkFBc0IsRUFBRSxvQkFBb0I7SUFDNUMsOEJBQThCO0NBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbG91ZEZvcm1hdGlvblJlc291cmNlLCBDbG91ZEZvcm1hdGlvblRlbXBsYXRlIH0gZnJvbSAnLi4vcGFyc2VyJztcblxuZXhwb3J0IGludGVyZmFjZSBUZXJyYWZvcm1SZXNvdXJjZSB7XG4gIHR5cGU6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBkZXBlbmRlbmNpZXM/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXJyYWZvcm1Db25maWcge1xuICByZXNvdXJjZXM6IFRlcnJhZm9ybVJlc291cmNlW107XG4gIHZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgb3V0cHV0czogUmVjb3JkPHN0cmluZywgYW55Pjtcbn1cblxuLyoqXG4gKiBNYXBzIENsb3VkRm9ybWF0aW9uIHJlc291cmNlcyB0byBUZXJyYWZvcm0gcmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZU1hcHBlciB7XG4gIC8vIFJlc291cmNlIHR5cGUgbWFwcGluZyBmcm9tIENsb3VkRm9ybWF0aW9uIHRvIFRlcnJhZm9ybVxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSByZXNvdXJjZVR5cGVNYXBwaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICdBV1M6OlMzOjpCdWNrZXQnOiAnYXdzX3MzX2J1Y2tldCcsXG4gICAgJ0FXUzo6SUFNOjpSb2xlJzogJ2F3c19pYW1fcm9sZScsXG4gICAgJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbic6ICdhd3NfbGFtYmRhX2Z1bmN0aW9uJyxcbiAgICAnQVdTOjpEeW5hbW9EQjo6VGFibGUnOiAnYXdzX2R5bmFtb2RiX3RhYmxlJyxcbiAgICAvLyBBZGQgbW9yZSBtYXBwaW5ncyBhcyBuZWVkZWRcbiAgfTtcblxuICAvKipcbiAgICogTWFwIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgdG8gVGVycmFmb3JtIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIHRlbXBsYXRlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1hcFRlbXBsYXRlKHRlbXBsYXRlOiBDbG91ZEZvcm1hdGlvblRlbXBsYXRlKTogVGVycmFmb3JtQ29uZmlnIHtcbiAgICBjb25zdCByZXNvdXJjZXM6IFRlcnJhZm9ybVJlc291cmNlW10gPSBbXTtcbiAgICBjb25zdCB2YXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBjb25zdCBvdXRwdXRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cbiAgICAvLyBNYXAgcGFyYW1ldGVycyB0byB2YXJpYWJsZXNcbiAgICBpZiAodGVtcGxhdGUuUGFyYW1ldGVycykge1xuICAgICAgT2JqZWN0LmVudHJpZXModGVtcGxhdGUuUGFyYW1ldGVycykuZm9yRWFjaCgoW25hbWUsIHBhcmFtXSkgPT4ge1xuICAgICAgICB2YXJpYWJsZXNbbmFtZV0gPSB7XG4gICAgICAgICAgdHlwZTogdGhpcy5tYXBQYXJhbWV0ZXJUeXBlKHBhcmFtLlR5cGUpLFxuICAgICAgICAgIGRlZmF1bHQ6IHBhcmFtLkRlZmF1bHQsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHBhcmFtLkRlc2NyaXB0aW9uLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTWFwIHJlc291cmNlc1xuICAgIE9iamVjdC5lbnRyaWVzKHRlbXBsYXRlLlJlc291cmNlcykuZm9yRWFjaCgoW25hbWUsIHJlc291cmNlXSkgPT4ge1xuICAgICAgY29uc3QgdGVycmFmb3JtUmVzb3VyY2UgPSB0aGlzLm1hcFJlc291cmNlKG5hbWUsIHJlc291cmNlKTtcbiAgICAgIGlmICh0ZXJyYWZvcm1SZXNvdXJjZSkge1xuICAgICAgICByZXNvdXJjZXMucHVzaCh0ZXJyYWZvcm1SZXNvdXJjZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBNYXAgb3V0cHV0c1xuICAgIGlmICh0ZW1wbGF0ZS5PdXRwdXRzKSB7XG4gICAgICBPYmplY3QuZW50cmllcyh0ZW1wbGF0ZS5PdXRwdXRzKS5mb3JFYWNoKChbbmFtZSwgb3V0cHV0XSkgPT4ge1xuICAgICAgICBvdXRwdXRzW25hbWVdID0ge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24ob3V0cHV0LlZhbHVlKSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogb3V0cHV0LkRlc2NyaXB0aW9uLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcmVzb3VyY2VzLCB2YXJpYWJsZXMsIG91dHB1dHMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXAgYSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0byBhIFRlcnJhZm9ybSByZXNvdXJjZVxuICAgKiBAcGFyYW0gbmFtZSBSZXNvdXJjZSBuYW1lXG4gICAqIEBwYXJhbSByZXNvdXJjZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgbWFwUmVzb3VyY2UobmFtZTogc3RyaW5nLCByZXNvdXJjZTogQ2xvdWRGb3JtYXRpb25SZXNvdXJjZSk6IFRlcnJhZm9ybVJlc291cmNlIHwgbnVsbCB7XG4gICAgY29uc3QgdGVycmFmb3JtVHlwZSA9IHRoaXMucmVzb3VyY2VUeXBlTWFwcGluZ1tyZXNvdXJjZS5UeXBlXTtcbiAgICBcbiAgICBpZiAoIXRlcnJhZm9ybVR5cGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgVW5zdXBwb3J0ZWQgcmVzb3VyY2UgdHlwZTogJHtyZXNvdXJjZS5UeXBlfWApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMubWFwUHJvcGVydGllcyhyZXNvdXJjZS5UeXBlLCByZXNvdXJjZS5Qcm9wZXJ0aWVzKTtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSByZXNvdXJjZS5EZXBlbmRzT24gXG4gICAgICA/IEFycmF5LmlzQXJyYXkocmVzb3VyY2UuRGVwZW5kc09uKSBcbiAgICAgICAgPyByZXNvdXJjZS5EZXBlbmRzT24gXG4gICAgICAgIDogW3Jlc291cmNlLkRlcGVuZHNPbl1cbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRlcnJhZm9ybVR5cGUsXG4gICAgICBuYW1lOiB0aGlzLnNhbml0aXplUmVzb3VyY2VOYW1lKG5hbWUpLFxuICAgICAgcHJvcGVydGllcyxcbiAgICAgIGRlcGVuZGVuY2llcyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcCBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIHRvIFRlcnJhZm9ybSBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSByZXNvdXJjZVR5cGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZVxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBtYXBQcm9wZXJ0aWVzKF9yZXNvdXJjZVR5cGU6IHN0cmluZywgcHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGlmaWVkIGltcGxlbWVudGF0aW9uXG4gICAgLy8gSW4gYSByZWFsIGltcGxlbWVudGF0aW9uLCB5b3Ugd291bGQgbmVlZCB0byBoYW5kbGUgc3BlY2lmaWMgcHJvcGVydHkgbWFwcGluZ3MgZm9yIGVhY2ggcmVzb3VyY2UgdHlwZVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIFxuICAgIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgY29uc3QgdGVycmFmb3JtS2V5ID0gdGhpcy5jYW1lbFRvU25ha2VDYXNlKGtleSk7XG4gICAgICByZXN1bHRbdGVycmFmb3JtS2V5XSA9IHRoaXMudHJhbnNmb3JtVmFsdWUodmFsdWUpO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIENsb3VkRm9ybWF0aW9uIHZhbHVlcyB0byBUZXJyYWZvcm0gdmFsdWVzXG4gICAqIEBwYXJhbSB2YWx1ZSBDbG91ZEZvcm1hdGlvbiB2YWx1ZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgdHJhbnNmb3JtVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubWFwKGl0ZW0gPT4gdGhpcy50cmFuc2Zvcm1WYWx1ZShpdGVtKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGUgaW50cmluc2ljIGZ1bmN0aW9ucyBsaWtlIFJlZiwgR2V0QXR0LCBldGMuXG4gICAgICAgIGlmICgnUmVmJyBpbiB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBgcHJvcHMuJHt2YWx1ZS5SZWZ9YDtcbiAgICAgICAgfSBlbHNlIGlmICgnRm46OkdldEF0dCcgaW4gdmFsdWUpIHtcbiAgICAgICAgICBjb25zdCBbcmVzb3VyY2VOYW1lLCBhdHRyaWJ1dGVdID0gdmFsdWVbJ0ZuOjpHZXRBdHQnXTtcbiAgICAgICAgICBjb25zdCByZXNvdXJjZUlkID0gdGhpcy5zYW5pdGl6ZVJlc291cmNlTmFtZShyZXNvdXJjZU5hbWUpO1xuICAgICAgICAgIHJldHVybiBgJHtyZXNvdXJjZUlkfS4ke3RoaXMuY2FtZWxUb1NuYWtlQ2FzZShhdHRyaWJ1dGUpfWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgICAgICAgT2JqZWN0LmVudHJpZXModmFsdWUpLmZvckVhY2goKFtrLCB2XSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W3RoaXMuY2FtZWxUb1NuYWtlQ2FzZShrKV0gPSB0aGlzLnRyYW5zZm9ybVZhbHVlKHYpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9ucyB0byBUZXJyYWZvcm0gZXhwcmVzc2lvbnNcbiAgICogQHBhcmFtIGV4cHJlc3Npb24gQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvblxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgdHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uOiBhbnkpOiBzdHJpbmcge1xuICAgIC8vIFNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb25cbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdvYmplY3QnICYmIGV4cHJlc3Npb24gIT09IG51bGwpIHtcbiAgICAgIGlmICgnUmVmJyBpbiBleHByZXNzaW9uKSB7XG4gICAgICAgIGlmIChleHByZXNzaW9uLlJlZi5zdGFydHNXaXRoKCdBV1M6OicpIHx8IGV4cHJlc3Npb24uUmVmID09PSAnQVdTOjpSZWdpb24nIHx8IGV4cHJlc3Npb24uUmVmID09PSAnQVdTOjpBY2NvdW50SWQnKSB7XG4gICAgICAgICAgLy8gQVdT54m55q6K5aSJ5pWw44Gu5aC05ZCIXG4gICAgICAgICAgcmV0dXJuIGBcIiR7ZXhwcmVzc2lvbi5SZWZ9XCJgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOODquOCveODvOOCueWPgueFp+OBruWgtOWQiFxuICAgICAgICAgIGNvbnN0IHJlc291cmNlSWQgPSB0aGlzLnNhbml0aXplUmVzb3VyY2VOYW1lKGV4cHJlc3Npb24uUmVmKTtcbiAgICAgICAgICByZXR1cm4gcmVzb3VyY2VJZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgnRm46OkdldEF0dCcgaW4gZXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBbcmVzb3VyY2VOYW1lLCBhdHRyaWJ1dGVdID0gZXhwcmVzc2lvblsnRm46OkdldEF0dCddO1xuICAgICAgICBjb25zdCByZXNvdXJjZUlkID0gdGhpcy5zYW5pdGl6ZVJlc291cmNlTmFtZShyZXNvdXJjZU5hbWUpO1xuICAgICAgICByZXR1cm4gYCR7cmVzb3VyY2VJZH0uJHt0aGlzLmNhbWVsVG9TbmFrZUNhc2UoYXR0cmlidXRlKX1gO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nKGV4cHJlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcCBDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXIgdHlwZSB0byBUZXJyYWZvcm0gdmFyaWFibGUgdHlwZVxuICAgKiBAcGFyYW0gY2ZuVHlwZSBDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXIgdHlwZVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgbWFwUGFyYW1ldGVyVHlwZShjZm5UeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHN3aXRjaCAoY2ZuVHlwZSkge1xuICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgICAgcmV0dXJuICdudW1iZXInO1xuICAgICAgY2FzZSAnQ29tbWFEZWxpbWl0ZWRMaXN0JzpcbiAgICAgICAgcmV0dXJuICdsaXN0KHN0cmluZyknO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICdhbnknO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGNhbWVsQ2FzZSB0byBzbmFrZV9jYXNlXG4gICAqIEBwYXJhbSBzdHIgY2FtZWxDYXNlIHN0cmluZ1xuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgY2FtZWxUb1NuYWtlQ2FzZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csICdfJDEnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIHJlc291cmNlIG5hbWUgZm9yIFRlcnJhZm9ybVxuICAgKiBAcGFyYW0gbmFtZSBSZXNvdXJjZSBuYW1lXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBzYW5pdGl6ZVJlc291cmNlTmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoL1teYS16QS1aMC05X10vZywgJ18nKS50b0xvd2VyQ2FzZSgpO1xuICB9XG59XG4iXX0=