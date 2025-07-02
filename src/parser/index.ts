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

// CloudFormation YAML タグのカスタムスキーマ
const cfnSchema = yaml.DEFAULT_SCHEMA.extend([
  new yaml.Type('!Ref', {
    kind: 'scalar',
    construct: function(data) {
      return { Ref: data };
    }
  }),
  new yaml.Type('!GetAtt', {
    kind: 'scalar',
    construct: function(data) {
      const parts = data.split('.');
      return { 'Fn::GetAtt': [parts[0], parts.slice(1).join('.')] };
    }
  }),
  new yaml.Type('!Sub', {
    kind: 'scalar',
    construct: function(data) {
      return { 'Fn::Sub': data };
    }
  }),
  new yaml.Type('!Join', {
    kind: 'sequence',
    construct: function(data) {
      return { 'Fn::Join': data };
    }
  })
]);

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
      return yaml.load(content, { schema: cfnSchema }) as CloudFormationTemplate;
    } else {
      throw new Error(`Unsupported file format: ${filePath}`);
    }
  }
}
