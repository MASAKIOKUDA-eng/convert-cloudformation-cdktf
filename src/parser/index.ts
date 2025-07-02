import * as fs from 'fs';
import * as yaml from 'js-yaml';

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
export class CloudFormationParser {
  /**
   * Parse a CloudFormation template from a file
   * @param filePath Path to the CloudFormation template file
   */
  public static parseFile(filePath: string): CloudFormationTemplate {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (filePath.endsWith('.json')) {
      return JSON.parse(content) as CloudFormationTemplate;
    } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      return yaml.load(content) as CloudFormationTemplate;
    } else {
      throw new Error(`Unsupported file format: ${filePath}`);
    }
  }
}
