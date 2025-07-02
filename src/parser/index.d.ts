export interface CloudFormationTemplate {
    AWSTemplateFormatVersion?: string;
    Description?: string;
    Parameters?: Record<string, any>;
    Resources: Record<string, CloudFormationResource>;
    Outputs?: Record<string, any>;
}
export interface CloudFormationResource {
    Type: string;
    Properties: Record<string, any>;
    DependsOn?: string | string[];
}
/**
 * CloudFormation template parser
 */
export declare class CloudFormationParser {
    /**
     * Parse a CloudFormation template from a file
     * @param filePath Path to the CloudFormation template file
     */
    static parseFile(filePath: string): CloudFormationTemplate;
}
