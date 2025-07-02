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
      // CloudFormationの特殊タグを処理するための前処理
      const processedContent = this.preprocessCloudFormationTags(content);
      return yaml.load(processedContent) as CloudFormationTemplate;
    } else {
      throw new Error(`Unsupported file format: ${filePath}`);
    }
  }

  /**
   * CloudFormationの特殊タグを処理するための前処理
   * @param content YAMLコンテンツ
   */
  private static preprocessCloudFormationTags(content: string): string {
    // !Ref タグを処理
    content = content.replace(/!Ref\s+([^\s]+)/g, '{ "Ref": "$1" }');
    
    // !GetAtt タグを処理
    content = content.replace(/!GetAtt\s+([^\s]+)\.([^\s]+)/g, '{ "Fn::GetAtt": ["$1", "$2"] }');
    
    // !Sub タグを処理
    content = content.replace(/!Sub\s+'([^']+)'/g, '{ "Fn::Sub": "$1" }');
    content = content.replace(/!Sub\s+"([^"]+)"/g, '{ "Fn::Sub": "$1" }');
    content = content.replace(/!Sub\s+([^\s'"]+)/g, '{ "Fn::Sub": "$1" }');
    
    // !Join タグを処理
    content = content.replace(/!Join\s+\[\s*'([^']+)'\s*,\s*\[(.*?)\]\s*\]/g, '{ "Fn::Join": ["$1", [$2]] }');
    content = content.replace(/!Join\s+\[\s*"([^"]+)"\s*,\s*\[(.*?)\]\s*\]/g, '{ "Fn::Join": ["$1", [$2]] }');
    
    return content;
  }
}
