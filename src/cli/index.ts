#!/usr/bin/env node
import * as yargs from 'yargs';
import * as path from 'path';
import { CloudFormationParser } from '../parser';
import { ResourceMapper } from '../mapper';
import { CdktfGenerator } from '../generator';

async function main() {
  const argv = await yargs
    .option('input', {
      alias: 'i',
      description: 'Input CloudFormation template file',
      type: 'string',
      demandOption: true,
    })
    .option('output', {
      alias: 'o',
      description: 'Output directory for CDKTF code',
      type: 'string',
      default: './cdktf-output',
    })
    .option('language', {
      alias: 'l',
      description: 'Target language for CDKTF code',
      choices: ['typescript', 'python', 'java'],
      default: 'typescript',
    })
    .help()
    .alias('help', 'h')
    .parseSync();

  try {
    console.log(`Parsing CloudFormation template: ${argv.input}`);
    const template = CloudFormationParser.parseFile(argv.input);
    
    console.log('Mapping CloudFormation resources to Terraform resources');
    const terraformConfig = ResourceMapper.mapTemplate(template);
    
    console.log(`Generating CDKTF code in ${argv.language}`);
    CdktfGenerator.generateCode(
      terraformConfig, 
      argv.output, 
      argv.language as 'typescript' | 'python' | 'java'
    );
    
    console.log(`CDKTF code generated successfully in ${path.resolve(argv.output)}`);
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
